/** @jsx jsx */

import { PlateEditor } from '@udecode/plate-core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@udecode/plate-test-utils'
import serialize, { Chunk } from './serialize'

describe('serialize', () => {
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
    ).toBe(`# Story title
Description 
`)
  })
})
