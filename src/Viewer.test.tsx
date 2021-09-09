/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import book from './book'
import parser from './parser'
import adventure from './adventure.md'
import Viewer from './Viewer'

test('Click on start display first scene', async () => {
  render(<Viewer book={book(parser(adventure))} />)
  fireEvent.click(screen.getByText(/Start/i))
  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'The space ship'
    )
  })
})
