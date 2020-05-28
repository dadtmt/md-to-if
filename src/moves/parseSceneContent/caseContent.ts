import * as R from 'ramda'
import { State } from '..'
import { SingleASTNode } from 'simple-markdown'

// State, Boolean -> Content -> [Content, State]
const getTestResult: (
  state: State,
  match: boolean
) => (content: SingleASTNode) => [SingleASTNode, State] = (
  state,
  match
) => content => {
  const { testResult } = state
  return testResult === match
    ? [content, R.dissoc('testResult', state)]
    : [
        {
          ...content,
          content: [
            {
              content: '',
              type: 'text',
            },
          ],
        },
        state,
      ]
}

// State, Boolean -> Content -> [Content, State]
const getCaseContent: (
  state: State,
  match: boolean
) => (content: SingleASTNode) => [SingleASTNode, State] = (state, match) => {
  return R.pipe(R.assoc('contentToMerge', true), getTestResult(state, match))
}

// State -> [[Content -> Boolean, Content -> [Content, State]]]
const parseCaseContent: (
  state: State
) => [
  (content: SingleASTNode) => boolean,
  (content: SingleASTNode) => [SingleASTNode, State]
][] = state => [
  [R.propEq('type', 'trueCaseContent'), getCaseContent(state, true)],
  [R.propEq('type', 'falseCaseContent'), getCaseContent(state, false)],
]

export default parseCaseContent
