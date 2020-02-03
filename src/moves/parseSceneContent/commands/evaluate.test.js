import evaluate from './evaluate'

describe('evaluate', () => {
  it('returns current scene played count for ["playedCount"]', () => {
    const expression = ['playedCount']
    const state = {
      currentSceneName: 'currentSceneName',
      played: {
        currentSceneName: 5,
      },
    }
    expect(evaluate(state)(expression)).toEqual('5')
  })
  it('returns value for ["path","to","the"]', () => {
    const expression = ['path', 'to', 'the']
    const state = {
      path: { to: { the: 'value' } },
    }
    expect(evaluate(state)(expression)).toEqual('value')
  })
  it('returns Error in expression : "not handled expression" for ["not" "handled" "expression"]', () => {
    const expression = ['not', 'handled', 'expression']
    const state = {}
    const expected = 'Error in expression : not handled expression'
    expect(evaluate(state)(expression)).toEqual(expected)
  })
})
