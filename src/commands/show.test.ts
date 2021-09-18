import { applyCommand, errorNode } from './helpers'
import show from './show'

describe('applyCommand show', () => {
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

    expect(applyCommand(state, [], [show(state)])(content)).toEqual(expected)
  })
  it('returns [output current scene played count from state, state] for instruction show playedCount', () => {
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

    expect(applyCommand(state, [], [show(state)])(content)).toEqual(expected)
  })

  it('returns [error about missing args, unmodified state] for instruction show ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' show ',
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
      errorNode('The path  is not a single value', content),
      state
    ]

    expect(applyCommand(state, [], [show(state)])(content)).toEqual(expected)
  })
})
