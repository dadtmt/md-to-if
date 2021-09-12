/**
 * @jest-environment ./src/test/adventure-jsdom-environment.ts
 */
import './test/types.d'
import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'

import book from './book'
import parser from './parser'
import renderer, { MoveHandler } from './renderer'
import player from './player'

const { adventureGlobals } = global
const {
  adventureMd,
  startMove,
  moveToCantina,
  moveToCantinaDrink,
  moveToCantinaEat
} = adventureGlobals
const adventureBook = book(parser(adventureMd))

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

test('A started adventure show first scene heading', async () => {
  render(renderer(moveHandler)(player(adventureBook, [startMove])))
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
    'The space ship'
  )
})

test('Click the goto cantina button calls moveHandler with a move to cantina', async () => {
  render(renderer(moveHandler)(player(adventureBook, [startMove])))
  fireEvent.click(screen.getByRole('link', { name: '/cantina' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantina)
})

test('It render link to action', async () => {
  render(
    renderer(moveHandler)(player(adventureBook, [startMove, moveToCantina]))
  )
  fireEvent.click(screen.getByRole('link', { name: '/cantina/drink' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaDrink)
  fireEvent.click(screen.getByRole('link', { name: '/cantina/eat' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaEat)
})
