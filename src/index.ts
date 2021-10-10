import parser from './parser'
import book from './book'
import player from './player'
import { SingleASTNode } from 'simple-markdown'

export interface Scene {
  name: string
  sceneContent: SingleASTNode[]
}

export interface BlockQuoteNode extends SingleASTNode {
  type: 'blockQuote'
  content: SingleASTNode[]
}

export interface Dialog {
  actions: ActionScene[]
  quote: BlockQuoteNode
  isMain: boolean
  isDefault: boolean
}

export interface BookScene extends Scene {
  dialog: Dialog
}

export interface ActionScene extends BookScene {
  label: string
  path: string
}

exports.book = book
exports.parser = parser
exports.player = player
