import * as R from 'ramda'

import show from './show'
import set from './set'
import describe from './describe'
import test from './testCommand'
import { State } from '../..'
import { Content } from '..'

export type Command = {
  instruction: string
  args: string[]
  data: Content[]
}

const getContentAsString: (content: Content) => string = R.pipe(
  R.prop('content'),
  R.when(R.pipe(R.type, R.equals('String'), R.not), R.always(''))
)

const getContentAsContents: (content: Content) => Content[] = R.pipe(
  R.prop('content'),
  R.when(R.pipe(R.type, R.equals('Array'), R.not), R.always([]))
)

// Content -> [String]
const getCommandLine: (content: Content) => string[] = R.pipe(
  getContentAsString,
  R.trim,
  R.split(' ')
)

// [Content] -> Command
export const getCommand: (contentBody: Content[]) => Command = ([
  commandLine,
  ...data
]) => {
  const [instruction, ...args] = getCommandLine(commandLine)

  return { instruction, args, data }
}

// State -> Command -> Content
const getCommandResultContent: (
  state: State
) => (command: Command) => Content = state =>
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
) => (content: Content) => [Content, State] = state => content => {
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
  (content: Content) => boolean,
  (content: Content) => [Content, State]
] = state => [R.propEq('type', 'command'), applyCommand(state)]

export default parseCommandContent
