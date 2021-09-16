import { SingleASTNode } from 'simple-markdown'

const errorNode: (message: string, content: SingleASTNode) => SingleASTNode = (
  message,
  content
) => ({
  type: 'error',
  content: [{ type: 'text', content: message }, content]
})

export default errorNode
