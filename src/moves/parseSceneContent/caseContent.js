import * as R from 'ramda'

const getTestResult = (state, match) => content => {
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

const getCaseContent = (state, match) => {
  return R.pipe(R.assoc('contentToMerge', true), getTestResult(state, match))
}

export default getCaseContent
