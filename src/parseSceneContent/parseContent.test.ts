import parseContent from './parseContent'
import {
  caseContentNode,
  commandNode,
  emptyTextNode,
  paragraphNode,
  textNode
} from '../node'

describe('parseContent', () => {
  it('returns [unmodified content, unmodified state] for a not dynamic content', () => {
    const currentSceneName = 'currentSceneName'

    const content = textNode('some text')

    const state = {
      played: {
        currentSceneName: 3
      },
      currentSceneName
    }

    const expected = [content, state]

    expect(parseContent(state)(content)).toEqual(expected)
  })

  it('returns [output current scene played count from state, state] for instruction show playedCount', () => {
    const currentSceneName = 'currentSceneName'

    const content = commandNode([textNode(' show playedCount ')])

    const state = {
      played: {
        currentSceneName: 3
      },
      currentSceneName
    }

    const expected = [textNode('3'), state]

    expect(parseContent(state)(content)).toEqual(expected)
  })

  it('returns [empty text content node, state with property setted] for instruction set prop val value', () => {
    const currentSceneName = 'currentSceneName'
    const content = commandNode([textNode(' set container prop val value')])

    const state = {
      played: {
        currentSceneName: 3
      },
      currentSceneName
    }

    const expected = [
      textNode(''),
      {
        played: {
          currentSceneName: 3
        },
        currentSceneName,
        container: { prop: 'value' }
      }
    ]

    expect(parseContent(state)(content)).toEqual(expected)
  })
  it('parsing trueCaseContent returns [true case content to merged, state without testResult] for state testResult true ', () => {
    const currentSceneName = 'currentSceneName'
    const trueTextNode = textNode(' true case content ')
    const content = caseContentNode([trueTextNode], true)

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName,
      testResult: true
    }

    const expected = [
      {
        ...paragraphNode([trueTextNode]),
        contentToMerge: true
      },
      { played: state.played, currentSceneName }
    ]

    expect(parseContent(state)(content)).toEqual(expected)
  })
  it('parsing trueCaseContent returns [empty node text content to merged, unmodified state] for state testResult false ', () => {
    const currentSceneName = 'currentSceneName'

    const content = caseContentNode([textNode('true case content')], true)

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName,
      testResult: false
    }

    const expected = [
      { ...paragraphNode([emptyTextNode]), contentToMerge: true },
      state
    ]

    expect(parseContent(state)(content)).toEqual(expected)
  })
  it('parsing falseCaseContent returns [false case content to merged, state without testResult] for state testResult false ', () => {
    const currentSceneName = 'currentSceneName'
    const falseTextNode = textNode('false case content')
    const content = caseContentNode([falseTextNode], false)

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName,
      testResult: false
    }

    const expected = [
      { ...paragraphNode([falseTextNode]), contentToMerge: true },
      { played: state.played, currentSceneName }
    ]

    expect(parseContent(state)(content)).toEqual(expected)
  })
  it('parsing falseCaseContent returns [empty node text content to merged, unmodified state] for state testResult true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = caseContentNode([textNode('false case content')], false)

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName,
      testResult: true
    }

    const expected = [
      {
        ...paragraphNode([emptyTextNode]),
        contentToMerge: true
      },
      state
    ]

    expect(parseContent(state)(content)).toEqual(expected)
  })
  it('parsing a paragraph with a succesful test returns [paragraph with true content, unmodified state]', () => {
    const currentSceneName = 'currentSceneName'

    const startParagraphNode = textNode('Start paragraph')
    const someContentNode = textNode('some content')
    const endParagraphNode = textNode('end paragraph')

    const testCommandNode = commandNode([
      textNode(' test playedCount equals val 1 ')
    ])
    const trueCaseTextNode = textNode('true case content')
    const trueCaseNode = caseContentNode([trueCaseTextNode], true)
    const falseCaseTextNode = textNode('false case content')
    const falseCaseNode = caseContentNode([falseCaseTextNode], false)
    const content = paragraphNode([
      startParagraphNode,
      testCommandNode,
      someContentNode,
      trueCaseNode,
      falseCaseNode,
      endParagraphNode
    ])

    const state = {
      played: {
        currentSceneName: 1
      },
      currentSceneName
    }

    const expected = [
      paragraphNode([
        startParagraphNode,
        emptyTextNode,
        someContentNode,
        trueCaseTextNode,
        emptyTextNode,
        endParagraphNode
      ]),
      state
    ]

    expect(parseContent(state)(content)).toEqual(expected)
  })
  it('parsing a paragraph with a failing test returns [paragraph with false content, unmodified state]', () => {
    const currentSceneName = 'currentSceneName'

    const startParagraphNode = textNode('Start paragraph')
    const someContentNode = textNode('some content')
    const endParagraphNode = textNode('end paragraph')

    const testCommandNode = commandNode([
      textNode(' test playedCount equals val 1 ')
    ])
    const trueCaseNode = caseContentNode([textNode('true case content')], true)
    const falseCaseTextNode = textNode('false case content')
    const falseCaseNode = caseContentNode([falseCaseTextNode], false)
    const content = paragraphNode([
      startParagraphNode,
      testCommandNode,
      someContentNode,
      trueCaseNode,
      falseCaseNode,
      endParagraphNode
    ])

    const state = {
      played: {
        currentSceneName: 2
      },
      currentSceneName
    }

    const expected = [
      paragraphNode([
        startParagraphNode,
        emptyTextNode,
        someContentNode,
        emptyTextNode,
        falseCaseTextNode,
        endParagraphNode
      ]),
      state
    ]

    expect(parseContent(state)(content)).toEqual(expected)
  })
  it('parses a list of content', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        textNode('some text'),
        commandNode([textNode('show playedCount')])
      ],
      type: 'paragraph'
    }

    const state = {
      played: {
        currentSceneName: 3
      },
      currentSceneName
    }

    const expectedContent = paragraphNode([
      textNode('some text'),
      textNode('3')
    ])

    const expected = [expectedContent, state]

    expect(parseContent(state)(content)).toEqual(expected)
  })
})
