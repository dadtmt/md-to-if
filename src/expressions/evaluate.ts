import { isFirstWord, TestAndParseExpression } from '.'
import evaluateTest from '../evaluateTest'
import { State } from '../moves'

const evaluate = (state: State): TestAndParseExpression => [
  isFirstWord('eval'),
  (expression) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [first, ...args] = expression
    return evaluateTest(args, state)
  }
]

export default evaluate
