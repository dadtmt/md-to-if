import * as R from 'ramda'
import { SingleASTNode } from 'simple-markdown'
import { ActionScene, BlockQuoteNode, Dialog } from '..'
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
    const { content: quoteContent } = blockQuote as BlockQuoteNode
    const quoteFirstContents = quoteContent.slice(0, -1)
    const quoteLastContent = quoteContent.slice(-1)[0]
    if (quoteLastContent.content?.length !== undefined) {
      const [contentBeforeOption, mainMenuOption] = R.splitWhen(
        R.propEq('content', '*')
      )(quoteLastContent.content as SingleASTNode[])
      return [
        contentBeforeQuote,
        {
          actions,
          isMain: mainMenuOption.length > 0,
          quote: blockQuoteNode([
            ...quoteFirstContents,
            { ...quoteLastContent, content: contentBeforeOption }
          ]),
          isDefault: false
        }
      ]
    } else {
      return [
        contentBeforeQuote,
        {
          actions,
          isMain: false,
          quote: blockQuote as BlockQuoteNode,
          isDefault: false
        }
      ]
    }
  }
  return [contentBeforeQuote, defaultDialog(actions)]
}

export default parseDialog
