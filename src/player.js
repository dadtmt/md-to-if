import * as R from 'ramda'

const player = (book, moves = []) => {
  const [firstScene, ...scenes] = book
  return [
    firstScene,
    moves.reduce((acc, { type }) => {
      switch (type) {
        case 'start':
          return R.head(scenes)
      }
    }, []),
  ]
}

export default player
