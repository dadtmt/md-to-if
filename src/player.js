import * as R from 'ramda'

export const getTarget = R.pipe(R.prop('target'), R.tail)

export const matchTarget = move => R.propEq('name', getTarget(move))

export const gotoScene = move => R.find(matchTarget(move))

const playedSceneCountLens = name => R.lensPath(['played', name])

const getPlayedSceneCount = state => {
  const { currentSceneName } = state
  return R.view(playedSceneCountLens(currentSceneName))(state)
}

const incrementPlayedScene = name =>
  R.pipe(
    R.assoc('currentSceneName', name),
    R.over(playedSceneCountLens(name), R.pipe(R.inc, R.defaultTo(1)))
  )
const addToStory = story => scene => [...story, scene]

const getRightExpression = R.last

const getTestOperator = R.pipe(R.dropLast(1), R.last)

const getTestFunction = test => {
  if (getTestOperator(test) === 'equals') {
    return R.equals
  } else {
    return R.always('illegal-operator')
  }
}

const evaluateLeftExpression = state => {
  return R.pipe(
    R.dropLast(2),
    R.when(
      R.last,
      R.equals('playedCount'),
      R.always(getPlayedSceneCount(state))
    ),
    R.toString
  )
}

const evaluateTest = state => test => {
  return R.converge(getTestFunction(test), [
    evaluateLeftExpression(state),
    getRightExpression,
  ])(test)
}

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

const getContentList = R.map(R.pipe(R.head, R.prop('content')))

export const getDescription = R.pipe(
  R.head,
  R.converge(R.zipObj, [
    R.pipe(R.prop('header'), getContentList),
    R.pipe(R.prop('cells'), R.head, getContentList),
  ])
)

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
      return { ...state, [args[0]]: getDescription(data) }
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

const getTestResult = (state, match) => content => {
  const { testResult } = state
  return testResult === match
    ? [content, R.dissoc('testResult', state)]
    : [
        {
          ...content,
          content: [
            {
              content: '',
              type: 'text',
            },
          ],
        },
        state,
      ]
}

const getCaseContent = (state, match) => {
  return R.pipe(R.assoc('contentToMerge', true), getTestResult(state, match))
}

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

const playSceneContent = scene => {
  const { sceneContent, state, ...restOfScene } = scene

  const [parsedSceneContent, parsedState] = parseDynamicSceneContentWithState({
    sceneContent,
    state,
  })
  return {
    sceneContent: parsedSceneContent,
    state: parsedState,
    ...restOfScene,
  }
}

const start = scenes => [
  R.propEq('type', 'start'),
  () => {
    const [scene] = scenes
    const { name } = scene
    const state = {
      currentSceneName: name,
      played: { [name]: 1 },
    }
    return { ...scene, state }
  },
]

const goto = (scenes, story) => [
  R.propEq('type', 'anchor'),
  move => {
    const lastState = R.pipe(R.last, R.prop('state'))(story)
    const scene = gotoScene(move)(scenes)
    const { name } = scene

    return {
      ...scene,
      state: incrementPlayedScene(name)(lastState),
    }
  },
]

const playMoves = (moves, scenes, story = []) => {
  const move = R.head(moves)
  return move
    ? playMoves(
        R.tail(moves),
        scenes,
        R.pipe(
          R.cond([start(scenes), goto(scenes, story)]),
          playSceneContent,
          addToStory(story)
        )(move)
      )
    : story
}

const player = (book, moves = []) => {
  const [introduction, ...scenes] = book
  return [introduction, ...playMoves(moves, scenes)]
}

export default player
