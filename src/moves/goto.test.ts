import parser from '../parser'
import { getTargetedScene, getTargetSceneName, matchTarget } from './goto'
import adventure from '../adventure.md'
import book from '../book'

const adventureBook = book(parser(adventure))

const moveToCantina = {
  type: 'anchor',
  target: '/cantina'
}
const moveToSpaceShip = {
  type: 'anchor',
  target: '/the_space_ship'
}
const moveToUnknown = {
  type: 'anchor',
  target: '/unknown'
}

describe('getTargetedScene', () => {
  it('get the targeted scene', () => {
    expect(getTargetedScene(moveToCantina)(adventureBook)).toMatchSnapshot()
  })
  it('get the unknown scene', () => {
    expect(getTargetedScene(moveToUnknown)(adventureBook)).toMatchSnapshot()
  })
})

describe('matchTarget', () => {
  it('move to cantina match cantina scene', () => {
    const cantinaScene = adventureBook[2]
    expect(matchTarget(moveToCantina)(cantinaScene)).toBe(true)
  })
  it('move to cantina does not match spaceship scene', () => {
    const spaceShipScene = adventureBook[1]
    expect(matchTarget(moveToCantina)(spaceShipScene)).toBe(false)
  })
  it('move to spaceship match spaceship scene', () => {
    const spaceShipScene = adventureBook[1]
    expect(matchTarget(moveToSpaceShip)(spaceShipScene)).toBe(true)
  })
})

describe('getTargetSceneName', () => {
  it('get the targeted scene name', () => {
    expect(getTargetSceneName(moveToCantina)).toBe('cantina')
  })
})
