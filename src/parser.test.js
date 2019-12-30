import parser from './parser'
import adventure from './adventure.md.js'

describe('parser', () => {
  it('parse markdown', () => {
    expect(parser(adventure)).toMatchSnapshot()
  })
})
