import adventureMd from './adventure.md'
import type { Move } from '../player'

const startMove = {
  type: 'start'
}
const moveToCantina = {
  type: 'anchor',
  target: '/cantina'
}
const moveToSpaceShip = {
  type: 'anchor',
  target: '/the_space_ship'
}
const moveToBedroom = {
  type: 'anchor',
  target: '/bedroom'
}

const moveToUnknown = {
  type: 'anchor',
  target: '/unknown'
}

const moveToCantinaDrink = {
  type: 'anchor',
  target: '/cantina/drink'
}

const moveToCantinaEat = {
  type: 'anchor',
  target: '/cantina/eat'
}

const moveToCantinaDrinkWhisky = {
  type: 'anchor',
  target: '/cantina/drink/whisky'
}

export interface AdventureGlobals {
  adventureMd: string
  startMove: Move
  moveToCantina: Move
  moveToSpaceShip: Move
  moveToBedroom: Move
  moveToUnknown: Move
  moveToCantinaDrink: Move
  moveToCantinaEat: Move
  moveToCantinaDrinkWhisky: Move
}

const adventureGlobals: AdventureGlobals = {
  adventureMd,
  startMove,
  moveToCantina,
  moveToSpaceShip,
  moveToBedroom,
  moveToCantinaDrink,
  moveToCantinaEat,
  moveToCantinaDrinkWhisky,
  moveToUnknown
}

export default adventureGlobals
