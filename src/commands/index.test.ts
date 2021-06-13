import { getCommand, applyCommand } from '.'

describe('getCommand', () => {
  it('returns an object with instruction, args and data', () => {
    const dynamicContent = [
      { type: 'text', content: 'instruction arg0 arg1 arg2' },
      { type: 'data', content: 'data0' },
      { type: 'data', content: 'data1' }
    ]

    const expected = {
      instruction: 'instruction',
      args: ['arg0', 'arg1', 'arg2'],
      data: [
        { type: 'data', content: 'data0' },
        { type: 'data', content: 'data1' }
      ]
    }
    expect(getCommand(dynamicContent)).toEqual(expected)
  })
})

describe('applyCommand', () => {
  it('returns [node text with current scene play count, unmodified state] for instruction show playedCount', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' show playedCount ',
          type: 'text'
        }
      ],
      type: 'command'
    }

    const state = {
      played: {
        currentSceneName: 3
      },
      currentSceneName
    }

    const expected = [
      {
        content: '3',
        type: 'text'
      },
      state
    ]

    expect(applyCommand(state)(content)).toEqual(expected)
  })

  it('returns [text content node with value, unmodified state] for instruction show', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' show container prop ',
          type: 'text'
        }
      ],
      type: 'command'
    }

    const state = {
      played: {
        currentSceneName: 3
      },
      currentSceneName,
      container: { prop: 'value' }
    }

    const expected = [
      {
        content: 'value',
        type: 'text'
      },
      {
        played: {
          currentSceneName: 3
        },
        currentSceneName,
        container: { prop: 'value' }
      }
    ]

    expect(applyCommand(state)(content)).toEqual(expected)
  })

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

    expect(applyCommand(state)(content)).toEqual(expected)
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

    expect(applyCommand(state)(content)).toMatchSnapshot()
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

    expect(applyCommand(state)(content)).toMatchSnapshot()
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

    expect(applyCommand(state)(content)).toEqual(expected)
  })

  it('returns [error node content, unmodified state]', () => {
    const content = {
      content: [
        {
          content: ' error ',
          type: 'text'
        }
      ],
      type: 'command'
    }
    const state = { currentSceneName: 'current scene' }

    expect(applyCommand(state)(content)).toMatchSnapshot()
  })
})
