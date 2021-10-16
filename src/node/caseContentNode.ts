import { SingleASTNode } from 'simple-markdown'

const caseContentNode = (
  content: SingleASTNode[],
  isTrue: boolean
): SingleASTNode => ({
  type: isTrue ? 'trueCaseContent' : 'falseCaseContent',
  content
})

export default caseContentNode
