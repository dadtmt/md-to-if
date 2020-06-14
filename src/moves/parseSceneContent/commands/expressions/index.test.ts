import parseExpression from '.'
import { decodeExpression } from '..'

describe('parseExpression', () => {
  it('returns value between 1 and 6 for ["roll", "D6"]', () => {
    const expression = ['roll', 'd6']
    const state = {}
    const rolled = decodeExpression(parseExpression(state)(expression))
    expect(rolled).toBeGreaterThanOrEqual(1)
    expect(rolled).toBeLessThanOrEqual(6)
  })
  it('returns current scene played count for ["playedCount"]', () => {
    const expression = ['playedCount']
    const state = {
      currentSceneName: 'currentSceneName',
      played: {
        currentSceneName: 5,
      },
    }

    expect(decodeExpression(parseExpression(state)(expression))).toEqual(5)
  })
  it('returns value for ["path","to","the"]', () => {
    const expression = ['path', 'to', 'the']
    const state = {
      path: { to: { the: 'value' } },
    }
    expect(decodeExpression(parseExpression(state)(expression))).toEqual(
      'value'
    )
  })
  it('returns "not" for ["not" "handled" "expression"]', () => {
    const expression = ['not', 'handled', 'expression']
    const state = {}
    const expected = 'not'
    expect(decodeExpression(parseExpression(state)(expression))).toEqual(
      expected
    )
  })
  it('returns number 55 for ["55"]', () => {
    const expression = ['55']
    const state = {}
    const expected = 55
    expect(decodeExpression(parseExpression(state)(expression))).toEqual(
      expected
    )
  })
})
