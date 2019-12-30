import * as R from 'ramda'

export const getTarget = R.pipe(R.prop('target'), R.tail)

export const matchTarget = move => R.propEq('name', getTarget(move))

// To do : write a getSceneName
export const findScene = move => R.filter(matchTarget(move))

const player = (book, moves = []) => {
  const [firstScene, ...scenes] = book
  return [
    firstScene,
    ...moves.reduce((acc, move) => {
      switch (move.type) {
        case 'start':
          return [R.head(scenes)]
        case 'anchor':
          return [...acc, findScene(move)(book)]
        default:
          return acc
      }
    }, []),
  ]
}

export default player
