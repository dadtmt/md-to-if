import { Either, isRight } from 'fp-ts/lib/Either'
import evaluateTest from '.'
import { State } from '../moves'

const resolve = (result: Either<string, boolean>): string | boolean =>
  isRight(result) ? result.right : result.left

describe('evaluateTest', () => {
  it('resolve true equals true to true', () => {
    const trueEqualsTrue = 'true equals val true'.split(' ')

    expect(resolve(evaluateTest(trueEqualsTrue, {}))).toBe(true)
  })
  it('resolve droidShot from store equals true to true', () => {
    const droidShotEqualsTrue = 'droidShot equals val true'.split(' ')
    const state: State = {
      store: { droidShot: true }
    }
    expect(resolve(evaluateTest(droidShotEqualsTrue, state))).toBe(true)
  })
})
