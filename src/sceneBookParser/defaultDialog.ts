import { ActionScene, Dialog } from '..'
import { blockQuoteNode, textNode } from '../node'

const defaultDialog = (actions?: ActionScene[]): Dialog => ({
  actions: actions ?? [],
  quote: blockQuoteNode([textNode('This is the default dialog')]),
  isMain: false,
  isDefault: true
})

export default defaultDialog
