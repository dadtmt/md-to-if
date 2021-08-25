import R from 'ramda'
import { ReactElement } from 'react'
import { outputFor, SingleASTNode, ReactOutputRule } from 'simple-markdown'
import rules from './outpurules'
import { Move, PlayedScene } from './player'

export type MoveHandler = (move: Move) => void

const ifNotStartedAddStartButton =
  (currentSceneName: string | undefined) => (sceneContent: SingleASTNode[]) =>
    (currentSceneName ?? null) == null
      ? [
          ...sceneContent,
          {
            type: 'link',
            target: 'start',
            content: [{ type: 'text', content: 'Start' }]
          }
        ]
      : sceneContent

const addNodeFromState = ({
  sceneContent,
  state: { currentSceneName }
}: PlayedScene): SingleASTNode[] =>
  ifNotStartedAddStartButton(currentSceneName)(sceneContent)

const Renderer: (
  moveHandler: MoveHandler
) => (scenes: PlayedScene[]) => ReactElement = (moveHandler) => {
  return R.pipe(
    R.last,
    addNodeFromState,
    outputFor<ReactOutputRule, 'react'>(rules(moveHandler), 'react')
  )
}

export default Renderer
