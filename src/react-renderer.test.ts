/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import book from './book'
import parser from './parser'
import adventure from './adventure.md'
import renderer from './react-renderer'
import player from './player'

const adventureBook = book(parser(adventure))

test('Render title and start button while playing intro (no moves)', () => {
  render(renderer(player(adventureBook)))
  expect(screen.queryByRole('heading', { level: 1 })).toHaveTextContent(
    'Choose your story'
  )
  expect(screen.getByRole('link')).toHaveTextContent('Start')
})
