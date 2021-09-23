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

const getQuoteMenu = (
  content: SingleASTNode[],
  parentQuoteMenu?: SingleASTNode | undefined
): SingleASTNode | undefined =>
  content.find(({ type }: SingleASTNode) => type === 'blockQuote') ??
  parentQuoteMenu

const splitActions: (
  level: number,
  untratedActions: SingleASTNode[],
  parentQuoteMenu: SingleASTNode | undefined,
  actionList?: ActionScene[]
) => ActionScene[] = (
  level,
  untreatedActions,
  parentQuoteMenu,
  actionList = []
) => {
  const [headOfContent, ...tailOfContent] = untreatedActions
  if (R.isEmpty(untreatedActions)) {
    return [...actionList]
  }
  const [actionContent, restOfContent] = splitByHeading(level)(tailOfContent)
  if (R.isEmpty(restOfContent)) {
    return [
      ...actionList,
      {
        name: getSceneName(headOfContent),
        actionLabel: getSceneLabel(headOfContent),
        sceneContent: [headOfContent, ...actionContent],
        actions: [],
        quoteMenu: getQuoteMenu(actionContent, parentQuoteMenu)
      }
    ]
  }
  const { content, actions } = splitContentAndActions(
    level + 1,
    parentQuoteMenu
  )(actionContent)

  return splitActions(level, restOfContent, parentQuoteMenu, [
    ...actionList,
    {
      name: getSceneName(headOfContent),
      sceneContent: [headOfContent, ...content],
      actions,
      actionLabel: getSceneLabel(headOfContent),
      quoteMenu: getQuoteMenu(content, parentQuoteMenu)
    }
  ])
}

const splitContentAndActions: (
  level: number,
  parentQuoteMenu: SingleASTNode | undefined
) => (contentAndActions: SingleASTNode[]) => {
  content: SingleASTNode[]
  actions: ActionScene[]
} = (level, parentQuoteMenu) => (contentAndActions) => {
  const [content, untreatedActions] = splitByHeading(level)(contentAndActions)
  return {
    content,
    actions: splitActions(level, untreatedActions, parentQuoteMenu)
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
  const quoteMenu = getQuoteMenu(contentAndActions)
  const { content, actions } = splitContentAndActions(
    3,
    quoteMenu
  )(contentAndActions)
  return {
    scene: {
      name: getSceneName(heading),
      sceneContent: [heading, ...content],
      actions,
      quoteMenu
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
