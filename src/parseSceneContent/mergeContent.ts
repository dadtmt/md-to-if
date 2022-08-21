import R from 'ramda'
import { SingleASTNode } from 'simple-markdown'

const appendTo = R.flip(R.append)

const mergeContent = (
  parsedContent: SingleASTNode[]
): ((content: SingleASTNode) => SingleASTNode) =>
  R.ifElse(
    R.propOr(false, 'contentToMerge'),
    // @ts-expect-error
    R.pipe(R.prop('content'), R.concat(parsedContent)),
    // @ts-expect-error
    appendTo(parsedContent)
  )

export default mergeContent
