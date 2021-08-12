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
import { PlayedScene } from './player'

export interface Handler {
  handleStartClick: () => void
}

const addNodeFromState = ({
  sceneContent,
  state
}: PlayedScene): SingleASTNode[] => [
  ...sceneContent,
  {
    type: 'link',
    target: '/start',
    content: [{ type: 'text', content: 'Start' }]
  }
]

const Renderer: (
  handler: Handler
) => (scenes: PlayedScene[]) => React.ReactElement = (handler) =>
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
                onClick={handler.handleStartClick}>
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
