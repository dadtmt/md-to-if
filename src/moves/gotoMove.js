import * as R from 'ramda'
import { incPlayedSceneCount } from './playedSceneCount'

export const getTarget = R.pipe(R.prop('target'), R.tail)

export const matchTarget = move => R.propEq('name', getTarget(move))

export const gotoScene = move => R.find(matchTarget(move))

const incrementPlayedScene = name =>
  R.pipe(R.assoc('currentSceneName', name), incPlayedSceneCount(name))

const goto = (scenes, story) => [
  R.propEq('type', 'anchor'),
  move => {
    const lastState = R.pipe(R.last, R.prop('state'))(story)
    const scene = gotoScene(move)(scenes)
    const { name } = scene

    return {
      ...scene,
      state: incrementPlayedScene(name)(lastState),
    }
  },
]

export default goto
