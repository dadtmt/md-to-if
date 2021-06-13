import { resolveExpression } from '../commands'

describe('parseExpression', () => {
  it('returns value between 1 and 6 for ["roll", "D6"]', () => {
    const expression = ['roll', 'd6']
    const state = {}
    const rolled = resolveExpression(state)(expression)
    expect(rolled).toBeGreaterThanOrEqual(1)
    expect(rolled).toBeLessThanOrEqual(6)
  })
  it('returns error missing dices for ["roll"]', () => {
    const expression = ['roll']
    const state = {}
    const rolled = resolveExpression(state)(expression)
    expect(rolled).toEqual('The dices are missing (ex: roll d6)')
  })
  it('returns error D6 is not a valid dices input, try d6 for ["roll", "D6"]', () => {
    const expression = ['roll', 'D6']
    const state = {}
    const rolled = resolveExpression(state)(expression)
    expect(rolled).toEqual('D6 is not a valid dices input, try d6')
  })
  it('returns current scene played count for ["playedCount"]', () => {
    const expression = ['playedCount']
    const state = {
      currentSceneName: 'currentSceneName',
      played: {
        currentSceneName: 5
      }
    }

    expect(resolveExpression(state)(expression)).toEqual(5)
  })
  it('returns value for ["path","to","the"]', () => {
    const expression = ['path', 'to', 'the']
    const state = {
      path: { to: { the: 'value' } }
    }
    expect(resolveExpression(state)(expression)).toEqual('value')
  })
  it('returns error not a single value for ["path","to","the"]', () => {
    const expression = ['path', 'to', 'the']
    const state = {
      path: { to: { the: { some: 'value' } } }
    }
    expect(resolveExpression(state)(expression)).toEqual(
      'The path path/to/the is not a single value'
    )
  })
  it('returns "not" for ["not" "handled" "expression"]', () => {
    const expression = ['not', 'handled', 'expression']
    const state = {}
    const expected = 'not'
    expect(resolveExpression(state)(expression)).toEqual(expected)
  })
  it('returns number 55 for ["55"]', () => {
    const expression = ['55']
    const state = {}
    const expected = 55
    expect(resolveExpression(state)(expression)).toEqual(expected)
  })
})
