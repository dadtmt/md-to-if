import * as R from 'ramda'

// String -> Lens
const playedSceneCountLens = name => R.lensPath(['played', name])

// String -> State -> State
export const incPlayedSceneCount = name =>
  R.over(playedSceneCountLens(name), R.pipe(R.inc, R.defaultTo(1)))

// State -> Number
const getPlayedSceneCount = state => {
  const { currentSceneName } = state
  return R.view(playedSceneCountLens(currentSceneName))(state)
}

export default getPlayedSceneCount
