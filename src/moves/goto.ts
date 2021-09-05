import * as R from 'ramda'
import { incPlayedSceneCount } from '../stateHelpers/playedSceneCount'
import { PlayedScene, Move } from '../player'
import { MovedScene, State } from '.'
import { BookScene } from '..'

const getState: (playedScene: PlayedScene) => State = R.prop('state')

const getLastPlayedSceneState: (playedScenes: PlayedScene[]) => State = R.pipe(
  R.last,
  getState
)

const notFoundScene: (move: Move) => BookScene = (move) => {
  return {
    actions: [],
    name: 'unknown',
    sceneContent: [
      {
        type: 'heading',
        level: 2,
        content: [
          {
            type: 'text',
            content: 'unknown'
          }
        ]
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            content: `The scene with path: /${getPath(move).join(
              '/'
            )} does not exist`
          }
        ]
      }
    ]
  }
}

const getSceneByPath =
  (move: Move) =>
  (scenes: BookScene[], path: string[]): BookScene => {
    const [firstSceneName, ...restOfSceneNames] = path
    const pathScene =
      scenes.find(({ name }) => {
        return firstSceneName.localeCompare(name) === 0
      }) ?? notFoundScene(move)
    const { actions } = pathScene
    return restOfSceneNames.length > 0 && actions.length > 0
      ? getSceneByPath(move)(actions, restOfSceneNames)
      : pathScene
  }

const getPath = ({ target }: Move): string[] =>
  target?.split('/').splice(1) ?? []

export const getTargetedScene: (
  move: Move
) => (scenes: BookScene[]) => BookScene = (move) => (scenes) => {
  return getSceneByPath(move)(scenes, getPath(move))
}

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
