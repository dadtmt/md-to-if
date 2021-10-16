import { SingleASTNode } from 'simple-markdown'

const nodeWitListContent =
  (type: string) =>
  (content: SingleASTNode[]): SingleASTNode => ({
    type,
    content
  })

export default nodeWitListContent
