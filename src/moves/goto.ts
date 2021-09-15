import * as R from 'ramda'
import { incPlayedSceneCount } from '../stateHelpers/playedSceneCount'
import { PlayedScene, Move } from '../player'
import { MovedScene, State } from '.'
import { BookScene } from '..'
import getTargetedScene from './helpers/getTargetedScene'

const getState: (playedScene: PlayedScene) => State = R.prop('state')

const getLastPlayedSceneState: (playedScenes: PlayedScene[]) => State = R.pipe(
  R.last,
  getState
)

const updateState: (name: string) => (state: State) => State = (name) =>
  R.pipe(R.assoc('currentSceneName', name), incPlayedSceneCount(name))

const goto: (
  scenes: BookScene[],
  playedScenes: PlayedScene[]
) => [(move: Move) => boolean, (move: Move) => MovedScene] = (
  scenes,
  playedScenes
) => [
  R.propEq('type', 'anchor'),
  (move) => {
    const lastState = getLastPlayedSceneState(playedScenes)
    const scene = getTargetedScene(move)(scenes)
    const { name } = scene

    return {
      ...scene,
      state: updateState(name)(lastState)
    }
  }
]

export default goto
