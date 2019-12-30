import * as R from 'ramda'

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
