import * as R from 'ramda'

type State = {
  currentSceneName: string ;
  played?: { currentSceneName: number } ; 
  path?: { to: { the: string } } ;
}

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
  R.pipe(pathTo(state), R.toString),
]

export default getValue
