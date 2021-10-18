import { Dialog } from '../..'
import {
  blockQuoteNode,
  caseContentNode,
  commandNode,
  dialogNode,
  emptyTextNode,
  newLineNode,
  paragraphNode,
  textNode
} from '../../node'
import addDialogNode from './addDialogNode'
jest.mock('../../expressions/rollDices')

describe('addDialogNode', () => {
  it.only('add a dialog node with a parsed quote', () => {
    const dialogWithTest: Dialog = {
      quote: blockQuoteNode([
        commandNode([textNode(' test roll d100 lte val droid CT ')]),
        caseContentNode([textNode(' you are shot ')], true),
        caseContentNode([textNode(' You luckyly escape ')], false),
        newLineNode
      ]),
      actions: [],
      isMain: false,
      isDefault: false
    }
    const someContent = [textNode('some content')]
    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName: 'some scene',
      droid: {
        CT: 45
      }
    }

    const expected = [
      [
        ...someContent,
        dialogNode({
          ...dialogWithTest,
          quote: blockQuoteNode([
            emptyTextNode,
            {
              ...paragraphNode([textNode(' you are shot ')]),
              contentToMerge: true
            },
            {
              ...paragraphNode([emptyTextNode]),
              contentToMerge: true
            },
            newLineNode
          ])
        })
      ],
      state
    ]
    expect(addDialogNode(dialogWithTest, someContent, state)).toEqual(expected)
  })
})
