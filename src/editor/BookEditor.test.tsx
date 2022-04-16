/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { book } from '../test/editorTree'
import BookEditor from './BookEditor'
import 'jest-styled-components'

describe('BookEditor', () => {
  it('displays an editor', () => {
    render(<BookEditor />)
    screen.getByRole('textbox')
  })
  describe('An empty book editor', () => {
    it('render editor with a story title and story description', () => {
      render(<BookEditor />)
      expect(screen.getByRole('textbox')).toHaveTextContent(
        /Type the story title/i
      )
      screen.getByText(/Type the story description/i)
    })
  })
  describe('A book editor with a story', () => {
    it('render editor with a story title and story description', () => {
      render(<BookEditor book={book.children} />)
      screen.getByText(/Story title/i)
      screen.getByText(/Description/i)
    })
  })
  describe('A book editor with a selected path', () => {
    it('render editor with the scene title and content', () => {
      render(
        <BookEditor book={book.children} path={['first_scene', 'action1']} />
      )
      screen.getByText('Action 1')
      screen.getByText(/Action 1 text/i)
    })
  })
})
