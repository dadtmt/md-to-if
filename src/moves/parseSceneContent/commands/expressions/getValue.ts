import * as R from 'ramda'
import { State } from '../../..'

// { a } -> [Idx] -> Boolean
const hasPathTo = R.flip(R.path)

// { a } -> [Idx] -> a
const pathTo = R.flip(R.path)

// State -> [[String] -> Boolean, [String] -> String]
const getValue: (
  state: State
) => [
  (expression: string[]) => boolean,
  (expression: string[]) => string
] = state => [
  R.pipe(hasPathTo(state), R.isNil, R.not),
  R.pipe(pathTo(state), val =>
    typeof val === 'string' ? val : R.toString(val)
  ),
]

export default getValue
