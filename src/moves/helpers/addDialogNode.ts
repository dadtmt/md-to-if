import { SingleASTNode } from 'simple-markdown'
import { State } from '..'
import { Dialog } from '../..'
import { dialogNode, blockQuoteNode } from '../../node'
import parseSceneContent from '../../parseSceneContent'

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
          quote: blockQuoteNode(parsedQuoteContent)
        })
      ]
    : sceneContent

  return [
    contentWithNotDefaultDialog,
    addMainDialogToState(dialog, parsedState)
  ]
}

export default addDialogNode
