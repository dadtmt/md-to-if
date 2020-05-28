import * as R from 'ramda'

import show from './show'
import set from './set'
import describe from './describe'
import test from './testCommand'
import { State } from '../..'
import { SingleASTNode } from 'simple-markdown'

export type Command = {
  instruction: string
  args: string[]
  data: SingleASTNode[]
}

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

// State -> Command -> Content
const getCommandResultContent: (
  state: State
) => (command: Command) => SingleASTNode = state =>
  R.cond([show(state), [R.T, R.always({ content: '', type: 'text' })]])

// Command -> State -> State
const applyCommandToState: (
  command: Command
) => (state: State) => State = R.cond([
  set,
  test,
  describe,
  [R.T, () => R.identity],
])

// State -> Content -> [Content, State]
export const applyCommand: (
  state: State
) => (content: SingleASTNode) => [SingleASTNode, State] = state => content => {
  const command = getCommand(getContentAsContents(content))
  return [
    getCommandResultContent(state)(command),
    applyCommandToState(command)(state),
  ]
}

// State -> [Content -> Boolean, Content -> [Content, State]]
const parseCommandContent: (
  state: State
) => [
  (content: SingleASTNode) => boolean,
  (content: SingleASTNode) => [SingleASTNode, State]
] = state => [R.propEq('type', 'command'), applyCommand(state)]

export default parseCommandContent
