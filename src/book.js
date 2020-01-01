import * as R from 'ramda'
import { snakeCase } from 'change-case'

export const getSceneName = R.pipe(
  R.propOr([], 'content'),
  R.head,
  R.propOr('unnamed', 'content'),
  snakeCase
)

export const splitByScene = R.pipe(
  R.converge(R.prepend, [
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
  ]),
  R.zipObj(['heading', 'content', 'sourceLeft']),
  ({ heading, content, sourceLeft }) => ({
    scene: {
      name: getSceneName(heading),
      content: [heading, ...content],
    },
    sourceLeft,
  })
)

const book = (source, scenes = []) => {
  const { scene, sourceLeft } = splitByScene(source)
  return R.isEmpty(sourceLeft)
    ? [...scenes, scene]
    : book(sourceLeft, [...scenes, scene])
}

export default book
