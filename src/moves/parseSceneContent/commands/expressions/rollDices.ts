import * as R from 'ramda'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DiceRoller from 'roll-dice'

const diceRoller = new DiceRoller()

const roll: (input: string | undefined) => { result: number } = input =>
  diceRoller.roll(input)

const getInput: (expression: string[]) => string | undefined = R.nth(1)

const getResult: (dices: { result: number }) => number = R.prop('result')

const rollDices: [
  (expression: string[]) => boolean,
  (expression: string[]) => number
] = [R.pipe(R.head, R.equals('roll')), R.pipe(getInput, roll, getResult)]

export default rollDices
