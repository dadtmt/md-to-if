import * as R from 'ramda'

import parseCommandContent from './commands'
import parseCaseContent from './caseContent'
import { State } from '..'
import { SingleASTNode } from 'simple-markdown'

// [a] -> a -> [a]
const appendTo = R.flip(R.append)

// [Content] -> Content -> Content
export const mergeContent: (
  parsedContent: SingleASTNode[]
) => (content: SingleASTNode) => SingleASTNode = parsedContent =>
  R.ifElse(
    R.prop('contentToMerge'),
    R.pipe(R.prop('content'), R.concat(parsedContent)),
    appendTo(parsedContent)
  )

// [Content, State] , [Content, State] -> [Content, State]
const parseArrayContent: (
  contentAndState: [SingleASTNode, State],
  parsedContentAndState: [SingleASTNode, State] | []
) => [SingleASTNode, State] = (
  [content, state],
  parsedContentAndState = []
) => {
  const [headChildContent, ...restOfChildContent] = content.content

  if (headChildContent) {
    const [parsedContent, parsedState] =
      parsedContentAndState.length > 0
        ? parsedContentAndState
        : [{ content: [] }, state]
    const [parsedHeadChildContent, newParsedState] = parseContent(parsedState)(
      headChildContent
    )

    const result = [
      {
        ...content,
        content: mergeContent(parsedContent.content)(parsedHeadChildContent),
      },
      newParsedState,
    ]
    return parseArrayContent(
      [{ ...content, content: restOfChildContent }, newParsedState],
      result
    )
  }

  return parsedContentAndState
}

// State | [] -> Content -> [Content, State]
export const parseContent: (
  state: State | []
) => (content: SingleASTNode) => [SingleASTNode, State] = state =>
  R.pipe(
    R.cond([
      parseCommandContent(state),
      ...parseCaseContent(state),
      [R.T, R.pipe(R.of, R.append(state))],
    ]),
    R.when(R.pipe(R.head, R.propIs(Array, 'content')), parseArrayContent)
  )

//  { [Content], State } -> [[Content], State]
const parseSceneContent: (
  contentToParse: {
    sceneContent: SingleASTNode[]
    state: State | [] | undefined
  },
  parsedContentAndState?: [SingleASTNode[], State] | [never[]]
) => [SingleASTNode[], State] = (
  { sceneContent, state },
  parsedContentAndState = [[]]
) => {
  const [headContent, ...restOfContent] = sceneContent
  if (headContent) {
    const [parsedContent, parsedState] = parsedContentAndState
    const stateToParse = parsedState || state
    const [parsedHeadContent, newParsedSate] = parseContent(stateToParse)(
      headContent
    )
    return parseSceneContent(
      { sceneContent: restOfContent, state: stateToParse },
      [[...parsedContent, parsedHeadContent], newParsedSate]
    )
  }
  return parsedContentAndState
}

export default parseSceneContent