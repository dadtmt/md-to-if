import './test/types.d'
import parser from './parser'
import player from './player'
import book from './book'
import R from 'ramda'

jest.mock('./expressions/rollDices')

const { adventureGlobals } = global
const {
  adventureMd,
  startMove,
  moveToCantina,
  moveToSpaceShip,
  moveToBedroom
} = adventureGlobals
const adventureBook = book(parser(adventureMd))

describe('player', () => {
  it('play book introduction if no moves', () => {
    expect(player(adventureBook)).toMatchSnapshot()
    expect(player(adventureBook)).toHaveLength(1)
  })
  it('play first scene on start move and add state.played with first_scene: 1', () => {
    const moves = [startMove]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
  it('play cantina scene on cantina target', () => {
    const moves = [startMove, moveToCantina]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })

  it('add menu with 2 links at the end of content', () => {
    const moves = [startMove, moveToCantina]
    const { sceneContent } = R.last(player(adventureBook, moves))
    const { type, content } = R.last(sceneContent)
    expect(type).toBe('menu')
    expect(content).toHaveLength(2)
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
