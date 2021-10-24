import R from 'ramda'
import { SingleASTNode } from 'simple-markdown'

const parsePickable = (
  content: SingleASTNode[]
): [SingleASTNode[], SingleASTNode[]] => {
  const [contentBeforePickable, contentWithPickable] = R.splitWhen(
    R.propEq('type', 'pickable')
  )(content)
  if (contentWithPickable.length > 0) {
    const [pickableNode, ...restOfContent] = contentWithPickable
    const { content: pickableContent } = pickableNode
    return [[...contentBeforePickable, ...restOfContent], pickableContent]
  }
  return [content, []]
}

export default parsePickable
