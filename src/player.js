import playMoves from './moves'

// [Scene], [Move] -> [PlayedScene]
const player = (scenes, moves = []) => {
  const [introduction, ...scenesAfterInroduction] = scenes
  return [introduction, ...playMoves(moves, scenesAfterInroduction)]
}

export default player
