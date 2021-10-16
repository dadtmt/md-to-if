import { SingleASTNode } from 'simple-markdown'
import { BlockQuoteNode } from '..'

const blockQuoteNode = (content: SingleASTNode[]): BlockQuoteNode => ({
  type: 'blockQuote',
  content: [
    {
      type: 'paragraph',
      content
    }
  ]
})

export default blockQuoteNode
