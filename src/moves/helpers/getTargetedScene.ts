import { BookScene } from '../..'
import { Move } from '../../player'
import getPath from './getPath'
import notFoundScene from './notFoundScene'

const getSceneByPath =
  (move: Move) =>
  (scenes: BookScene[], path: string[]): BookScene => {
    const [firstSceneName, ...restOfSceneNames] = path
    const pathScene =
      scenes.find(({ name }) => {
        return firstSceneName.localeCompare(name) === 0
      }) ?? notFoundScene(move)
    const {
      dialog: { actions }
    } = pathScene
    return restOfSceneNames.length > 0 && actions.length > 0
      ? getSceneByPath(move)(actions, restOfSceneNames)
      : pathScene
  }

const getTargetedScene: (move: Move) => (scenes: BookScene[]) => BookScene =
  (move) => (scenes) => {
    return getSceneByPath(move)(scenes, getPath(move))
  }

export default getTargetedScene
