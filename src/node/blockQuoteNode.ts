import { SingleASTNode } from 'simple-markdown'
import { BlockQuoteNode } from '..'

const blockQuoteNode = (content: SingleASTNode[]): BlockQuoteNode => ({
  type: 'blockQuote',
  content
})

export default blockQuoteNode
