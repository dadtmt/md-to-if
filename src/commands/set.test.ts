import { applyCommand, errorNode } from './helpers'
import set from './set'

describe('applyCommand set', () => {
  it('returns [empty text content node, state with property setted] for instruction set', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' set container prop val value',
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
        content: '',
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

    expect(applyCommand(state, [set])(content)).toEqual(expected)
  })
  it('returns [error node content with missing path message, unmodified state]', () => {
    const content = {
      content: [
        {
          content: ' set val 2 ',
          type: 'text'
        }
      ],
      type: 'command'
    }
    const state = { currentSceneName: 'current scene' }
    const expected = [
      errorNode('path is required to set a value -- path val value', content),
      state
    ]

    expect(applyCommand(state, [set])(content)).toEqual(expected)
  })
  it('returns [error node content with expression error message, unmodified state]', () => {
    const content = {
      content: [
        {
          content: ' set a path val error ',
          type: 'text'
        }
      ],
      type: 'command'
    }
    const state = { currentSceneName: 'current scene' }
    const expected = [errorNode('Error parsing an expression', content), state]

    expect(applyCommand(state, [set])(content)).toEqual(expected)
  })
})
