import getDescription from './describe'

describe('getDescription', () => {
  it('returns object description from the table', () => {
    const data = [
      {
        type: 'table',
        header: [
          [{ type: 'text', content: 'prop1' }],
          [{ type: 'text', content: 'prop2' }],
        ],
        cells: [
          [
            [{ type: 'text', content: 'val1' }],
            [{ type: 'text', content: 'val2' }],
          ],
        ],
      },
    ]

    const expected = { prop1: 'val1', prop2: 'val2' }
    expect(getDescription(data)).toEqual(expected)
  })
})
