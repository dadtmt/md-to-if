import * as R from 'ramda'
import { right, left, fold } from 'fp-ts/lib/Either'

import show from './../show'
import set from './../set'
import describe from './../describe'
import test from './../testCommand'
import { State } from '../../moves'
import { SingleASTNode } from 'simple-markdown'
import { ComputeContentAndState } from '../../parseSceneContent'
import { errorNode, getCommand } from './../helpers'
import {
  TestCommandAndGetContent,
  TestCommandAndUpdateState,
  CommandUpdateState,
  CommandToContent
} from '..'

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

const applyCommand: (state: State) => ComputeContentAndState =
  (state) => (content) => {
    const command = getCommand(getContentAsContents(content))

    return fold<string, State, [SingleASTNode, State]>(
      (message: string) => [errorNode(message, content), state],
      (updatedState) => [
        fold<string, SingleASTNode, SingleASTNode>(
          (message: string) => errorNode(message, content),
          R.identity
        )(getCommandResultContent(state)(command)),
        updatedState
      ]
    )(applyCommandToState(command)(state))
  }

export default applyCommand
