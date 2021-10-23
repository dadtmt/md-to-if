import { State } from '../moves'
import { commandNode, textNode } from '../node'
import { applyCommand, errorNode } from './helpers'
import show from './show'

describe('applyCommand show', () => {
  it('returns [text content node with value, unmodified state] for instruction show', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' show container prop ')])

    const state: State = {
      played: {
        currentSceneName: 3
      },
      currentSceneName,
      store: { container: { prop: 'value' } }
    }

    const expected = [textNode('value'), state]

    expect(applyCommand(state, [], [show(state)])(content)).toEqual(expected)
  })
  it('returns [output current scene played count from state, state] for instruction show playedCount', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' show playedCount ')])

    const state: State = {
      played: {
        currentSceneName: 3
      },
      currentSceneName
    }

    const expected = [textNode('3'), state]

    expect(applyCommand(state, [], [show(state)])(content)).toEqual(expected)
  })

  it('returns [error about The path  is not a single value, unmodified state] for instruction show store ', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' show ')])

    const state: State = {
      played: {
        currentSceneName: 3
      },
      currentSceneName,
      store: {}
    }

    const expected = [
      errorNode('The path  is not a single value', content),
      state
    ]

    expect(applyCommand(state, [], [show(state)])(content)).toEqual(expected)
  })
})
