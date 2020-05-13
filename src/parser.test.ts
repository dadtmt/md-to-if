import parser, {
  matchBraces,
  matchBracketPipe,
  matchPipeBracket,
} from './parser'
import adventure from './adventure.md'

describe('matchBraces', () => {
  it('match braces', () => {
    const source = `{ show value } after
bla
bla
bla later some {show other} bla`
    expect(matchBraces(source)).toMatchSnapshot()
  })
})

describe('matchBracketPipe', () => {
  it('match bracket and a pipe', () => {
    const source = '[ condition true | condition false ] }'

    expect(matchBracketPipe(source)).toMatchSnapshot()
  })
})

describe('matchPipeBracket', () => {
  it('match bracket and a pipe', () => {
    const source = '| condition false ] }'

    expect(matchPipeBracket(source)).toMatchSnapshot()
  })
})

describe('parser', () => {
  it('parse markdown', () => {
    expect(parser(adventure)).toMatchSnapshot()
  })
})
