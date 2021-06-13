import * as R from 'ramda'

import { Lens } from 'ramda'
import { State } from '../moves'

// String -> Lens
const playedSceneCountLens: (name: string) => Lens<State, number> = (name) =>
  R.lensPath(['played', name])

// String -> State -> State
export const incPlayedSceneCount: (name: string) => (state: State) => State = (
  name
) => R.over(playedSceneCountLens(name), R.pipe(R.inc, R.defaultTo(1)))

const getPlayedSceneCount: (
  name: string | undefined
) => (state: State) => number = (name) =>
  name !== undefined ? R.view(playedSceneCountLens(name)) : () => 0

// State -> Number
const getCurrentPlayedSceneCount: (state: State) => number = (state) => {
  const { currentSceneName } = state
  return getPlayedSceneCount(currentSceneName)(state)
}

export default getCurrentPlayedSceneCount
