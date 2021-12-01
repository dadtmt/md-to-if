import { Plate } from '@udecode/plate'
import React, { FC } from 'react'
import { EditScene } from '.'

interface BookEditorProps {
  book?: EditScene[]
}

const BookEditor: FC<BookEditorProps> = () => (
  <div>
    <Plate
      initialValue={[
        { type: 'h1', text: 'Type the story title' },
        { type: 'p', text: 'Type the story description' }
      ]}
    />
  </div>
)

export default BookEditor
