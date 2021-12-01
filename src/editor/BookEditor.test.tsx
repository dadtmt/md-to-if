/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { book } from '../test/editorTree'
import BookEditor from './BookEditor'

describe('BookEditor', () => {
  it('displays an editor', () => {
    render(<BookEditor />)
    screen.getByRole('textbox')
  })
  describe('An empty book editor', () => {
    it('render editor with a story title and story description', () => {
      render(<BookEditor />)
      screen.getByText(/Type the story title/i)
      screen.getByText(/Type the story description/i)
    })
  })
  describe('A book editor with a story', () => {
    it('render editor with a story title and story description', () => {
      render(<BookEditor book={book.children} />)
      screen.getByText('Story Title')
      screen.getByText('Description')
    })
  })
})
