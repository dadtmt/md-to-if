import * as R from 'ramda'
import { snakeCase } from 'change-case'

// Content -> String
export const getSceneName = R.pipe(
  R.propOr([], 'content'),
  R.head,
  R.propOr('unnamed', 'content'),
  snakeCase
)

// [Content] -> { Scene, [Content] }
export const splitByScene = level =>
  R.pipe(
    R.converge(R.prepend, [
      R.head,
      R.pipe(
        R.tail,
        R.splitWhen(
          R.where({
            type: R.equals('heading'),
            level: R.equals(level),
          })
        )
      ),
    ]),
    R.zipObj(['heading', 'content', 'sourceLeft']),
    // TODO parse content for actions
    ({ heading, content, sourceLeft }) => ({
      scene: {
        name: getSceneName(heading),
        sceneContent: [heading, ...content],
      },
      sourceLeft,
    })
  )

// [Content], [Scene] -> [Scene]
const book = (source, scenes = []) => {
  const { scene, sourceLeft } = splitByScene(2)(source)
  return R.isEmpty(sourceLeft)
    ? [...scenes, scene]
    : book(sourceLeft, [...scenes, scene])
}

export default book
