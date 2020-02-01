import * as R from 'ramda'

const playedSceneCountLens = name => R.lensPath(['played', name])

export const incPlayedSceneCount = name =>
  R.over(playedSceneCountLens(name), R.pipe(R.inc, R.defaultTo(1)))

const getPlayedSceneCount = state => {
  const { currentSceneName } = state
  return R.view(playedSceneCountLens(currentSceneName))(state)
}

export default getPlayedSceneCount
