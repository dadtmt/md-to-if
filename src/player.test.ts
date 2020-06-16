import parser from './parser'
import player from './player'
import adventure from './adventure.md'
import book from './book'

jest.mock('./expressions/rollDices')

const adventureBook = book(parser(adventure))
const startMove = {
  type: 'start',
}
const moveToCantina = {
  type: 'anchor',
  target: '/cantina',
}
const moveToSpaceShip = {
  type: 'anchor',
  target: '/the_space_ship',
}
const moveToBedroom = {
  type: 'anchor',
  target: '/bedroom',
}

describe('player', () => {
  it('play book introduction if no actions', () => {
    expect(player(adventureBook)).toMatchSnapshot()
  })
  it('play first scene on start move and add state.played with first_scene: 1', () => {
    const moves = [startMove]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
  it('play cantina scene on cantina target', () => {
    const moves = [startMove, moveToCantina]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
  it('increment cantina scene played on second cantina move', () => {
    const moves = [startMove, moveToCantina, moveToCantina]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
  it('increment the spaceship scene played spaceship move', () => {
    const moves = [startMove, moveToCantina, moveToCantina, moveToSpaceShip]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
  it('describe a droid object in state on bedroom move', () => {
    const moves = [startMove, moveToBedroom]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
})
