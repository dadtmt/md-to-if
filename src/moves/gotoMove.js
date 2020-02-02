import * as R from 'ramda'
import { incPlayedSceneCount } from './playedSceneCount'

// [PlayedScene] -> State
const getLastPlayedSceneState = R.pipe(R.last, R.prop('state'))

//  Move -> String
export const getTargetSceneName = R.pipe(R.prop('target'), R.tail)

// Scene -> Move -> Boolean
export const matchTarget = move => R.propEq('name', getTargetSceneName(move))

// [Scene] -> Move -> Scene
export const getTargetedScene = move => R.find(matchTarget(move))

// State -> String -> State
const updateState = name =>
  R.pipe(R.assoc('currentSceneName', name), incPlayedSceneCount(name))

// [Scene], [PlayedScene]-> [Move -> Boolean, Move -> MovedScene]
const goto = (scenes, playedScenes) => [
  R.propEq('type', 'anchor'),
  move => {
    const lastState = getLastPlayedSceneState(playedScenes)
    const scene = getTargetedScene(move)(scenes)
    const { name } = scene

    return {
      ...scene,
      state: updateState(name)(lastState),
    }
  },
]

export default goto
