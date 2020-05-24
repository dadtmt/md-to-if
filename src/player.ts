import playMoves from './moves'
import { Content } from './moves/parseSceneContent'

export type Scene = { name: string; sceneContent: Content[] }
export type Move = { type: string; target?: string }
export type PlayedScene = {}

// [Scene], [Move] -> [PlayedScene]
const player: any = (scenes, moves = []) => {
  const [introduction, ...scenesAfterInroduction] = scenes
  return [introduction, ...playMoves(moves, scenesAfterInroduction)]
}

export default player
