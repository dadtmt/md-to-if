import './test/types.d'
import parser, { matchBracketPipe, matchPipeBracket } from './parser'
import { ASTNode } from 'simple-markdown'

const { adventureGlobals } = global
const { adventureMd } = adventureGlobals

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
  it('parses {} into command node', () => {
    const someCommandMd = `some content { some command } other content`
    const expected: ASTNode = {
      type: 'command',
      content: [
        {
          type: 'text',
          content: ' some command '
        }
      ]
    }
    const [mainContent] = parser(someCommandMd)
    const { content } = mainContent
    const secondNode = content[1]
    expect(secondNode).toEqual(expected)
  })
  it('parse markdown', () => {
    expect(parser(adventureMd)).toMatchSnapshot()
  })
})
