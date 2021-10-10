import { SingleASTNode } from 'simple-markdown'
import { BlockQuoteNode } from '..'

const blockquoteNode = (content: SingleASTNode[]): BlockQuoteNode => ({
  type: 'blockQuote',
  content: [
    {
      type: 'paragraph',
      content
    }
  ]
})

export default blockquoteNode
