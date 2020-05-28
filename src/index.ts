import parser from './parser'
import book from './book'
import player from './player'
import { SingleASTNode } from 'simple-markdown'

export type Scene = {
  name: string
  sceneContent: SingleASTNode[]
  actions?: Scene[]
}

exports.book = book
exports.parser = parser
exports.player = player
