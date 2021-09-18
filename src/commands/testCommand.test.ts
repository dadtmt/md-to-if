import { applyCommand, errorNode } from './helpers'
import testCommand from './testCommand'

describe('applyCommand', () => {
  it('returns [empty text node content, state with testResult: true] for instruction test playedCount equals 1 true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' test playedCount equals val 1 ',
          type: 'text'
        }
      ],
      type: 'command'
    }

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName
    }

    const expected = [
      {
        content: '',
        type: 'text'
      },
      { ...state, testResult: true }
    ]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })

  it('returns [error not valid operator node content, unmodified state] for instruction test playedCount maybe 1 true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' test playedCount maybe val 1 ',
          type: 'text'
        }
      ],
      type: 'command'
    }

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName
    }

    const expected = [errorNode('Operator maybe is not valid', content), state]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })

  it('returns [error operator supports only number node content, unmodified state] for instruction test playedCount lte string true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' test playedCount lte val string ',
          type: 'text'
        }
      ],
      type: 'command'
    }

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName
    }

    const expected = [
      errorNode('right operand of the test must be a number', content),
      state
    ]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })

  it('returns [empty text node content, state with testResult: false] for instruction test playedCount equals 2 false ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' test playedCount equals val 2 ',
          type: 'text'
        }
      ],
      type: 'command'
    }

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName
    }

    const expected = [
      {
        content: '',
        type: 'text'
      },
      { ...state, testResult: false }
    ]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })
})
