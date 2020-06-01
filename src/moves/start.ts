import * as R from 'ramda'
import { Move } from '../player'
import { MovedScene } from '.'
import { Scene } from '..'

// [Scene] -> Move -> MovedScene
const firstSceneWithState: (scenes: Scene[]) => () => MovedScene = ([
  scene,
]) => () => {
  const { name } = scene
  const state = {
    currentSceneName: name,
    played: { [name]: 1 },
  }
  return { ...scene, state }
}

// [Scene]-> [Move -> Boolean, Move -> MovedScene]
const start: (
  scenes: Scene[]
) => [(move: Move) => boolean, () => MovedScene] = scenes => [
  R.propEq('type', 'start'),
  firstSceneWithState(scenes),
]

export default start
