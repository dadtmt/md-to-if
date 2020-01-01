import * as R from 'ramda'
import { snakeCase } from 'change-case'

export const getSceneName = R.pipe(
  R.head,
  R.propOr([], 'content'),
  R.head,
  R.propOr('unnamed', 'content'),
  snakeCase
)

export const splitByScene = R.converge(R.prepend, [
  R.head,
  R.pipe(
    R.tail,
    R.splitWhen(
      R.where({
        type: R.equals('heading'),
        level: R.equals(2),
      })
    )
  ),
])

const book = (source, scenes = []) => {
  const [sceneHeading, sceneContent, sourceLeft] = splitByScene(source)
  return R.isEmpty(sourceLeft)
    ? [...scenes, [sceneHeading, ...sceneContent]]
    : book(sourceLeft, [...scenes, [sceneHeading, ...sceneContent]])
}

export default book
