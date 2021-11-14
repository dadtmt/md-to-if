/** @jsx jsxEditor */

import { PlateEditor } from '@udecode/plate-core'
import serialize, { Chunk } from './serialize'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsxEditor from '../test/jsxEditor'

describe('serialize', () => {
  const storyTitleMd = `# Story title
Description 
`
  it('serializes story title and description', () => {
    const input = (
      <editor>
        <hh1>Story title</hh1>
        <hp>
          Description <cursor />
        </hp>
      </editor>
    ) as any as PlateEditor
    expect(
      input.children
        .map((v) => {
          return serialize(v as Chunk)
        })
        .join('')
    ).toBe(storyTitleMd)
  })

  it('serializes a command', () => {
    const input = (
      <editor>
        <hcommand>show something</hcommand>
      </editor>
    ) as any as PlateEditor
    expect(
      input.children
        .map((v) => {
          return serialize(v as Chunk)
        })
        .join('')
    ).toBe('{show something}')
  })
})
