import * as R from 'ramda'

import show from './show'
import set from './set'
import describe from './describe'
import test from './testCommand'
import { State } from '../..'
import { SingleASTNode } from 'simple-markdown'
import {
  TestAndComputeContentAndState,
  ComputeContentAndState,
  ConditionalFunction,
} from '..'
import { Either, right, left, isRight } from 'fp-ts/lib/Either'
import parseExpression, { ParsedExpression, Expression } from './expressions'

export type Command = {
  instruction: string
  args: string[]
  data: SingleASTNode[]
}

type TestCommand = ConditionalFunction<Command>

export type CommandUpdateState = (
  command: Command
) => (state: State) => Either<string, State>

type CommandToContent = (command: Command) => SingleASTNode

export type TestCommandAndUpdateState = [TestCommand, CommandUpdateState]

export type TestCommandAndGetContent = [TestCommand, CommandToContent]

const removeVal: (parts: string[][]) => string[][] = ([
  leftPart,
  rightPart,
]) => [leftPart, rightPart.slice(1)]

export const splitArgsByVal: (args: string[]) => string[][] = R.pipe(
  R.splitWhen(R.equals('val')),
  removeVal
)

// TODO find a way to throw the error message
const decodeExpression: (
  parsedExpression: ParsedExpression
) => string | number = parsedExpression =>
  isRight(parsedExpression) ? parsedExpression.right : parsedExpression.left

export const resolveExpression: (
  state: State
) => (expression: Expression) => string | number = state =>
  R.pipe(parseExpression(state), decodeExpression)

const getContentAsString: (content: SingleASTNode) => string = R.pipe(
  R.prop<string>('content'),
  R.when(R.pipe(R.type, R.equals('String'), R.not), R.always(''))
)

const getContentAsContents: (
  content: SingleASTNode
) => SingleASTNode[] = R.pipe(
  R.prop<string>('content'),
  R.when(R.pipe(R.type, R.equals('Array'), R.not), R.always([]))
)

const getCommandLine: (content: SingleASTNode) => string[] = R.pipe(
  getContentAsString,
  R.trim,
  R.split(' ')
)

export const getCommand: (contentBody: SingleASTNode[]) => Command = ([
  commandLine,
  ...data
]) => {
  const [instruction, ...args] = getCommandLine(commandLine)

  return { instruction, args, data }
}

const emptyTextNodeByDefault: TestCommandAndGetContent = [
  R.T,
  R.always({ content: '', type: 'text' }),
]

const getCommandResultContent: (state: State) => CommandToContent = state =>
  R.cond([show(state), emptyTextNodeByDefault])

const doNoUpdateStateByDefault: TestCommandAndUpdateState = [
  R.T,
  () => (state: State) => right(state),
]

const makeError: TestCommandAndUpdateState = [
  R.propEq('instruction', 'error'),
  () => () => left('wanted Error'),
]

const applyCommandToState: CommandUpdateState = R.cond([
  set,
  test,
  describe,
  makeError,
  doNoUpdateStateByDefault,
])

export const applyCommand: (
  state: State
) => ComputeContentAndState = state => content => {
  const command = getCommand(getContentAsContents(content))
  const tryToComputeState = applyCommandToState(command)(state)

  return isRight(tryToComputeState)
    ? [getCommandResultContent(state)(command), tryToComputeState.right]
    : [
        {
          type: 'error',
          content: [{ type: 'text', content: tryToComputeState.left }, content],
        },
        state,
      ]
}

const parseCommandContent: (
  state: State
) => TestAndComputeContentAndState = state => [
  R.propEq('type', 'command'),
  applyCommand(state),
]

export default parseCommandContent
