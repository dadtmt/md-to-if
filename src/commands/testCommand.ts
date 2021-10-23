import * as R from 'ramda'

import { TestCommandAndUpdateState } from '.'
import { State } from '../moves'
import { right } from 'fp-ts/lib/Either'
import foldError from '../utils/foldError'
import evaluateTest from '../evaluateTest'

const storeTestResult = (testResult: boolean): ((state: State) => State) =>
  R.assoc('testResult', testResult)

const test: TestCommandAndUpdateState = [
  R.propEq('instruction', 'test'),
  ({ args }) =>
    (state) =>
      foldError<boolean, State>((testResult) =>
        right(storeTestResult(testResult)(state))
      )(evaluateTest(args, state))
]

export default test
