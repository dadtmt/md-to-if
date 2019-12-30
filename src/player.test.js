import parser from './parser'
import player from './player'
import adventure from './adventure.md.js'

describe('player', () => {
  it('play only introduction if no actions', () => {
    expect(player(parser(adventure))).toMatchSnapshot()
  })
})
