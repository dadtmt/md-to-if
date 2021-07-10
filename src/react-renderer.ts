import R from 'ramda'
import { outputFor, defaultRules, SingleASTNode } from 'simple-markdown'
import { PlayedScene } from './player'

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

const Renderer: (scenes: PlayedScene[]) => React.ReactElement = R.pipe(
  R.last,
  addNodeFromState,
  outputFor({ ...defaultRules }, 'react')
)

export default Renderer
