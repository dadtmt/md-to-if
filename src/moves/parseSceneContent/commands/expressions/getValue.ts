import * as R from 'ramda'
import { State } from '../../..'
import { TestAndParseExpression } from '.'

// { a } -> [Idx] -> Boolean
const hasPathTo = R.flip(R.path)

// { a } -> [Idx] -> a
const pathTo = R.flip(R.path)

//TODO fix type string number issue
const getValue: (state: State) => TestAndParseExpression = state => [
  R.pipe(hasPathTo(state), R.isNil, R.not),
  R.pipe(pathTo(state), R.identity),
]

export default getValue
