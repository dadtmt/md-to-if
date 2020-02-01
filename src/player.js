import playMoves from './moves/playMoves'

const player = (book, moves = []) => {
  const [introduction, ...scenes] = book
  return [introduction, ...playMoves(moves, scenes)]
}

export default player
