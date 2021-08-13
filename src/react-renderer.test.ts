/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'

import book from './book'
import parser from './parser'
import adventure from './adventure.md'
import renderer, { MoveHandler } from './react-renderer'
import player from './player'

const startMove = {
  type: 'start'
}

const adventureBook = book(parser(adventure))

const moveHandler: MoveHandler = jest.fn()

test('Render title and start button while playing intro (no moves)', () => {
  render(renderer(moveHandler)(player(adventureBook)))
  expect(screen.queryByRole('heading', { level: 1 })).toHaveTextContent(
    'Choose your story'
  )
  expect(screen.getByRole('link')).toHaveTextContent('Start')
})

test('Click on the start button calls moveHandler with a start move', async () => {
  render(renderer(moveHandler)(player(adventureBook)))
  fireEvent.click(screen.getByText(/Start/i))
  expect(moveHandler).toHaveBeenCalledTimes(1)
  expect(moveHandler).toHaveBeenCalledWith(startMove)
})

test('A started adventure does not show the start button', async () => {
  render(renderer(moveHandler)(player(adventureBook, [startMove])))
  expect(screen.queryByRole('link', { name: 'start' })).toBeNull()
})
