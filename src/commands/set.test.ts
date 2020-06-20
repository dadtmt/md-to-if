import { getCommand, applyCommand } from '.'

describe('applyCommand set', () => {
  it('returns [empty text content node, state with property setted] for instruction set', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' set container prop val value',
          type: 'text',
        },
      ],
      type: 'command',
    }

    const state = {
      played: {
        currentSceneName: 3,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: '',
        type: 'text',
      },
      {
        played: {
          currentSceneName: 3,
        },
        currentSceneName,
        container: { prop: 'value' },
      },
    ]

    expect(applyCommand(state)(content)).toEqual(expected)
  })
  it('returns [error node content with missing path message, unmodified state]', () => {
    const content = {
      content: [
        {
          content: ' set val 2 ',
          type: 'text',
        },
      ],
      type: 'command',
    }
    const state = { currentSceneName: 'current scene' }

    expect(applyCommand(state)(content)).toMatchSnapshot()
  })
})
