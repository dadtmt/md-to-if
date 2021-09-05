import playMoves, { State } from './moves'
import { BookScene, Scene } from '.'

export interface Move {
  type: string
  target?: string
}

export interface PlayedScene extends Scene {
  state: State
}

// [Scene], [Move] -> [PlayedScene]
const player: (scenes: BookScene[], moves?: Move[]) => PlayedScene[] = (
  scenes,
  moves
) => {
  const [introduction, ...scenesAfterInroduction] = scenes
  return [
    { ...introduction, state: {} },
    ...playMoves(moves ?? [], scenesAfterInroduction)
  ]
}

export default player
