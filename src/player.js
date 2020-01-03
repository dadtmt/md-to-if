import * as R from 'ramda'

export const getTarget = R.pipe(R.prop('target'), R.tail)

export const matchTarget = move => R.propEq('name', getTarget(move))

export const findScene = move => R.find(matchTarget(move))

const start = scenes => [R.propEq('type', 'start'), () => [R.head(scenes)]]

const goto = (scenes, story) => [
  R.propEq('type', 'anchor'),
  move => [...story, findScene(move)(scenes)],
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
