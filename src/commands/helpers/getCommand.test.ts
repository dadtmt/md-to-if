import getCommand from './getCommand'

describe('getCommand', () => {
  it('returns an object with instruction, args and data', () => {
    const dynamicContent = [
      { type: 'text', content: 'instruction arg0 arg1 arg2' },
      { type: 'data', content: 'data0' },
      { type: 'data', content: 'data1' }
    ]

    const expected = {
      instruction: 'instruction',
      args: ['arg0', 'arg1', 'arg2'],
      data: [
        { type: 'data', content: 'data0' },
        { type: 'data', content: 'data1' }
      ]
    }
    expect(getCommand(dynamicContent)).toEqual(expected)
  })
})
