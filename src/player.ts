import playMoves, { State } from './moves'
import { Scene } from '.'

export interface Move {
  type: string
  [prop: string]: any
}

export type PlayedScene = Scene & { state: State }

// [Scene], [Move] -> [PlayedScene]
const player: (scenes: Scene[], moves?: Move[]) => PlayedScene[] = (
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
