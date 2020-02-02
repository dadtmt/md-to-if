import * as R from 'ramda'

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

// State, Command -> String
const getStringCommandResultContent = (state, { instruction, args }) => {
  const { played, currentSceneName, ...restOfState } = state
  switch (instruction) {
    case 'show': {
      if (args[0] === 'playedCount') {
        return played[currentSceneName].toString()
      } else {
        return R.path(args)(restOfState)
      }
    }

    default:
      return ''
  }
}

// State, Command -> Content
const getCommandResultContent = (state, command) =>
  R.pipe(
    R.assoc('content', getStringCommandResultContent(state, command)),
    R.assoc('type', 'text')
  )({})

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
    getCommandResultContent(state, command),
    applyCommandToState(command)(state),
  ]
}

// State -> [Content -> Boolean, Content -> [Content, State]]
const parseCommandContent = state => [
  R.propEq('type', 'command'),
  applyCommand(state),
]

export default parseCommandContent
