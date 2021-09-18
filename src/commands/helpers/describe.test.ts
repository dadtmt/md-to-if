import getDescription from './getDescription'

jest.mock('../../expressions/rollDices')

describe('getDescription', () => {
  it('returns object description from the table', () => {
    const data = [
      {
        type: 'table',
        header: [
          [{ type: 'text', content: 'prop1' }],
          [{ type: 'text', content: 'prop2' }]
        ],
        cells: [
          [
            [{ type: 'text', content: 'val1' }],
            [{ type: 'text', content: 'val2' }]
          ]
        ]
      }
    ]
    const expected = {
      _tag: 'Right',
      right: {
        prop1: 'val1',
        prop2: 'val2'
      }
    }
    expect(getDescription({})(data)).toEqual(expected)
  })
  it('handles expressions', () => {
    const data = [
      {
        type: 'table',
        header: [
          [{ type: 'text', content: 'prop1' }],
          [{ type: 'text', content: 'prop2' }],
          [{ type: 'text', content: 'numberProp' }]
        ],
        cells: [
          [
            [{ type: 'text', content: 'val1' }],
            [{ type: 'text', content: 'roll D6' }],
            [{ type: 'text', content: '12' }]
          ]
        ]
      }
    ]

    const expected = {
      _tag: 'Right',
      right: {
        numberProp: 12,
        prop1: 'val1',
        prop2: 42
      }
    }

    expect(getDescription({})(data)).toEqual(expected)
  })

  it('returns error message of the first wrong expression', () => {
    const data = [
      {
        type: 'table',
        header: [
          [{ type: 'text', content: 'prop1' }],
          [{ type: 'text', content: 'prop2' }],
          [{ type: 'text', content: 'numberProp' }]
        ],
        cells: [
          [
            [{ type: 'text', content: 'val1' }],
            [{ type: 'text', content: 'roll' }],
            [{ type: 'text', content: '12' }]
          ]
        ]
      }
    ]
    const expected = {
      _tag: 'Left',
      left: 'The dices are missing (ex: roll d6)'
    }
    expect(getDescription({})(data)).toEqual(expected)
  })
})
