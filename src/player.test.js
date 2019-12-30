import parser from './parser'
import player, { findScene, getTarget, matchTarget } from './player'
import adventure from './adventure.md.js'
import book from './book'

const adventureBook = book(parser(adventure))
const startMove = {
  type: 'start',
}
const moveToCantina = {
  type: 'anchor',
  target: '/cantina',
}

describe('player', () => {
  it('play book introduction if no actions', () => {
    expect(player(adventureBook)).toMatchSnapshot()
  })
  it('play second level 2 scene on start', () => {
    const moves = [startMove]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
  it('play cantina scene on cantina target', () => {
    const moves = [startMove, moveToCantina]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
})

describe('findScene', () => {
  it('find a scene', () => {
    expect(findScene(moveToCantina)(adventureBook)).toMatchSnapshot()
  })
})

describe('matchTarget', () => {
  it('match cantina scene', () => {
    const cantinaScene = { content: adventureBook[2], name: 'cantina' }
    expect(matchTarget(moveToCantina)(cantinaScene)).toBe(true)
  })
  it('does not match cantina scene', () => {
    const cantinaScene = { content: adventureBook[1], name: 'the-space-ship' }
    expect(matchTarget(moveToCantina)(cantinaScene)).toBe(false)
  })
})

describe('getTarget', () => {
  it('get move target', () => {
    expect(getTarget(moveToCantina)).toBe('cantina')
  })
})
