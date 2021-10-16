import { SingleASTNode } from 'simple-markdown'

interface NodeWithListContent extends SingleASTNode {
  content: SingleASTNode[]
}

const nodeWitListContent =
  (type: string) =>
  (content: SingleASTNode[]): NodeWithListContent => ({
    type,
    content
  })

export default nodeWitListContent
