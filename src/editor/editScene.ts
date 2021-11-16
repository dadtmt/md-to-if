export interface EditScene {
  type: 'scene'
  name: string
  path: string
}

const editScene = (
  scenes: EditScene[],
  editedScene: EditScene
): EditScene[] => {
  const { path: editedScenePath } = editedScene
  const existingScene = scenes.find(({ path }) => path === editedScenePath)
  return existingScene !== undefined
    ? scenes.map((scene) => {
        const { path } = scene
        return path === editedScenePath ? editedScene : scene
      })
    : [...scenes, editedScene]
}

export default editScene
