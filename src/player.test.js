import parser from './parser'
import player from './player'
import adventure from './adventure.md.js'
import book from './book'

describe('player', () => {
  it('play book introduction if no actions', () => {
    expect(player(book(parser(adventure)))).toMatchSnapshot()
  })
  it('play second level 2 scene on start', () => {
    const moves = [{ type: 'start' }]
    expect(player(book(parser(adventure)), moves)).toMatchSnapshot()
  })
})
