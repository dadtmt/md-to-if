import { State } from '../moves'
import { SingleASTNode } from 'simple-markdown'
import parseContent from './parseContent'

type ManyContentAndState = [SingleASTNode[], State]

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
  if (headContent !== undefined) {
    const [parsedContent, parsedState] = parsedContentAndState
    const [parsedHeadContent, newParsedSate] =
      parseContent(parsedState)(headContent)
    return parseSceneContent(
      { sceneContent: restOfContent, state: parsedState },
      [[...parsedContent, parsedHeadContent], newParsedSate]
    )
  }
  return parsedContentAndState
}

export default parseSceneContent
