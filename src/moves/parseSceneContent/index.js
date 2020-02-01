import * as R from 'ramda'

import getDescription from './describeInstruction'
import evaluateTest from './testInstruction'
import getCaseContent from './caseContent'

const applyDynamicInstructionsToContent = state => ({ instruction, args }) => {
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

const setValue = args => R.assocPath(R.dropLast(1, args), R.last(args))

const applyDynamicInstructionsToState = ({
  instruction,
  args,
  data,
}) => state => {
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

export const parseInstructions = ([command, ...data]) => {
  const [instruction, ...args] = R.pipe(
    R.prop('content'),
    R.trim,
    R.split(' ')
  )(command)

  return { instruction, args, data }
}

export const getDynamicContentAndState = state => content =>
  R.pipe(
    R.evolve({
      content: R.pipe(
        parseInstructions,
        applyDynamicInstructionsToContent(state)
      ),
      type: R.always('text'),
    }),
    R.of,
    R.append(
      applyDynamicInstructionsToState(parseInstructions(content.content))(state)
    )
  )(content)

export const parseDynamicContentWithState = state =>
  R.pipe(
    R.cond([
      [R.propEq('type', 'dynamic'), getDynamicContentAndState(state)],
      [R.propEq('type', 'trueCaseContent'), getCaseContent(state, true)],
      [R.propEq('type', 'falseCaseContent'), getCaseContent(state, false)],
      [R.T, R.pipe(R.of, R.append(state))],
    ]),
    R.when(R.pipe(R.head, R.propIs(Array, 'content')), parseArrayContent)
  )

const appendTo = R.flip(R.append)

export const mergeContent = parsedContent =>
  R.ifElse(
    R.prop('contentToMerge'),
    R.pipe(R.prop('content'), R.concat(parsedContent)),
    appendTo(parsedContent)
  )

const parseArrayContent = ([content, state], parsedContentAndState = []) => {
  const [headChildContent, ...restOfChildContent] = content.content

  if (headChildContent) {
    const [parsedContent, parsedState] =
      parsedContentAndState.length > 0
        ? parsedContentAndState
        : [{ content: [] }, state]
    const [
      parsedHeadChildContent,
      newParsedState,
    ] = parseDynamicContentWithState(parsedState)(headChildContent)

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

const parseDynamicSceneContentWithState = (
  { sceneContent, state },
  parsedContentAndState = [[]]
) => {
  const [headContent, ...restOfContent] = sceneContent
  if (headContent) {
    const [parsedContent, parsedState] = parsedContentAndState
    const stateToParse = parsedState || state
    const [parsedHeadContent, newParsedSate] = parseDynamicContentWithState(
      stateToParse
    )(headContent)
    return parseDynamicSceneContentWithState(
      { sceneContent: restOfContent, state: stateToParse },
      [[...parsedContent, parsedHeadContent], newParsedSate]
    )
  }
  return parsedContentAndState
}

export default parseDynamicSceneContentWithState
