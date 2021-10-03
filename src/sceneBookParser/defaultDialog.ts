import { ActionScene, Dialog } from '..'
import { blockquoteNode, textNode } from '../node'

const defaultDialog = (actions?: ActionScene[]): Dialog => ({
  actions: actions ?? [],
  quote: blockquoteNode([textNode('This is the default dialog')]),
  isMain: false,
  isDefault: true
})

export default defaultDialog
