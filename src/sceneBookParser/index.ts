import * as R from 'ramda'
import { snakeCase } from 'change-case'
import { ActionScene, BookScene } from '..'
import { SingleASTNode } from 'simple-markdown'
import parseDialog from './parseDialog'

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
    const [contentWithoutDialog, dialog] = parseDialog(actionContent, [])
    return [
      ...actionList,
      {
        name,
        label: getSceneLabel(headOfContent),
        sceneContent: [headOfContent, ...contentWithoutDialog],
        dialog,
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
  const [contentWithoutDialog, dialog] = parseDialog(content, actions)
  return splitActions(level, parentScenePath, restOfContent, [
    ...actionList,
    {
      name,
      sceneContent: [headOfContent, ...contentWithoutDialog],
      label: getSceneLabel(headOfContent),
      dialog,
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
  const { content, actions } = splitContentAndActions(
    3,
    `/${name}`
  )(contentAndActions)
  const [contentWithoutDialog, dialog] = parseDialog(content, actions)
  return {
    scene: {
      name,
      sceneContent: [heading, ...contentWithoutDialog],
      dialog
    },
    sourceLeft
  }
}

const sceneBookParse: (level: number) => (content: SingleASTNode[]) => {
  scene: BookScene
  sourceLeft: SingleASTNode[]
} = (level) =>
  R.pipe(
    R.converge(R.prepend, [R.head, R.pipe(R.tail, splitByHeading(level))]),
    sortSplittedContent,
    splitContentToSceneAndSourceLeft
  )

export default sceneBookParse
