import { SingleASTNode } from 'simple-markdown'

const tableNode = (
  header: SingleASTNode[][],
  cells: SingleASTNode[][][]
): SingleASTNode => ({
  type: 'table',
  header,
  cells
})

export default tableNode
