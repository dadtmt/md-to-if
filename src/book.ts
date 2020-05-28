import * as R from 'ramda'
import { snakeCase } from 'change-case'
import { Content } from './moves/parseSceneContent'
import { Scene } from './player'

// Content -> String
export const getSceneName: (content: Content) => string = R.pipe(
  R.propOr([], 'content'),
  R.head,
  R.propOr('unnamed', 'content'),
  snakeCase
)

// int -> [Content] -> [[Content],[Content]]
const splitByHeading: (
  level: number
) => (content: Content[]) => Content[][] = level =>
  R.splitWhen(
    R.where({
      type: R.equals('heading'),
      level: R.equals(level),
    })
  )

const splitActions: (
  level: number,
  contentList: Content[],
  actionList?: Scene[]
) => Scene[] = (level, contentList, actionList = []) => {
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
export const splitContentAndActions: (
  level: number
) => (
  contentAndActions: Content[]
) => { content: Content[]; actions: Scene[] } = level => contentAndActions => {
  const [content, actions] = splitByHeading(level)(contentAndActions)
  return { content, actions: splitActions(level, actions) }
}

type SplittedContent = {
  heading: Content
  content: Content[]
  sourceLeft: Content[]
}

const sortSplittedContent: (content: Content[]) => any = R.zipObj([
  'heading',
  'content',
  'sourceLeft',
])

const splitContentToSceneAndSourceLeft: (
  splittedContent: SplittedContent
) => {
  scene: Scene
  sourceLeft: Content[]
} = ({ heading, content, sourceLeft }) => ({
  scene: {
    name: getSceneName(heading),
    sceneContent: [heading, ...content],
  },
  sourceLeft,
})

// int -> [Content] -> { scene: Scene, content: [Content] }
export const splitByScene: (
  level: number
) => (content: Content[]) => { scene: Scene; sourceLeft: Content[] } = level =>
  R.pipe(
    R.converge(R.prepend, [R.head, R.pipe(R.tail, splitByHeading(level))]),
    sortSplittedContent,
    splitContentToSceneAndSourceLeft
  )

// [Content], [Scene] -> [Scene]
const book: (source: Content[], scenes: Scene[]) => Scene[] = (
  source,
  scenes = []
) => {
  const { scene, sourceLeft } = splitByScene(2)(source)
  return R.isEmpty(sourceLeft)
    ? [...scenes, scene]
    : book(sourceLeft, [...scenes, scene])
}

export default book
