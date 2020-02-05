import * as R from 'ramda'
import DiceRoller from 'roll-dice'

const diceRoller = new DiceRoller()

// String -> Number
const roll = input => diceRoller.roll(input)

// [[String] -> Boolean, [String] -> Number]
const rollDices = [
  R.pipe(R.head, R.equals('roll')),
  R.pipe(R.nth(1), roll, R.prop('result')),
]

export default rollDices
