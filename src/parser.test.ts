import parser from './parser'
import {
  blockQuoteNode,
  caseContentNode,
  commandNode,
  newLineNode,
  paragraphNode,
  textNode
} from './node'

describe('parser', () => {
  it('parses {} into command node', () => {
    const someCommandMd = `some content { some command } other content`
    const expected = commandNode([textNode(' some command ')])
    const [mainContent] = parser(someCommandMd)
    const { content } = mainContent
    const secondNode = content[1]
    expect(secondNode).toEqual(expected)
  })
  it('parses [ content if true || content if false] into trueCaseContent and falseCaseContent nodes', () => {
    const trueFalseContentMd = `some content [ true content || false content ] some content`
    const expected = [
      textNode('some content '),
      caseContentNode([textNode(' true content ')], true),
      caseContentNode([textNode(' false content ')], false),
      textNode(' some content')
    ]
    const [mainContent] = parser(trueFalseContentMd)
    const { content } = mainContent
    expect(content).toEqual(expected)
  })
  it('parses a test command and according cases', () => {
    const contentMd = `{ test roll d100 lte val droid F }[ you are shot || You luckyly escape ]`
    const expected = [
      commandNode([textNode(' test roll d100 lte val droid F ')]),
      caseContentNode([textNode(' you are shot ')], true),
      caseContentNode([textNode(' You luckyly escape ')], false),
      newLineNode
    ]
    expect(parser(contentMd)).toEqual(expected)
  })
  it('parses a test command and according cases in a blockquote', () => {
    const contentMd = `> { test roll d100 lte val droid F }[ you are shot || You luckyly escape ]`
    const expected = [
      blockQuoteNode([
        commandNode([textNode(' test roll d100 lte val droid F ')]),
        caseContentNode([textNode(' you are shot ')], true),
        caseContentNode([textNode(' You luckyly escape ')], false),
        newLineNode
      ])
    ]
    expect(parser(contentMd)).toEqual(expected)
  })
  it('parses a test command and according cases in a blockquote with main option', () => {
    const contentMd = `> { test roll d100 lte val droid F }[ you are shot || You luckyly escape ]
> *
`
    const expected = [
      blockQuoteNode([
        commandNode([textNode(' test roll d100 lte val droid F ')]),
        caseContentNode([textNode(' you are shot ')], true),
        caseContentNode([textNode(' You luckyly escape ')], false),
        newLineNode,
        paragraphNode([textNode('*')])
      ])
    ]
    expect(parser(contentMd)).toEqual(expected)
  })
  it('parses a dialog quote text in a blockquote with main option', () => {
    const aquote = `a quote
`
    const contentMd = `> ${aquote}> *
`
    const expected = [
      blockQuoteNode([paragraphNode([textNode(aquote), textNode('*')])])
    ]
    expect(parser(contentMd)).toEqual(expected)
  })
})
