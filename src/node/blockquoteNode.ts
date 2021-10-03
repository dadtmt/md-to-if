import { SingleASTNode } from 'simple-markdown'

const blockquoteNode = (content: SingleASTNode[]): SingleASTNode => ({
  type: 'blockQuote',
  content: [
    {
      type: 'paragraph',
      content
    }
  ]
})

export default blockquoteNode
