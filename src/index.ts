import parser from './parser'
import book from './book'
import player from './player'
import { SingleASTNode } from 'simple-markdown'

export interface Scene {
  name: string
  sceneContent: SingleASTNode[]
}

export interface Dialog {
  actions: ActionScene[]
  quote: SingleASTNode
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
