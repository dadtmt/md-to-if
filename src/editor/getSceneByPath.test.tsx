import { book } from '../test/editorTree'
import getSceneByPath from './getSceneByPath'

describe('getSceneByPath', () => {
  it('returns scene matching the path /sceneName', () => {
    const expected = book.children[1]
    expect(getSceneByPath(book.children, ['first_scene'])).toEqual(expected)
  })
  it('returns scene matching the path /sceneName/actionSceneName', () => {
    const expected = book.children[1].dialog.actions[0]
    expect(getSceneByPath(book.children, ['first_scene', 'action1'])).toEqual(
      expected
    )
  })
})
