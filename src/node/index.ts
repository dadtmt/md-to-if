import caseContentNode from './caseContentNode'
import dialogNode from './dialogNode'
import textNode from './textNode'
import { SingleASTNode } from 'simple-markdown'
import blockQuoteNode from './blockQuoteNode'
import tableNode from './tableNode'

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
const pickableNode = nodeWithListContent('pickable')

export {
  blockQuoteNode,
  caseContentNode,
  commandNode,
  dialogNode,
  emptyTextNode,
  newLineNode,
  paragraphNode,
  pickableNode,
  tableNode,
  textNode
}
