import { State } from '../moves'
import { commandNode, emptyTextNode, textNode } from '../node'
import { applyCommand, errorNode } from './helpers'
import testCommand from './testCommand'

jest.mock('../expressions/rollDices')

describe('apply testCommand', () => {
  it('returns [empty text node content, state with testResult: true] for instruction test playedCount equals 1 true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' test playedCount equals val 1 ')])
    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName
    }

    const expected = [emptyTextNode, { ...state, testResult: true }]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })

  it('returns [error not valid operator node content, unmodified state] for instruction test playedCount maybe 1 true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' test playedCount maybe val 1 ')])

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName
    }

    const expected = [errorNode('Operator maybe is not valid', content), state]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })

  it('returns [error operator supports only number node content, unmodified state] for instruction test playedCount lte string true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' test playedCount lte val string ')])

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName
    }

    const expected = [
      errorNode('right operand of the test must be a number', content),
      state
    ]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })

  it('returns [empty text node content, state with testResult: false] for instruction test playedCount equals 2 false ', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' test playedCount equals val 2 ')])
    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName
    }

    const expected = [emptyTextNode, { ...state, testResult: false }]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })

  it('returns [empty text node content, state with testResult: true] for instruction test roll d100 lte val droid CT ', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' test roll d100 lte val droid CT ')])
    const state: State = {
      played: {
        currentSceneName: 1
      },
      currentSceneName,
      store: {
        droid: {
          CT: 45
        }
      }
    }

    const expected = [emptyTextNode, { ...state, testResult: true }]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })

  it('returns [empty text node content, state with testResult: true] for instruction test roll d100 lte val droid CT ', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode('  test droidShot equals val true ')])
    const state: State = {
      played: {
        currentSceneName: 1
      },
      currentSceneName,
      store: {
        droidShot: true
      }
    }

    const expected = [emptyTextNode, { ...state, testResult: true }]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })

  it('returns [empty text node content, state with testResult: false] for instruction test roll d100 lte val droid CC ', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' test roll d100 lte val droid CC ')])
    const state: State = {
      played: {
        currentSceneName: 1
      },
      currentSceneName,
      store: {
        droid: {
          CC: 30
        }
      }
    }

    const expected = [emptyTextNode, { ...state, testResult: false }]

    expect(applyCommand(state, [testCommand])(content)).toEqual(expected)
  })
})
