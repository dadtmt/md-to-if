import * as R from 'ramda'
import { incPlayedSceneCount } from './stateHelpers/playedSceneCount'
import { PlayedScene, Move } from '../player'
import { MovedScene, State } from '.'
import { Scene } from '..'

// [PlayedScene] -> State
const getLastPlayedSceneState: (playedScenes: PlayedScene[]) => State = R.pipe(
  R.last,
  R.prop('state')
)

//  Move -> String
export const getTargetSceneName: (move: Move) => string = R.pipe<Move>(
  R.prop('target'),
  R.tail
)

// Move -> Scene -> Boolean
export const matchTarget: (move: Move) => (scene: Scene) => boolean = move =>
  R.propEq('name', getTargetSceneName(move))

// Move -> [Scene] -> Scene
export const getTargetedScene: (
  move: Move
) => (scenes: Scene[]) => Scene = move => R.find(matchTarget(move))

// String -> State -> State
const updateState: (name: string) => (state: State) => State = name =>
  R.pipe(R.assoc('currentSceneName', name), incPlayedSceneCount(name))

// [Scene], [PlayedScene]-> [Move -> Boolean, Move -> MovedScene]
const goto: (
  scenes: Scene[],
  playedScenes: PlayedScene[]
) => [(move: Move) => boolean, (move: Move) => MovedScene] = (
  scenes,
  playedScenes
) => [
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
