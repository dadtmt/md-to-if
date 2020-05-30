import * as R from 'ramda'

import parseCommandContent from './commands'
import parseCaseContent from './caseContent'
import { State } from '..'
import { SingleASTNode } from 'simple-markdown'

type ContentAndState = [SingleASTNode, State]

type ManyContentAndState = [SingleASTNode[], State]

type TestContent = (content: SingleASTNode) => boolean

export type ComputeContentAndState = (content: SingleASTNode) => ContentAndState

export type TestAndComputeContentAndState = [
  TestContent,
  ComputeContentAndState
]

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
  contentAndState: ContentAndState,
  parsedContentAndState?: ContentAndState
) => ContentAndState = (
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
) => ComputeContentAndState = state => content => [content, state]

const appendStateByDefault: (
  state: State
) => TestAndComputeContentAndState = state => [R.T, appendState(state)]

// State | [] -> Content -> [Content, State]
export const parseContent: (state: State) => ComputeContentAndState = state =>
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
  parsedContentAndState?: ManyContentAndState
) => ManyContentAndState = (
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
