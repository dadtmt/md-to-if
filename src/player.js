import * as R from 'ramda'

export const getTarget = R.pipe(R.prop('target'), R.tail)

export const matchTarget = move => R.propEq('name', getTarget(move))

export const gotoScene = move => R.find(matchTarget(move))

const playedSceneCountLens = name => R.lensPath(['played', name])
const incrementPlayedScene = name =>
  R.pipe(
    R.assoc('currentSceneName', name),
    R.over(playedSceneCountLens(name), R.pipe(R.inc, R.defaultTo(1)))
  )
const addToStory = story => scene => [...story, scene]

const handleDynamicInstruction = ({ played, currentSceneName }) => ([
  instruction,
  arg,
]) => {
  switch (instruction) {
    case 'show':
      return arg === 'playedCount' ? played[currentSceneName].toString() : ''
    default:
      return ''
  }
}

const getDynamicContent = state =>
  R.pipe(
    R.head,
    R.prop('content'),
    R.trim,
    R.split(' '),
    handleDynamicInstruction(state)
  )

export const parseDynamicContentWithState = state =>
  R.when(
    R.propEq('type', 'dynamic'),
    R.pipe(
      R.evolve({
        content: getDynamicContent(state),
        type: R.always('text'),
      }),
      R.of,
      R.append(state)
    )
  )

const recursiveDynamic = (
  { content, state },
  dynamicContent = { content: [] }
) => {
  if (Array.isArray(content)) {
    if (content.length < 1) return { content: dynamicContent }
    const [headContent, ...restOfContent] = content

    const newContent = recursiveDynamic({
      content: headContent,
      state,
    })
    return recursiveDynamic(
      {
        content: restOfContent,
        state,
      },
      {
        content: [...dynamicContent.content, newContent],
      }
    )
  } else {
    const newContent = R.when(
      R.propEq('type', 'dynamic'),
      R.evolve({
        content: getDynamicContent(state),
        type: R.always('text'),
      })
    )(content)
    return {
      ...newContent,
      content: Array.isArray(newContent.content)
        ? recursiveDynamic({
            content: newContent.content,
            state,
          })
        : newContent,
    }
  }
}

const playContent = scene => {
  const { content, state, ...restOfScene } = scene
  const dynamicContent = recursiveDynamic({ content, state })
  return { ...dynamicContent, state, ...restOfScene }
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
          playContent,
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
