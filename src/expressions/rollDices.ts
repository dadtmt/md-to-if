import * as R from 'ramda'
// @ts-expect-error
import DiceRoller from 'roll-dice'
import { Expression, TestAndParseExpression } from '.'
import { right, left } from 'fp-ts/lib/Either'

const diceRoller = new DiceRoller()

const roll: (input: string) => { result: number } = (input) =>
  diceRoller.roll(input)

export const getInput: (expression: Expression) => string | undefined = R.nth(1)

const getResult: (dices: { result: number }) => number = R.prop('result')

const rollDices: TestAndParseExpression = [
  R.pipe(R.head, R.equals('roll')),
  (expression) => {
    const input = getInput(expression)
    return R.pipe(
      roll,
      getResult,
      R.ifElse(
        R.isNil,
        R.always(
          left(`${input ?? 'no input'} is not a valid dices input, try d6`)
        ),
        right
      )
    )(input ?? '')
  }
]

export default rollDices
