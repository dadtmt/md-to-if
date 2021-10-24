import { State } from '..'
import { ActionScene, Dialog } from '../..'
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
  const someContent = [textNode('some content')]

  it('add a dialog node with a parsed quote', () => {
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
    const state: State = {
      played: {
        currentSceneName: 1
      },
      currentSceneName: 'some scene',
      store: {
        droid: {
          CT: 45
        }
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
  it('filters the actions with a false eval', () => {
    const pickable = [textNode(' true equals val true')]
    const notPickable = [textNode(' true equals val false')]

    const pickableActionScene: ActionScene = {
      pickable,
      label: 'pickableActionScene',
      path: '/pickableActionScene',
      dialog: undefined,
      name: 'pickableActionScene',
      sceneContent: []
    }

    const notPickableActionScene: ActionScene = {
      pickable: notPickable,
      label: 'notPickableActionScene',
      path: '/notPickableActionScene',
      dialog: undefined,
      name: 'notPickableActionScene',
      sceneContent: []
    }

    const pickableActionSceneByDefault: ActionScene = {
      pickable: [],
      label: 'pickableActionSceneByDefault',
      path: '/pickableActionSceneByDefault',
      dialog: undefined,
      name: 'pickableActionSceneByDefault',
      sceneContent: []
    }

    const dialogWithAnotPickableAction = {
      isMain: false,
      actions: [
        pickableActionScene,
        notPickableActionScene,
        pickableActionSceneByDefault
      ],
      quote: blockQuoteNode([textNode('a quote')]),
      isDefault: false
    }

    const expected = [
      [
        ...someContent,
        dialogNode({
          ...dialogWithAnotPickableAction,
          actions: [pickableActionScene, pickableActionSceneByDefault]
        })
      ],
      {}
    ]

    expect(
      addDialogNode(dialogWithAnotPickableAction, someContent, {})
    ).toEqual(expected)
  })
})
