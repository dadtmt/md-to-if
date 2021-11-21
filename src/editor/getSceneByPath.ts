import { EditScene } from './editScene'

const getSceneByPath = (
  scenes: EditScene[],
  targetPath: string[]
): EditScene | undefined => {
  const [targetSceneName, ...restOfPath] = targetPath
  const foundScene = scenes.find(({ name }) => {
    return targetSceneName === name
  })
  if (restOfPath.length > 0 && foundScene !== undefined) {
    const { dialog } = foundScene
    if (dialog === undefined) {
      return undefined
    }
    const { actions } = dialog
    return getSceneByPath(actions, restOfPath)
  }
  return foundScene
}

export default getSceneByPath
