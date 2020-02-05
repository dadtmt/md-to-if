import * as R from 'ramda'

// { a } -> [Idx] -> Boolean
const hasPathTo = R.flip(R.path)

// { a } -> [Idx] -> a
const pathTo = R.flip(R.path)

// State -> [[String] -> Boolean, [String] -> String]
const getValue = state => [hasPathTo(state), pathTo(state)]

export default getValue
