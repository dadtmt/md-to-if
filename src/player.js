import * as R from 'ramda'

export const getTarget = R.pipe(R.prop('target'), R.tail)

export const matchTarget = move => R.propEq('name', getTarget(move))

export const gotoScene = move => R.find(matchTarget(move))

export const incPlayedScene = R.identity

const start = scenes => [
  R.propEq('type', 'start'),
  () => {
    const [scene] = scenes
    const { name } = scene
    const state = {
      played: { [name]: 1 },
    }
    return [{ ...scene, state }]
  },
]

const goto = (scenes, story) => [
  R.propEq('type', 'anchor'),
  move => [
    ...story,
    {
      ...gotoScene(move)(scenes),
      state: {
        ...R.pipe(R.last, R.prop('state'))(story),
        played: { cantina: 1 },
      },
    },
  ],
]

const playMoves = (moves, scenes, story = []) => {
  const move = R.head(moves)
  return move
    ? playMoves(
        R.tail(moves),
        scenes,
        R.cond([start(scenes), goto(scenes, story)])(move)
      )
    : story
}

const player = (book, moves = []) => {
  const [introduction, ...scenes] = book
  return [introduction, ...playMoves(moves, scenes)]
}

export default player
