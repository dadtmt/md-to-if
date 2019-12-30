import hello from '.'

describe('hello', () => {
  it('says hello to Jane', () => {
    expect(hello('Jane')('Doe')).toEqual('Hello Jane Doe')
  })
})
