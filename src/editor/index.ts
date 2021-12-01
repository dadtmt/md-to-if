import { Descendant } from 'slate'

export interface EditScene {
  type: 'scene'
  name: string
  path: string
  dialog?: {
    actions: EditScene[]
  }
  children: Descendant[]
}
