import R from 'ramda'
import React from 'react'
import {
  outputFor,
  defaultRules,
  SingleASTNode,
  ReactOutputRule,
  State,
  ReactOutput
} from 'simple-markdown'
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
) => (scenes: PlayedScene[]) => React.ReactElement = (moveHandler) =>
  R.pipe(
    R.last,
    addNodeFromState,
    outputFor<ReactOutputRule, 'react'>(
      {
        ...defaultRules,
        link: {
          ...defaultRules.link,
          react: (node: SingleASTNode, output: ReactOutput, { key }: State) => {
            return (
              <a
                key={key}
                href={node.target}
                aria-label={node.target}
                onClick={() =>
                  moveHandler({
                    type: 'start'
                  })
                }>
                {output(node.content)}
              </a>
            )
          }
        }
      },
      'react'
    )
  )

export default Renderer
