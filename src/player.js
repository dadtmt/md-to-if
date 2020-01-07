import * as R from 'ramda'

export const getTarget = R.pipe(R.prop('target'), R.tail)

export const matchTarget = move => R.propEq('name', getTarget(move))

export const gotoScene = move => R.find(matchTarget(move))

const playedSceneCountLens = name => R.lensPath(['played', name])
const incrementPlayedScene = name =>
  R.over(playedSceneCountLens(name), R.pipe(R.inc, R.defaultTo(1)))

const addToStory = story => scene => [...story, scene]

const start = scenes => [
  R.propEq('type', 'start'),
  () => {
    const [scene] = scenes
    const { name } = scene
    const state = {
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
