import * as R from 'ramda'

import getDescription from './describeInstruction'
import evaluateTest from './testInstruction'
import getCaseContent from './caseContent'

// [String] -> State -> State
const setValue = args => R.assocPath(R.dropLast(1, args), R.last(args))

// [a] -> a -> [a]
const appendTo = R.flip(R.append)

// Content -> Content -> Content
export const mergeContent = parsedContent =>
  R.ifElse(
    R.prop('contentToMerge'),
    R.pipe(R.prop('content'), R.concat(parsedContent)),
    appendTo(parsedContent)
  )

// [Content, State] , [Content, State] -> [Content, State]
const parseArrayContent = ([content, state], parsedContentAndState = []) => {
  const [headChildContent, ...restOfChildContent] = content.content

  if (headChildContent) {
    const [parsedContent, parsedState] =
      parsedContentAndState.length > 0
        ? parsedContentAndState
        : [{ content: [] }, state]
    const [parsedHeadChildContent, newParsedState] = parseContent(parsedState)(
      headChildContent
    )

    const result = [
      {
        ...content,
        content: mergeContent(parsedContent.content)(parsedHeadChildContent),
      },
      newParsedState,
    ]
    return parseArrayContent(
      [{ ...content, content: restOfChildContent }, newParsedState],
      result
    )
  }

  return parsedContentAndState
}

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
export const applyDynamicContent = state => ({ content }) => {
  const command = getCommand(content)
  return [
    getCommandResultContent(state, command),
    applyCommandToState(command)(state),
  ]
}

// State -> Content -> [Content, State]
export const parseContent = state =>
  R.pipe(
    R.cond([
      [R.propEq('type', 'command'), applyDynamicContent(state)],
      [R.propEq('type', 'trueCaseContent'), getCaseContent(state, true)],
      [R.propEq('type', 'falseCaseContent'), getCaseContent(state, false)],
      [R.T, R.pipe(R.of, R.append(state))],
    ]),
    R.when(R.pipe(R.head, R.propIs(Array, 'content')), parseArrayContent)
  )

//  { [Content], State } -> [[Content], State]
const parseSceneContent = (
  { sceneContent, state },
  parsedContentAndState = [[]]
) => {
  const [headContent, ...restOfContent] = sceneContent
  if (headContent) {
    const [parsedContent, parsedState] = parsedContentAndState
    const stateToParse = parsedState || state
    const [parsedHeadContent, newParsedSate] = parseContent(stateToParse)(
      headContent
    )
    return parseSceneContent(
      { sceneContent: restOfContent, state: stateToParse },
      [[...parsedContent, parsedHeadContent], newParsedSate]
    )
  }
  return parsedContentAndState
}

export default parseSceneContent
