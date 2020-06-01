import * as R from 'ramda'
import { snakeCase } from 'change-case'
import { Scene } from '.'
import { SingleASTNode } from 'simple-markdown'

// Content -> String
export const getSceneName: (content: SingleASTNode) => string = R.pipe(
  R.propOr([], 'content'),
  R.head,
  R.propOr('unnamed', 'content'),
  snakeCase
)

// int -> [SingleASTNode] -> [[SingleASTNode],[SingleASTNode]]
const splitByHeading: (
  level: number
) => (content: SingleASTNode[]) => SingleASTNode[][] = level =>
  R.splitWhen(
    R.where({
      type: R.equals('heading'),
      level: R.equals(level),
    })
  )

const splitActions: (
  level: number,
  contentList: SingleASTNode[],
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

// [SingleASTNode] -> { content: [SingleASTNode], actions: [Scene] }
export const splitContentAndActions: (
  level: number
) => (
  contentAndActions: SingleASTNode[]
) => {
  content: SingleASTNode[]
  actions: Scene[]
} = level => contentAndActions => {
  const [content, actions] = splitByHeading(level)(contentAndActions)
  return { content, actions: splitActions(level, actions) }
}

type SplittedContent = {
  heading: SingleASTNode
  content: SingleASTNode[]
  sourceLeft: SingleASTNode[]
}

const sortSplittedContent: (content: SingleASTNode[]) => any = R.zipObj([
  'heading',
  'content',
  'sourceLeft',
])

const splitContentToSceneAndSourceLeft: (
  splittedContent: SplittedContent
) => {
  scene: Scene
  sourceLeft: SingleASTNode[]
} = ({ heading, content, sourceLeft }) => ({
  scene: {
    name: getSceneName(heading),
    sceneContent: [heading, ...content],
  },
  sourceLeft,
})

// int -> [SingleASTNode] -> { scene: Scene, content: [SingleASTNode] }
export const splitByScene: (
  level: number
) => (
  content: SingleASTNode[]
) => { scene: Scene; sourceLeft: SingleASTNode[] } = level =>
  R.pipe(
    R.converge(R.prepend, [R.head, R.pipe(R.tail, splitByHeading(level))]),
    sortSplittedContent,
    splitContentToSceneAndSourceLeft
  )

// [SingleASTNode], [Scene] -> [Scene]
const book: (source: SingleASTNode[], scenes?: Scene[]) => Scene[] = (
  source,
  scenes = []
) => {
  const { scene, sourceLeft } = splitByScene(2)(source)
  return R.isEmpty(sourceLeft)
    ? [...scenes, scene]
    : book(sourceLeft, [...scenes, scene])
}

export default book
