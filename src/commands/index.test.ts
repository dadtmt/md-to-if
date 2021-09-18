import { applyCommand, errorNode } from './helpers'

describe('applyCommand default', () => {
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
    const expected = [errorNode('wanted Error', content), state]
    expect(applyCommand(state)(content)).toEqual(expected)
  })
})
