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
  parsedContentAndState?: [SingleASTNode, State]
) => [SingleASTNode, State] = (
  [content, state],
  parsedContentAndState = [{ type: '', content: [] }, state]
) => {
  const [headChildContent, ...restOfChildContent] = content.content

  if (headChildContent) {
    const [parsedContent, parsedState] = parsedContentAndState
    const [parsedHeadChildContent, newParsedState] = parseContent(parsedState)(
      headChildContent
    )

    return parseArrayContent(
      [{ ...content, content: restOfChildContent }, newParsedState],
      [
        {
          ...content,
          content: mergeContent(parsedContent.content)(parsedHeadChildContent),
        },
        newParsedState,
      ]
    )
  }

  return parsedContentAndState
}

const appendState: (
  state: State
) => (content: SingleASTNode) => [SingleASTNode, State] = state => content => [
  content,
  state,
]

const appendStateByDefault: (
  state: State
) => [
  (content: SingleASTNode) => boolean,
  (content: SingleASTNode) => [SingleASTNode, State]
] = state => [R.T, appendState(state)]

// State | [] -> Content -> [Content, State]
export const parseContent: (
  state: State
) => (content: SingleASTNode) => [SingleASTNode, State] = state =>
  R.pipe(
    R.cond([
      parseCommandContent(state),
      ...parseCaseContent(state),
      appendStateByDefault(state),
    ]),
    R.when(R.pipe(R.head, R.propIs(Array, 'content')), parseArrayContent)
  )

//  { [Content], State } -> [[Content], State]
const parseSceneContent: (
  contentToParse: {
    sceneContent: SingleASTNode[]
    state: State
  },
  parsedContentAndState?: [SingleASTNode[], State]
) => [SingleASTNode[], State] = (
  { sceneContent, state },
  parsedContentAndState = [[], state]
) => {
  const [headContent, ...restOfContent] = sceneContent
  if (headContent) {
    const [parsedContent, parsedState] = parsedContentAndState
    const [parsedHeadContent, newParsedSate] = parseContent(parsedState)(
      headContent
    )
    return parseSceneContent(
      { sceneContent: restOfContent, state: parsedState },
      [[...parsedContent, parsedHeadContent], newParsedSate]
    )
  }
  return parsedContentAndState
}

export default parseSceneContent
