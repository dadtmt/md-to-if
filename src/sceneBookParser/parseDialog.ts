import * as R from 'ramda'
import { SingleASTNode } from 'simple-markdown'
import { ActionScene, Dialog } from '..'
import { blockQuoteNode } from '../node'
import defaultDialog from './defaultDialog'

const parseDialog = (
  content: SingleASTNode[],
  actions: ActionScene[]
): [SingleASTNode[], Dialog] => {
  const [contentBeforeQuote, contentWithQuote] = R.splitWhen(
    R.propEq('type', 'blockQuote')
  )(content)
  if (contentWithQuote.length > 0) {
    const [blockQuote] = contentWithQuote
    const {
      content: [quoteParagraph]
    } = blockQuote
    const { content: quoteContent } = quoteParagraph
    const [contentBeforeOption, mainMenuOption] = R.splitWhen(
      R.propEq('content', '*')
    )(quoteContent as SingleASTNode[])
    return [
      contentBeforeQuote,
      {
        actions,
        isMain: mainMenuOption.length > 0,
        quote: blockQuoteNode(contentBeforeOption),
        isDefault: false
      }
    ]
  }
  return [contentBeforeQuote, defaultDialog(actions)]
}

export default parseDialog
