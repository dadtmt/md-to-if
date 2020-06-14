import { getCommand, applyCommand } from '.'

describe('applyCommand show', () => {
  it('returns [output current scene played count from state, state] for instruction show playedCount', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' show playedCount ',
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
        content: '3',
        type: 'text',
      },
      state,
    ]

    expect(applyCommand(state)(content)).toEqual(expected)
  })

  it('returns [error about missing args, unmodified state] for instruction show ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' show ',
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

    expect(applyCommand(state)(content)).toMatchSnapshot()
  })
})
