import * as R from 'ramda'

import { Lens } from 'ramda'

type State = {
  currentSceneName: string ;
  played?: { currentSceneName: number } ; 
  path?: { to: { the: string } } ;
}

// String -> Lens
const playedSceneCountLens: (name: string) => Lens = name =>
  R.lensPath(['played', name])

// String -> State -> State
export const incPlayedSceneCount: (
  name: string
) => (state: State) => State = name =>
  R.over(playedSceneCountLens(name), R.pipe(R.inc, R.defaultTo(1)))

const getPlayedSceneCount: (name: string) => (state: State) => number = name =>
  R.view(playedSceneCountLens(name))

// State -> Number
const getCurrentPlayedSceneCount: (state: State) => number = state => {
  const { currentSceneName } = state
  return getPlayedSceneCount(currentSceneName)(state)
}

export default getCurrentPlayedSceneCount
