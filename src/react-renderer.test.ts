import { render, screen } from '@testing-library/react'

import book from './book'
import parser from './parser'
import adventure from './adventure.md'
import renderer from './react-renderer'
import player from './player'

const adventureBook = book(parser(adventure))
const startMove = {
  type: 'start',
}

describe('React render', ()=>{

    const output = render(
        renderer(
            player(adventureBook)
    ))

    it('render the adventure title', () => {
        expect(output.getByRole('heading', { level: 1 }))
    })
})