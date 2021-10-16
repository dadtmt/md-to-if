import caseContentNode from './caseContentNode'
import dialogNode from './dialogNode'
import textNode from './textNode'
import { SingleASTNode } from 'simple-markdown'
import blockQuoteNode from './blockQuoteNode'

interface NodeWithListContent extends SingleASTNode {
  content: SingleASTNode[]
}

const nodeWithListContent =
  (type: string) =>
  (content: SingleASTNode[]): NodeWithListContent => ({
    type,
    content
  })

const newLineNode = { type: 'newline' }
const emptyTextNode = textNode('')

const commandNode = nodeWithListContent('command')
const paragraphNode = nodeWithListContent('paragraph')

export {
  blockQuoteNode,
  caseContentNode,
  commandNode,
  dialogNode,
  emptyTextNode,
  newLineNode,
  paragraphNode,
  textNode
}
