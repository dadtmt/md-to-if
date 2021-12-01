import { EditScene } from '.'

const editScene = (
  scenes: EditScene[],
  editedScene: EditScene,
  lookedPath?: string[]
): EditScene[] => {
  const { path: editedScenePath } = editedScene
  const [nameToLook, ...restOfPath] =
    lookedPath ?? editedScenePath.split('/').splice(1)
  const existingScene = scenes.find(({ name }) => name === nameToLook)
  if (existingScene !== undefined) {
    return scenes.map((scene) => {
      const { dialog, name, path } = scene
      if (restOfPath.length === 0) {
        return path === editedScenePath ? editedScene : scene
      }
      if (dialog === undefined) {
        return scene
      }
      const { actions } = dialog
      return nameToLook === name
        ? {
            ...scene,
            dialog: {
              ...dialog,
              actions: editScene(actions, editedScene, restOfPath)
            }
          }
        : scene
    })
  }
  return restOfPath.length === 0 ? [...scenes, editedScene] : scenes
}

export default editScene
