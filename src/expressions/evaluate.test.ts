import { State } from '../moves'

import resolve from './resolve'

jest.mock('./rollDices')

describe('parse expression eval', () => {
  it('return the test result', () => {
    const expression = 'eval roll d100 lte val droid CT'.split(' ')
    const state: State = { store: { droid: { CT: 45 } } }
    expect(resolve(state)(expression)).toBe(true)
  })
})
