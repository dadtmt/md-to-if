import * as R from 'ramda'
import { snakeCase } from 'change-case'

// Content -> String
export const getSceneName = R.pipe(
  R.propOr([], 'content'),
  R.head,
  R.propOr('unnamed', 'content'),
  snakeCase
)

// int -> [Content] -> [[Content],[Content]]
const splitByHeading = level =>
  R.splitWhen(
    R.where({
      type: R.equals('heading'),
      level: R.equals(level),
    })
  )

const splitActions = (level, contentList, actionList = []) => {
  const [headOfContent, ...tailOfContent] = contentList
  const [actionContent, restOfContent] = splitByHeading(level)(tailOfContent)
  const { content, actions } =
    level <= 6
      ? splitContentAndActions(level + 1)(actionContent)
      : {
          content: [],
          actions: [],
        }
  return !R.isEmpty(restOfContent)
    ? splitActions(level, restOfContent, [
        ...actionList,
        {
          name: getSceneName(headOfContent),
          sceneContent: [headOfContent, ...content],
          actions,
        },
      ])
    : actionList
}

// [Content] -> { content: [Content], actions: [Scene] }
export const splitContentAndActions = (level: number) => contentAndActions => {
  const [content, actions] = splitByHeading(level)(contentAndActions)
  return { content, actions: splitActions(level, actions) }
}

// [Content] -> { scene: Scene, content: [Content] }
export const splitByScene = (level: number): Function =>
  R.pipe(
    R.converge(R.prepend, [R.head, R.pipe(R.tail, splitByHeading(level))]),
    R.zipObj(['heading', 'content', 'sourceLeft']),
    ({ content, ...rest }) => ({
      content,
      ...rest,
    }),
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
