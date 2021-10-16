import blockQuoteNode from './blockQuoteNode'
import caseContentNode from './caseContentNode'
import dialogNode from './dialogNode'
import textNode from './textNode'
import nodeWithListContent from './nodeWithListContent'

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
