import R from 'ramda'
import { outputFor, defaultRules, SingleASTNode } from 'simple-markdown'
import { Scene } from '.'

const Renderer: (scenes: Scene[]) => React.ReactElement = R.pipe(
  R.reduce<Scene, SingleASTNode[]>((acc, { sceneContent }) => {
    return [...acc, ...sceneContent]
  }, []),
  outputFor({ ...defaultRules }, 'react')
)

export default Renderer
