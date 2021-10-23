import { commandNode, emptyTextNode, textNode } from '../node'
import { applyCommand, errorNode } from './helpers'
import set from './set'

jest.mock('../expressions/rollDices')

describe('applyCommand set', () => {
  it('returns [empty text content node, state with property setted] for instruction set', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode('set container prop val value')])

    const state = {
      played: {
        currentSceneName: 3
      },
      currentSceneName
    }

    const expected = [
      emptyTextNode,
      {
        played: {
          currentSceneName: 3
        },
        currentSceneName,
        store: { container: { prop: 'value' } }
      }
    ]

    expect(applyCommand(state, [set])(content)).toEqual(expected)
  })
  it('returns [error node content with missing path message, unmodified state]', () => {
    const content = commandNode([textNode('set val 2')])
    const state = { currentSceneName: 'current scene' }
    const expected = [
      errorNode('path is required to set a value -- path val value', content),
      state
    ]

    expect(applyCommand(state, [set])(content)).toEqual(expected)
  })
  it('returns [error node content with expression error message, unmodified state]', () => {
    const content = commandNode([textNode('set path val error')])
    const state = { currentSceneName: 'current scene' }
    const expected = [errorNode('Error parsing an expression', content), state]

    expect(applyCommand(state, [set])(content)).toEqual(expected)
  })
  it('returns [empty text node, state with test result]', () => {
    const content = commandNode([
      textNode('set droidShot val eval roll d100 lte val droid CT')
    ])
    const state = { store: { droid: { CT: 45 } } }
    const expected = [
      emptyTextNode,
      { store: { ...state.store, droidShot: true } }
    ]

    expect(applyCommand(state, [set])(content)).toEqual(expected)
  })
})
