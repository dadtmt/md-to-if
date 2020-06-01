import playMoves, { State } from './moves'
import { Scene } from '.'

export type Move = {
  type: string
  [prop: string]: any
}
export type PlayedScene = Scene & { state: State }

// [Scene], [Move] -> [PlayedScene]
const player: (scenes: Scene[], moves?: Move[]) => Scene[] = (
  scenes,
  moves
) => {
  const [introduction, ...scenesAfterInroduction] = scenes
  return [introduction, ...playMoves(moves || [], scenesAfterInroduction)]
}

export default player
