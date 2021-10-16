import blockQuoteNode from './blockQuoteNode'
import caseContentNode from './caseContentNode'
import dialogNode from './dialogNode'
import textNode from './textNode'
import nodeWithListContent from './nodeWithListContent'

const emptyTextNode = textNode('')

const commandNode = nodeWithListContent('command')
const paragraphNode = nodeWithListContent('paragraph')

export {
  blockQuoteNode,
  caseContentNode,
  commandNode,
  dialogNode,
  emptyTextNode,
  paragraphNode,
  textNode
}
