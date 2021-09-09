import { FC, useState } from 'react'
import { BookScene } from '.'
import player, { Move } from './player'
import Renderer, { MoveHandler } from './renderer'

interface ViewerProps {
  book: BookScene[]
}

const Viewer: FC<ViewerProps> = ({ book }) => {
  const [moves, setMoves] = useState<Move[]>([])
  const moveHandler: MoveHandler = (move) => setMoves([...moves, move])
  return Renderer(moveHandler)(player(book, moves))
}

export default Viewer
