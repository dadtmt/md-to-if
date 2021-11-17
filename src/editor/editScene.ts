export interface EditScene {
  type: 'scene'
  name: string
  path: string
  dialog?: {
    actions: EditScene[]
  }
}

const editScene = (
  scenes: EditScene[],
  editedScene: EditScene,
  lookedPath?: string[]
): EditScene[] => {
  const { path: editedScenePath } = editedScene
  const [nameToLook, ...restOfPath] =
    lookedPath ?? editedScenePath.split('/').splice(1)
  const existingScene = scenes.find(({ name }) => name === nameToLook)
  if (restOfPath.length === 0) {
    return existingScene !== undefined
      ? scenes.map((scene) => {
          const { path } = scene
          return path === editedScenePath ? editedScene : scene
        })
      : [...scenes, editedScene]
  }
  return existingScene !== undefined
    ? scenes.map((scene) => {
        const { dialog, name } = scene
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
    : scenes
}

export default editScene
