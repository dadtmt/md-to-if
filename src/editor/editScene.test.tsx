/** @jsx jsxEditor */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsxEditor from '../test/jsxEditor'
import editScene, { EditScene } from './editScene'

describe('editScene', () => {
  describe('when edit a first level scene ', () => {
    const book = (
      <book>
        <scene name="story_title">
          <hh1>Story title</hh1>
          <hp>Description</hp>
        </scene>
        <scene name="first_scene" path="/first_scene">
          <hh2>First scene</hh2>
          <hp>first scene text</hp>
        </scene>
      </book>
    ) as any as { children: EditScene[] }
    it('replaces the edited scene', () => {
      const editedScene = (
        <scene name="first_scene" path="/first_scene">
          <hh2>First scene</hh2>
          <hp>first scene edited text</hp>
        </scene>
      ) as any as EditScene

      const expected = (
        <book>
          <scene name="story_title">
            <hh1>Story title</hh1>
            <hp>Description</hp>
          </scene>
          <scene name="first_scene" path="/first_scene">
            <hh2>First scene</hh2>
            <hp>first scene edited text</hp>
          </scene>
        </book>
      ) as any as { children: EditScene[] }

      expect(editScene(book.children, editedScene)).toEqual(expected.children)
    })
    it('adds edited scene', () => {
      const editedScene = (
        <scene name="second_scene" path="/second_scene">
          <hh2>Second scene</hh2>
          <hp>Second scene edited text</hp>
        </scene>
      ) as any as EditScene

      const expected = (
        <book>
          <scene name="story_title">
            <hh1>Story title</hh1>
            <hp>Description</hp>
          </scene>
          <scene name="first_scene" path="/first_scene">
            <hh2>First scene</hh2>
            <hp>first scene text</hp>
          </scene>
          <scene name="second_scene" path="/second_scene">
            <hh2>Second scene</hh2>
            <hp>Second scene edited text</hp>
          </scene>
        </book>
      ) as any as { children: EditScene[] }

      expect(editScene(book.children, editedScene)).toEqual(expected.children)
    })
  })
})
