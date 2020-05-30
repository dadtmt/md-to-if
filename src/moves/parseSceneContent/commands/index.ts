import * as R from 'ramda'

import show from './show'
import set from './set'
import describe from './describe'
import test from './testCommand'
import { State } from '../..'
import { SingleASTNode } from 'simple-markdown'
import { TestAndComputeContentAndState, ComputeContentAndState } from '..'

export type Command = {
  instruction: string
  args: string[]
  data: SingleASTNode[]
}

type TestCommand = (command: Command) => boolean

export type CommandUpdateState = (command: Command) => (state: State) => State

type CommandToContent = (command: Command) => SingleASTNode

export type TestCommandAndUpdateState = [TestCommand, CommandUpdateState]

export type TestCommandAndGetContent = [TestCommand, CommandToContent]

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

// Content -> [String]
const getCommandLine: (content: SingleASTNode) => string[] = R.pipe(
  getContentAsString,
  R.trim,
  R.split(' ')
)

// [Content] -> Command
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

// State -> Command -> Content
const getCommandResultContent: (state: State) => CommandToContent = state =>
  R.cond([show(state), emptyTextNodeByDefault])

const doNoUpdateStateByDefault: TestCommandAndUpdateState = [
  R.T,
  () => R.identity,
]

// Command -> State -> State
const applyCommandToState: CommandUpdateState = R.cond([
  set,
  test,
  describe,
  doNoUpdateStateByDefault,
])

// State -> Content -> [Content, State]
export const applyCommand: (
  state: State
) => ComputeContentAndState = state => content => {
  const command = getCommand(getContentAsContents(content))
  return [
    getCommandResultContent(state)(command),
    applyCommandToState(command)(state),
  ]
}

// State -> [Content -> Boolean, Content -> [Content, State]]
const parseCommandContent: (
  state: State
) => TestAndComputeContentAndState = state => [
  R.propEq('type', 'command'),
  applyCommand(state),
]

export default parseCommandContent
