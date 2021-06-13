import * as R from 'ramda'
import { State } from '../moves'
import { TestAndComputeContentAndState, ComputeContentAndState } from '.'

const getTestResult: (state: State, match: boolean) => ComputeContentAndState =
  (state, match) => (content) => {
    const { testResult } = state
    return testResult === match
      ? [content, R.dissoc('testResult', state)]
      : [
          {
            ...content,
            content: [
              {
                content: '',
                type: 'text'
              }
            ]
          },
          state
        ]
  }

// State, Boolean -> Content -> [Content, State]
const getCaseContent: (state: State, match: boolean) => ComputeContentAndState =
  (state, match) => {
    return R.pipe(R.assoc('contentToMerge', true), getTestResult(state, match))
  }

const parseCaseContent: (state: State) => TestAndComputeContentAndState[] = (
  state
) => [
  [R.propEq('type', 'trueCaseContent'), getCaseContent(state, true)],
  [R.propEq('type', 'falseCaseContent'), getCaseContent(state, false)]
]

export default parseCaseContent
