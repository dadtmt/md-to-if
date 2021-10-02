import * as R from 'ramda'
import { snakeCase } from 'change-case'
import { ActionScene, BookScene } from '.'
import { SingleASTNode } from 'simple-markdown'

interface SplittedContent {
  heading: SingleASTNode
  contentAndActions: SingleASTNode[]
  sourceLeft: SingleASTNode[]
}

// @ts-expect-error
const getSceneLabel: (content: SingleASTNode) => string = R.pipe(
  R.propOr([], 'content'),
  R.head,
  R.propOr('unnamed', 'content')
)

const getSceneName: (content: SingleASTNode) => string = R.pipe(
  getSceneLabel,
  snakeCase
)

const splitByHeading: (
  level: number
) => (content: SingleASTNode[]) => SingleASTNode[][] = (level) =>
  R.splitWhen(
    R.where({
      type: R.equals('heading'),
      level: R.equals(level)
    })
  )

const getQuoteMenu = (content: SingleASTNode[]): SingleASTNode | undefined =>
  content.find(({ type }: SingleASTNode) => type === 'blockQuote')

const splitActions = (
  level: number,
  parentScenePath: string,
  untreatedActions: SingleASTNode[],
  actionList: ActionScene[] = []
): ActionScene[] => {
  const [headOfContent, ...tailOfContent] = untreatedActions
  if (R.isEmpty(untreatedActions)) {
    return [...actionList]
  }
  const [actionContent, restOfContent] = splitByHeading(level)(tailOfContent)
  if (R.isEmpty(restOfContent)) {
    const name = getSceneName(headOfContent)
    return [
      ...actionList,
      {
        name,
        label: getSceneLabel(headOfContent),
        sceneContent: [headOfContent, ...actionContent],
        menu: { actions: [], quoteMenu: getQuoteMenu(actionContent) },
        path: `${parentScenePath}/${name}`
      }
    ]
  }
  const name = getSceneName(headOfContent)
  const path = `${parentScenePath}/${name}`
  const { content, actions } = splitContentAndActions(
    level + 1,
    path
  )(actionContent)
  return splitActions(level, parentScenePath, restOfContent, [
    ...actionList,
    {
      name,
      sceneContent: [headOfContent, ...content],
      label: getSceneLabel(headOfContent),
      menu: {
        actions,
        quoteMenu: getQuoteMenu(content)
      },
      path
    }
  ])
}

const splitContentAndActions =
  (level: number, parentSceneName: string) =>
  (contentAndActions: SingleASTNode[]) => {
    const [content, untreatedActions] = splitByHeading(level)(contentAndActions)
    const actions = splitActions(level, parentSceneName, untreatedActions)
    return {
      content: [...content],
      actions
    }
  }

const sortSplittedContent: (content: SingleASTNode[]) => any = R.zipObj([
  'heading',
  'contentAndActions',
  'sourceLeft'
])

const splitContentToSceneAndSourceLeft: (splittedContent: SplittedContent) => {
  scene: BookScene
  sourceLeft: SingleASTNode[]
} = ({ heading, contentAndActions, sourceLeft }) => {
  const name = getSceneName(heading)
  const quoteMenu = getQuoteMenu(contentAndActions)
  const { content, actions } = splitContentAndActions(
    3,
    `/${name}`
  )(contentAndActions)
  return {
    scene: {
      name,
      sceneContent: [heading, ...content],
      menu: { actions, quoteMenu }
    },
    sourceLeft
  }
}

const splitByScene: (level: number) => (content: SingleASTNode[]) => {
  scene: BookScene
  sourceLeft: SingleASTNode[]
} = (level) =>
  R.pipe(
    R.converge(R.prepend, [R.head, R.pipe(R.tail, splitByHeading(level))]),
    sortSplittedContent,
    splitContentToSceneAndSourceLeft
  )

const book: (source: SingleASTNode[], scenes?: BookScene[]) => BookScene[] = (
  source,
  scenes = []
) => {
  const { scene, sourceLeft } = splitByScene(2)(source)
  return R.isEmpty(sourceLeft)
    ? [...scenes, scene]
    : book(sourceLeft, [...scenes, scene])
}

export default book
