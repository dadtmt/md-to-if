import parser from './parser'
import book from './book'
import player from './player'
import { SingleASTNode } from 'simple-markdown'

export interface Scene {
  name: string
  sceneContent: SingleASTNode[]
}

export interface BookScene extends Scene {
  menu: {
    actions: ActionScene[]
    quoteMenu?: SingleASTNode
  }
}

export interface ActionScene extends BookScene {
  actionLabel: string
}

exports.book = book
exports.parser = parser
exports.player = player
