import parser from './parser'
import { ASTNode } from 'simple-markdown'

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
  it('parses [ content if true | content if false] into trueCaseContent and falseCaseContent nodes', () => {
    const trueFalseContentMd = `some content [ true content || false content ] some content`
    const expected: [ASTNode, ASTNode] = [
      {
        type: 'trueCaseContent',
        content: [
          {
            type: 'text',
            content: ' true content '
          }
        ]
      },
      {
        type: 'falseCaseContent',
        content: [
          {
            type: 'text',
            content: ' false content '
          }
        ]
      }
    ]
    const [mainContent] = parser(trueFalseContentMd)
    const { content } = mainContent
    const trueContentNode = content[1]
    const falseContentNode = content[2]
    expect([trueContentNode, falseContentNode]).toEqual(expected)
  })
})
