import * as R from 'ramda'
import { Either, right, left, fold } from 'fp-ts/lib/Either'

import show from './show'
import set from './set'
import describe from './describe'
import test from './testCommand'
import { State } from '../moves'
import { SingleASTNode } from 'simple-markdown'
import {
  TestAndComputeContentAndState,
  ComputeContentAndState,
  ConditionalFunction
} from '../parseSceneContent'
import { getCommand } from './helpers'

export interface Command {
  instruction: string
  args: string[]
  data: SingleASTNode[]
}

type TestCommand = ConditionalFunction<Command>

export type CommandUpdateState = (
  command: Command
) => (state: State) => Either<string, State>

type CommandToContent = (command: Command) => Either<string, SingleASTNode>

export type TestCommandAndUpdateState = [TestCommand, CommandUpdateState]

export type TestCommandAndGetContent = [TestCommand, CommandToContent]

const getContentAsContents: (content: SingleASTNode) => SingleASTNode[] =
  R.prop<string>('content')

const emptyTextNodeByDefault: TestCommandAndGetContent = [
  R.T,
  R.always(right({ content: '', type: 'text' }))
]

const getCommandResultContent: (state: State) => CommandToContent = (state) =>
  R.cond([show(state), emptyTextNodeByDefault])

const doNoUpdateStateByDefault: TestCommandAndUpdateState = [
  R.T,
  () => (state: State) => right(state)
]

const makeError: TestCommandAndUpdateState = [
  R.propEq('instruction', 'error'),
  () => () => left('wanted Error')
]

const applyCommandToState: CommandUpdateState = R.cond([
  set,
  test,
  describe,
  makeError,
  doNoUpdateStateByDefault
])

export const errorContent: (
  message: String,
  content: SingleASTNode
) => SingleASTNode = (message, content) => ({
  type: 'error',
  content: [{ type: 'text', content: message }, content]
})

export const applyCommand: (state: State) => ComputeContentAndState =
  (state) => (content) => {
    const command = getCommand(getContentAsContents(content))

    return fold<string, State, [SingleASTNode, State]>(
      (message: string) => [errorContent(message, content), state],
      (updatedState) => [
        fold<string, SingleASTNode, SingleASTNode>(
          (message: string) => errorContent(message, content),
          R.identity
        )(getCommandResultContent(state)(command)),
        updatedState
      ]
    )(applyCommandToState(command)(state))
  }

const parseCommandContent: (state: State) => TestAndComputeContentAndState = (
  state
) => [R.propEq('type', 'command'), applyCommand(state)]

export default parseCommandContent
