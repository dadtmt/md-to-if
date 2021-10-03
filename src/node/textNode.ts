import { SingleASTNode } from 'simple-markdown'

const textNode = (text: string): SingleASTNode => ({
  type: 'text',
  content: text
})

export default textNode
