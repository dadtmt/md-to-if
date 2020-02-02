import * as R from 'ramda'

import getDescription from './describe'
import evaluateTest from './testCommand'

// [String] -> State -> State
const setValue = args => R.assocPath(R.dropLast(1, args), R.last(args))

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
const applyCommandToState = ({ instruction, args, data }) => state => {
  switch (instruction) {
    case 'set': {
      return setValue(args)(state)
    }
    case 'test': {
      return { ...state, testResult: evaluateTest(state)(args) }
    }
    case 'describe': {
      const [name] = args
      return { ...state, [name]: getDescription(data) }
    }
    default:
      return state
  }
}

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
