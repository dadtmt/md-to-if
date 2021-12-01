/** @jsx jsxEditor */

import { Descendant } from 'slate'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsxEditor from '../test/jsxEditor'
import { book } from '../test/editorTree'
import editScene from './editScene'
import { EditScene } from '.'

describe('editScene', () => {
  describe('when edit a first level scene ', () => {
    it('replaces the edited scene', () => {
      const editedScene: EditScene = {
        ...book.children[1],
        children: [
          ...[...book.children[1].children].splice(0, 1),
          (<hp>first scene edited text</hp>) as any as Descendant
        ]
      }
      const expected = {
        ...book,
        children: [book.children[0], editedScene]
      }

      expect(editScene(book.children, editedScene)).toEqual(expected.children)
    })
    it('adds edited scene', () => {
      const editedScene = (
        <scene name="second_scene" path="/second_scene">
          <hh2>Second scene</hh2>
          <hp>Second scene edited text</hp>
        </scene>
      ) as any as EditScene

      const expected = { ...book, children: [...book.children, editedScene] }

      expect(editScene(book.children, editedScene)).toEqual(expected.children)
    })
  })
  describe('when edit an actionscene', () => {
    it('replaces the edited action scene', () => {
      const editedScene: EditScene = {
        ...book.children[1].dialog.actions[0],
        children: [
          ...[
            ...[...book.children[1].dialog.actions[0].children].splice(0, 1),
            (<hp>Action 1 edited text</hp>) as any as Descendant
          ]
        ]
      }

      const expected = {
        ...book,
        children: [
          book.children[0],
          {
            ...book.children[1],
            dialog: {
              ...book.children[1].dialog,
              actions: [editedScene, book.children[1].dialog.actions[1]]
            }
          }
        ]
      }
      expect(editScene(book.children, editedScene)).toEqual(expected.children)
    })

    it('adds the edited action scene', () => {
      const editedScene = (
        <scene name="action3" path="/first_scene/action3">
          <hh3>Action 3</hh3>
          <hp>Action 3</hp>
        </scene>
      ) as any as EditScene
      const expected = {
        ...book,
        children: [
          book.children[0],
          {
            ...book.children[1],
            dialog: {
              ...book.children[1].dialog,
              actions: [...book.children[1].dialog.actions, editedScene]
            }
          }
        ]
      }
      expect(editScene(book.children, editedScene)).toEqual(expected.children)
    })
  })
})
