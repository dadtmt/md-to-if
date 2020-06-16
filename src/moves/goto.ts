import * as R from 'ramda'
import { incPlayedSceneCount } from '../stateHelpers/playedSceneCount'
import { PlayedScene, Move } from '../player'
import { MovedScene, State } from '.'
import { Scene } from '..'

const getState: (playedScene: PlayedScene) => State = R.prop('state')

// [PlayedScene] -> State
const getLastPlayedSceneState: (playedScenes: PlayedScene[]) => State = R.pipe(
  R.last,
  getState
)

const removeFirstChar: (str: string) => string = R.tail
const getTarget: (move: Move) => string = R.propOr(
  'missing target prop',
  'target'
)

//  Move -> String
export const getTargetSceneName: (move: Move) => string = R.pipe(
  getTarget,
  removeFirstChar
)

// Move -> Scene -> Boolean
export const matchTarget: (move: Move) => (scene: Scene) => boolean = move =>
  R.propEq('name', getTargetSceneName(move))

const notFoundScene: (move: Move) => Scene = move => {
  const name = getTargetSceneName(move)

  return {
    name,
    sceneContent: [
      {
        type: 'heading',
        level: 2,
        content: [
          {
            type: 'text',
            content: name,
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            content: `The scene with name ${name} does not exist`,
          },
        ],
      },
    ],
  }
}

// Move -> [Scene] -> Scene
export const getTargetedScene: (
  move: Move
) => (scenes: Scene[]) => Scene = move =>
  R.pipe(
    R.find(matchTarget(move)),
    R.when(R.isNil, () => notFoundScene(move))
  )

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
