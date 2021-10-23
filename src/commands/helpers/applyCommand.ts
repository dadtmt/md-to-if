import * as R from 'ramda'
import { right, left, fold } from 'fp-ts/lib/Either'

import { State } from '../../moves'
import { SingleASTNode } from 'simple-markdown'
import { ComputeContentAndState } from '../../parseSceneContent/parseContent'
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

const getCommandResultContent: (
  commandToContentResolvers: TestCommandAndGetContent[]
) => CommandToContent = (commandToContentResolvers) =>
  R.cond([...commandToContentResolvers, emptyTextNodeByDefault])

const doNoUpdateStateByDefault: TestCommandAndUpdateState = [
  R.T,
  () => (state: State) => right(state)
]

const makeError: TestCommandAndUpdateState = [
  R.propEq('instruction', 'error'),
  () => () => left('wanted Error')
]

const applyCommandToState: (
  commandResolvers: TestCommandAndUpdateState[]
) => CommandUpdateState = (commandResolvers: TestCommandAndUpdateState[]) =>
  R.cond([...commandResolvers, makeError, doNoUpdateStateByDefault])

const applyCommand: (
  state: State,
  commandResolvers?: TestCommandAndUpdateState[],
  commandToContentResolvers?: TestCommandAndGetContent[]
) => ComputeContentAndState =
  (
    state,
    commandResolvers?: TestCommandAndUpdateState[],
    commandToContentResolvers?: TestCommandAndGetContent[]
  ) =>
  (content) => {
    const command = getCommand(getContentAsContents(content))

    return fold<string, State, [SingleASTNode, State]>(
      (message: string) => [errorNode(message, content), state],
      (updatedState) => [
        fold<string, SingleASTNode, SingleASTNode>(
          (message: string) => errorNode(message, content),
          R.identity
        )(getCommandResultContent(commandToContentResolvers ?? [])(command)),
        updatedState
      ]
    )(applyCommandToState(commandResolvers ?? [])(command)(state))
  }

export default applyCommand
