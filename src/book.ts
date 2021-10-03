import * as R from 'ramda'
import { BookScene } from '.'
import { SingleASTNode } from 'simple-markdown'
import sceneBookParse from './sceneBookParser'

const book: (source: SingleASTNode[], scenes?: BookScene[]) => BookScene[] = (
  source,
  scenes = []
) => {
  const { scene, sourceLeft } = sceneBookParse(2)(source)
  return R.isEmpty(sourceLeft)
    ? [...scenes, scene]
    : book(sourceLeft, [...scenes, scene])
}

export default book
