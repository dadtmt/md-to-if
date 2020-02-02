import * as R from 'ramda'

// Move -> [Scene] -> MovedScene
const firstSceneWithState = scenes => () => {
  const [scene] = scenes
  const { name } = scene
  const state = {
    currentSceneName: name,
    played: { [name]: 1 },
  }
  return { ...scene, state }
}

// [Scene]-> [Move -> Boolean, Move -> MovedScene]
const start = scenes => [R.propEq('type', 'start'), firstSceneWithState(scenes)]

export default start
