import { Either, isRight } from 'fp-ts/lib/Either'
import { SingleASTNode } from 'simple-markdown'
import { State } from '..'
import { Dialog } from '../..'
import evaluateTest from '../../evaluateTest'
import { dialogNode, blockQuoteNode } from '../../node'
import parseSceneContent from '../../parseSceneContent'
import { isBool } from '../../typeGuards'

const resolve = (result: Either<string, boolean>): string | boolean =>
  isRight(result) ? result.right : result.left

const pickDialog = (dialog: Dialog, mainDialog?: Dialog): Dialog => {
  const { isDefault } = dialog
  return isDefault && mainDialog !== undefined ? mainDialog : dialog
}

const addMainDialogToState = (dialog: Dialog, state: State): State => {
  const { isMain } = dialog
  return isMain ? { ...state, mainDialog: dialog } : state
}

const addDialogNode = (
  dialog: Dialog,
  sceneContent: SingleASTNode[],
  state: State,
  mainDialog?: Dialog
): [SingleASTNode[], State] => {
  const pickedDialog = pickDialog(dialog, mainDialog)
  const {
    actions,
    isDefault,
    quote: { content: quoteContent }
  } = pickedDialog
  const [parsedQuoteContent, parsedState] = parseSceneContent({
    sceneContent: quoteContent,
    state
  })
  const contentWithNotDefaultDialog = !isDefault
    ? [
        ...sceneContent,
        dialogNode({
          ...pickedDialog,
          quote: blockQuoteNode(parsedQuoteContent),
          actions: actions.filter(({ pickable }) => {
            if (pickable.length === 0) {
              return true
            }
            const [{ content }] = pickable
            const evaluation = resolve(
              evaluateTest(content.trim().split(' '), state)
            )
            return isBool(evaluation) && evaluation
          })
        })
      ]
    : sceneContent

  return [
    contentWithNotDefaultDialog,
    addMainDialogToState(dialog, parsedState)
  ]
}

export default addDialogNode
