import R from 'ramda'
import { SingleASTNode } from 'simple-markdown'
import parseCommandContent from '../commands'
import { State } from '../moves'
import parseCaseContent from './caseContent'
import mergeContent from './mergeContent'

type ContentAndState = [SingleASTNode, State]

export type ConditionalFunction<T> = (arg: T) => boolean

type TestContent = ConditionalFunction<SingleASTNode>

export type ComputeContentAndState = (content: SingleASTNode) => ContentAndState

export type TestAndComputeContentAndState = [
  TestContent,
  ComputeContentAndState
]

const parseArrayContent = (
  [content, state]: ContentAndState,
  parsedContentAndState: ContentAndState = [{ type: '', content: [] }, state]
): ContentAndState => {
  const [headChildContent, ...restOfChildContent] = content.content

  if (headChildContent !== undefined) {
    const [parsedContent, parsedState] = parsedContentAndState
    const [parsedHeadChildContent, newParsedState] =
      parseContent(parsedState)(headChildContent)

    return parseArrayContent(
      [{ ...content, content: restOfChildContent }, newParsedState],
      [
        {
          ...content,
          content: mergeContent(parsedContent.content)(parsedHeadChildContent)
        },
        newParsedState
      ]
    )
  }

  return parsedContentAndState
}

const appendState =
  (state: State): ComputeContentAndState =>
  (content) =>
    [content, state]

const appendStateByDefault = (state: State): TestAndComputeContentAndState => [
  R.T,
  appendState(state)
]

const parseContent = (state: State): ComputeContentAndState =>
  R.pipe(
    R.cond([
      parseCommandContent(state),
      ...parseCaseContent(state),
      appendStateByDefault(state)
    ]),
    R.when(R.pipe(R.head, R.propIs(Array, 'content')), parseArrayContent)
  )

export default parseContent
