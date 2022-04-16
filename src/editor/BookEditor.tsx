import { createHeadingPlugin, Plate } from '@udecode/plate'
import React, { FC } from 'react'
import { EditScene } from '.'
import getSceneByPath from './getSceneByPath'

interface BookEditorProps {
  book?: EditScene[]
  path?: string[]
}

const BookEditor: FC<BookEditorProps> = ({ book = [], path = [] }) => {
  const initialValue =
    getSceneByPath(book, path)?.children ??
    (book.length > 0
      ? book[0].children
      : [
          { type: 'h1', text: 'Type the story title' },
          { type: 'p', text: 'Type the story description' }
        ])
  return (
    <div>
      <Plate initialValue={initialValue} plugins={[createHeadingPlugin()]} />
    </div>
  )
}

export default BookEditor
