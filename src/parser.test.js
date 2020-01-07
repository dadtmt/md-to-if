import parser, { matchBraces } from './parser'
import adventure from './adventure.md.js'

describe('matchBraces', () => {
  it('match braces', () => {
    const source = `{ show value } after
bla
bla
bla later some {show other} bla`
    expect(matchBraces(source)).toMatchSnapshot()
  })
})

describe('parser', () => {
  it('parse markdown', () => {
    expect(parser(adventure)).toMatchSnapshot()
  })
})
