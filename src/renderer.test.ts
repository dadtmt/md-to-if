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

jest.mock('./expressions/rollDices')

const { adventureGlobals } = global
const {
  adventureMd,
  startMove,
  moveToCantina,
  moveToCantinaDrink,
  moveToCantinaEat,
  moveToCantinaDrinkWhisky,
  moveToCantinaDrinkMilkshake,
  moveToBedroom,
  moveToBedroomTheDroidShoots
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

test('renders the menu quote and links to action in Cantina scene', async () => {
  render(
    renderer(moveHandler)(player(adventureBook, [startMove, moveToCantina]))
  )
  expect(screen.getByText(/The waiter takes your order/i)).toBeDefined()
  fireEvent.click(screen.getByRole('link', { name: '/cantina/drink' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaDrink)
  fireEvent.click(screen.getByRole('link', { name: '/cantina/eat' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaEat)
})

test('renders the scene cantina/drink with its menu', async () => {
  render(
    renderer(moveHandler)(
      player(adventureBook, [startMove, moveToCantina, moveToCantinaDrink])
    )
  )
  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Drink')
  expect(
    screen.getByText(/Will you have a whisky or a milkshake ?/i)
  ).toBeDefined()
  fireEvent.click(screen.getByRole('link', { name: '/cantina/drink/whisky' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaDrinkWhisky)
  fireEvent.click(
    screen.getByRole('link', { name: '/cantina/drink/milkshake' })
  )
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaDrinkMilkshake)
})

test('renders the scene cantina/drink/whisky with the same menu as cantina scene', async () => {
  render(
    renderer(moveHandler)(
      player(adventureBook, [
        startMove,
        moveToCantina,
        moveToCantinaDrink,
        moveToCantinaDrinkWhisky
      ])
    )
  )
  expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Whisky')
  expect(screen.getByText(/The waiter takes your order/i)).toBeDefined()
  fireEvent.click(screen.getByRole('link', { name: '/cantina/drink' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaDrink)
  fireEvent.click(screen.getByRole('link', { name: '/cantina/eat' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaEat)
})

test('renders the scene cantina/eat with the same menu as cantina scene', async () => {
  render(
    renderer(moveHandler)(
      player(adventureBook, [startMove, moveToCantina, moveToCantinaEat])
    )
  )
  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Eat')
  expect(screen.getByText(/The waiter takes your order/i)).toBeDefined()
  fireEvent.click(screen.getByRole('link', { name: '/cantina/drink' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaDrink)
  fireEvent.click(screen.getByRole('link', { name: '/cantina/eat' }))
  expect(moveHandler).toHaveBeenCalledWith(moveToCantinaEat)
})

test('renders the scene Bedroom', async () => {
  render(
    renderer(moveHandler)(player(adventureBook, [startMove, moveToBedroom]))
  )
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Bedroom')
  expect(screen.getByText(/You roll a dice it gives 42/i)).toBeDefined()
  expect(screen.getByText(/Droid has 45 CT/i)).toBeDefined()
})

test('renders the action scene The Droid Shoots', async () => {
  render(
    renderer(moveHandler)(
      player(adventureBook, [
        startMove,
        moveToBedroom,
        moveToBedroomTheDroidShoots
      ])
    )
  )
  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
    'The Droid shoots'
  )
  expect(screen.queryByText(/test roll d100 lte val droid CT/i)).toBeNull()
  expect(screen.getByText(/You are shot/i)).toBeDefined()
  expect(screen.queryByText(/You luckyly escape/i)).toBeNull()
  expect(screen.getByText(/Ouch that hurts/i)).toBeDefined()
})
