import * as R from 'ramda'

import show from './show'
import set from './set'
import describe from './describe'
import test from './testCommand'

// Content -> [String]
const getCommandLine = R.pipe(R.prop('content'), R.trim, R.split(' '))

// [Content] -> Command
export const getCommand = ([commandLine, ...data]) => {
  const [instruction, ...args] = getCommandLine(commandLine)

  return { instruction, args, data }
}

// State -> Command -> Content
const getCommandResultContent = state =>
  R.cond([show(state), [R.T, R.always({ content: '', type: 'text' })]])

// Command -> State -> State
const applyCommandToState = R.cond([
  set,
  test,
  describe,
  [R.T, () => R.identity],
])

// State -> Content -> [Content, State]
export const applyCommand = state => ({ content }) => {
  const command = getCommand(content)
  return [
    getCommandResultContent(state)(command),
    applyCommandToState(command)(state),
  ]
}

// State -> [Content -> Boolean, Content -> [Content, State]]
const parseCommandContent = state => [
  R.propEq('type', 'command'),
  applyCommand(state),
]

export default parseCommandContent
