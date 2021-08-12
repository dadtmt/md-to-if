/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'

import book from './book'
import parser from './parser'
import adventure from './adventure.md'
import renderer, { Handler } from './react-renderer'
import player from './player'

const adventureBook = book(parser(adventure))

const handler: Handler = {
  handleStartClick: jest.fn()
}

test('Render title and start button while playing intro (no moves)', () => {
  render(renderer(handler)(player(adventureBook)))
  expect(screen.queryByRole('heading', { level: 1 })).toHaveTextContent(
    'Choose your story'
  )
  expect(screen.getByRole('link')).toHaveTextContent('Start')
})

test('Click on the start button calls handleStartClick', () => {
  render(renderer(handler)(player(adventureBook)))
  fireEvent.click(screen.getByText(/Start/i))
  expect(handler.handleStartClick).toHaveBeenCalledTimes(1)
})
