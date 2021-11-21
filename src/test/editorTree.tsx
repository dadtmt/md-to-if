/** @jsx jsxEditor */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsxEditor from './jsxEditor'
import { EditScene } from '../editor/editScene'

export const book = (
  <book>
    <scene name="story_title">
      <hh1>Story title</hh1>
      <hp>Description</hp>
    </scene>
    <scene
      name="first_scene"
      path="/first_scene"
      dialog={{
        actions: [
          <scene name="action1" path="/first_scene/action1">
            <hh3>Action 1</hh3>
            <hp>Action 1 text</hp>
          </scene>,
          <scene name="action2" path="/first_scene/action2">
            <hh3>Action 2</hh3>
            <hp>Action 2 text</hp>
          </scene>
        ],
        quote: <hblockquote>first scene dialog</hblockquote>
      }}>
      <hh2>First scene</hh2>
      <hp>first scene text</hp>
    </scene>
  </book>
) as any as { children: EditScene[] }
