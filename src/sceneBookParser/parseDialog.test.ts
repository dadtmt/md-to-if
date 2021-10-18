import { SingleASTNode } from 'simple-markdown'
import { ActionScene, Dialog } from '..'
import parseDialog from './parseDialog'
import {
  blockQuoteNode,
  caseContentNode,
  commandNode,
  newLineNode,
  paragraphNode,
  textNode
} from '../node'
import defaultDialog from './defaultDialog'

describe('parseDialog', () => {
  const someActions: ActionScene[] = [
    {
      name: 'an action',
      label: 'an action',
      sceneContent: [],
      path: 'some path',
      dialog: defaultDialog()
    }
  ]
  const someContent: SingleASTNode[] = [textNode('some'), textNode('content')]

  const quoteText = { type: 'text', content: 'the quote' }

  it('returns a main dialog for a quote with a star and the content without the blockquote', () => {
    const quoteWithStar = blockQuoteNode([
      paragraphNode([quoteText, textNode('*')])
    ])
    const expectedDialog: Dialog = {
      isMain: true,
      actions: someActions,
      quote: blockQuoteNode([paragraphNode([quoteText])]),
      isDefault: false
    }

    const [content, dialog] = parseDialog(
      [...someContent, quoteWithStar],
      someActions
    )
    expect(content).toEqual(someContent)
    expect(dialog).toEqual(expectedDialog)
  })

  it('returns a not main dialog for a quote with no star and the content without the blockquote', () => {
    const expectedDialog: Dialog = {
      isMain: false,
      actions: someActions,
      quote: blockQuoteNode([paragraphNode([quoteText])]),
      isDefault: false
    }

    const [content, dialog] = parseDialog(
      [...someContent, blockQuoteNode([paragraphNode([quoteText])])],
      someActions
    )
    expect(content).toEqual(someContent)
    expect(dialog).toEqual(expectedDialog)
  })

  it('returns a not main dialog for a quote with a command', () => {
    const commandBlockQuote = blockQuoteNode([
      commandNode([textNode(' test roll d100 lte val droid F ')]),
      caseContentNode([textNode(' you are shot ')], true),
      caseContentNode([textNode(' You luckyly escape ')], false),
      newLineNode
    ])

    const expectedDialog: Dialog = {
      isMain: false,
      actions: someActions,
      quote: commandBlockQuote,
      isDefault: false
    }

    const [content, dialog] = parseDialog(
      [...someContent, commandBlockQuote],
      someActions
    )
    expect(content).toEqual(someContent)
    expect(dialog).toEqual(expectedDialog)
  })
})
