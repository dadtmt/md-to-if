import { BookScene } from '../..'
import { Move } from '../../player'

const notFoundScene: (move: Move) => BookScene = (move) => {
  return {
    menu: { actions: [] },
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
    const {
      menu: { actions }
    } = pathScene
    return restOfSceneNames.length > 0 && actions.length > 0
      ? getSceneByPath(move)(actions, restOfSceneNames)
      : pathScene
  }

const getPath = ({ target }: Move): string[] =>
  target?.split('/').splice(1) ?? []

const getTargetedScene: (move: Move) => (scenes: BookScene[]) => BookScene =
  (move) => (scenes) => {
    return getSceneByPath(move)(scenes, getPath(move))
  }

export default getTargetedScene
