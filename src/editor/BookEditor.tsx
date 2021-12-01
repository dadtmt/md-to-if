import { Plate } from '@udecode/plate'
import React, { FC } from 'react'
import { EditScene } from '.'

interface BookEditorProps {
  book?: EditScene[]
}

const BookEditor: FC<BookEditorProps> = ({ book }) => {
  const initialValue =
    book !== undefined && book.length > 0
      ? book[0].children
      : [
          { type: 'h1', text: 'Type the story title' },
          { type: 'p', text: 'Type the story description' }
        ]
  return (
    <div>
      <Plate initialValue={initialValue} />
    </div>
  )
}

export default BookEditor
