import R from 'ramda'
import { SingleASTNode } from 'simple-markdown'

const appendTo = R.flip(R.append)

const mergeContent = (
  parsedContent: SingleASTNode[]
): ((content: SingleASTNode) => SingleASTNode) =>
  R.ifElse(
    R.prop('contentToMerge'),
    // @ts-expect-error
    R.pipe(R.prop('content'), R.concat(parsedContent)),
    appendTo(parsedContent)
  )

export default mergeContent
