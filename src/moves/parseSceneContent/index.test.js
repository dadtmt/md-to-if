import {
  parseDynamicContentWithState,
  getDynamicContentAndState,
  mergeContent,
  parseInstructions,
} from '.'

describe('parseDynamicContentWithState', () => {
  it('returns [unmodified content, unmodified state] for a not dynamic content', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: 'some text',
      type: 'text',
    }

    const state = {
      played: {
        currentSceneName: 3,
      },
      currentSceneName,
    }

    const expected = [content, state]

    expect(parseDynamicContentWithState(state)(content)).toEqual(expected)
  })

  it('returns [output current scene played count from state, state] for instruction show playedCount', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' show playedCount ',
          type: 'text',
        },
      ],
      type: 'dynamic',
    }

    const state = {
      played: {
        currentSceneName: 3,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: '3',
        type: 'text',
      },
      state,
    ]

    expect(parseDynamicContentWithState(state)(content)).toEqual(expected)
  })
  it('returns [emty text content node, state with property setted] for instruction show playedCount', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' set container prop value',
          type: 'text',
        },
      ],
      type: 'dynamic',
    }

    const state = {
      played: {
        currentSceneName: 3,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: '',
        type: 'text',
      },
      {
        played: {
          currentSceneName: 3,
        },
        currentSceneName,
        container: { prop: 'value' },
      },
    ]

    expect(parseDynamicContentWithState(state)(content)).toEqual(expected)
  })
  it('parsing trueCaseContent returns [true case content to merged, state without testResult] for state testResult true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' true case content ',
          type: 'text',
        },
      ],
      type: 'trueCaseContent',
    }

    const state = {
      played: {
        currentSceneName: 1,
      },
      currentSceneName,
      testResult: true,
    }

    const expected = [
      {
        content: [
          {
            content: ' true case content ',
            type: 'text',
          },
        ],
        type: 'trueCaseContent',
        contentToMerge: true,
      },
      { played: state.played, currentSceneName },
    ]

    expect(parseDynamicContentWithState(state)(content)).toEqual(expected)
  })
  it('parsing trueCaseContent returns [empty node text content to merged, unmodified state] for state testResult false ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' true case content ',
          type: 'text',
        },
      ],
      type: 'trueCaseContent',
    }

    const state = {
      played: {
        currentSceneName: 1,
      },
      currentSceneName,
      testResult: false,
    }

    const expected = [
      {
        content: [
          {
            content: '',
            type: 'text',
          },
        ],
        type: 'trueCaseContent',
        contentToMerge: true,
      },
      state,
    ]

    expect(parseDynamicContentWithState(state)(content)).toEqual(expected)
  })
  it('parsing falseCaseContent returns [false case content to merged, state without testResult] for state testResult false ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' false case content ',
          type: 'text',
        },
      ],
      type: 'falseCaseContent',
    }

    const state = {
      played: {
        currentSceneName: 1,
      },
      currentSceneName,
      testResult: false,
    }

    const expected = [
      {
        content: [
          {
            content: ' false case content ',
            type: 'text',
          },
        ],
        type: 'falseCaseContent',
        contentToMerge: true,
      },
      { played: state.played, currentSceneName },
    ]

    expect(parseDynamicContentWithState(state)(content)).toEqual(expected)
  })
  it('parsing falseCaseContent returns [empty node text content to merged, unmodified state] for state testResult true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' false case content ',
          type: 'text',
        },
      ],
      type: 'falseCaseContent',
    }

    const state = {
      played: {
        currentSceneName: 1,
      },
      currentSceneName,
      testResult: true,
    }

    const expected = [
      {
        content: [
          {
            content: '',
            type: 'text',
          },
        ],
        type: 'falseCaseContent',
        contentToMerge: true,
      },
      state,
    ]

    expect(parseDynamicContentWithState(state)(content)).toEqual(expected)
  })
  it('parsing a paragraph with a failing test returns [paragraph with false content, unmodified state] test true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' Start paragraph ',
          type: 'text',
        },
        {
          content: [
            {
              content: ' test playedCount equals 1 ',
              type: 'text',
            },
          ],
          type: 'dynamic',
        },
        {
          content: ' ',
          type: 'text',
        },
        {
          content: [
            {
              content: 'trueCase',
              type: 'text',
            },
          ],
          type: 'trueCaseContent',
        },
        {
          content: [
            {
              content: 'falseCase',
              type: 'text',
            },
          ],
          type: 'falseCaseContent',
        },
        {
          content: ' ',
          type: 'text',
        },
      ],
      type: 'paragraph',
    }
    const state = {
      played: {
        currentSceneName: 2,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: [
          {
            content: ' Start paragraph ',
            type: 'text',
          },
          {
            content: '',
            type: 'text',
          },
          {
            content: ' ',
            type: 'text',
          },
          {
            content: '',
            type: 'text',
          },
          {
            content: 'falseCase',
            type: 'text',
          },
          {
            content: ' ',
            type: 'text',
          },
        ],
        type: 'paragraph',
      },
      { played: state.played, currentSceneName },
    ]

    expect(parseDynamicContentWithState(state)(content)).toEqual(expected)
  })
  it('parses a list of content', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: 'some text',
          type: 'text',
        },
        {
          content: [
            {
              content: ' show playedCount ',
              type: 'text',
            },
          ],
          type: 'dynamic',
        },
      ],
      type: 'paragraph',
    }

    const state = {
      played: {
        currentSceneName: 3,
      },
      currentSceneName,
    }

    const expectedContent = {
      content: [
        {
          content: 'some text',
          type: 'text',
        },
        {
          content: '3',
          type: 'text',
        },
      ],
      type: 'paragraph',
    }

    const expected = [expectedContent, state]

    expect(parseDynamicContentWithState(state)(content)).toEqual(expected)
  })
})

describe('getDynamicContentAndState', () => {
  it('returns [output current scene played count from state, state] for instruction show playedCount', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' show playedCount ',
          type: 'text',
        },
      ],
      type: 'dynamic',
    }

    const state = {
      played: {
        currentSceneName: 3,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: '3',
        type: 'text',
      },
      state,
    ]

    expect(getDynamicContentAndState(state)(content)).toEqual(expected)
  })

  it('returns [node text with current scene play count, unmodified state] for instruction show playedCount', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' show playedCount ',
          type: 'text',
        },
      ],
      type: 'dynamic',
    }

    const state = {
      played: {
        currentSceneName: 3,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: '3',
        type: 'text',
      },
      state,
    ]

    expect(getDynamicContentAndState(state)(content)).toEqual(expected)
  })

  it('returns [empty text content node, state with property setted] for instruction set', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' set container prop value',
          type: 'text',
        },
      ],
      type: 'dynamic',
    }

    const state = {
      played: {
        currentSceneName: 3,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: '',
        type: 'text',
      },
      {
        played: {
          currentSceneName: 3,
        },
        currentSceneName,
        container: { prop: 'value' },
      },
    ]

    expect(getDynamicContentAndState(state)(content)).toEqual(expected)
  })

  it('returns [text content node with value, unmodified state] for instruction show', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' show container prop ',
          type: 'text',
        },
      ],
      type: 'dynamic',
    }

    const state = {
      played: {
        currentSceneName: 3,
      },
      currentSceneName,
      container: { prop: 'value' },
    }

    const expected = [
      {
        content: 'value',
        type: 'text',
      },
      {
        played: {
          currentSceneName: 3,
        },
        currentSceneName,
        container: { prop: 'value' },
      },
    ]

    expect(getDynamicContentAndState(state)(content)).toEqual(expected)
  })

  it('returns [empty text node content, state with testResult: true] for instruction test playedCount equals 1 true ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' test playedCount equals 1 ',
          type: 'text',
        },
      ],
      type: 'dynamic',
    }

    const state = {
      played: {
        currentSceneName: 1,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: '',
        type: 'text',
      },
      { ...state, testResult: true },
    ]

    expect(getDynamicContentAndState(state)(content)).toEqual(expected)
  })

  it('returns [empty text node content, state with testResult: false] for instruction test playedCount equals 2 false ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' test playedCount equals 2 ',
          type: 'text',
        },
      ],
      type: 'dynamic',
    }

    const state = {
      played: {
        currentSceneName: 1,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: '',
        type: 'text',
      },
      { ...state, testResult: false },
    ]

    expect(getDynamicContentAndState(state)(content)).toEqual(expected)
  })

  it('returns [empty text node content, state with illegal operator text result] for instruction test playedCount some 2 false ', () => {
    const currentSceneName = 'currentSceneName'

    const content = {
      content: [
        {
          content: ' test playedCount some 2 ',
          type: 'text',
        },
      ],
      type: 'dynamic',
    }

    const state = {
      played: {
        currentSceneName: 1,
      },
      currentSceneName,
    }

    const expected = [
      {
        content: '',
        type: 'text',
      },
      { ...state, testResult: 'illegal-operator' },
    ]

    expect(getDynamicContentAndState(state)(content)).toEqual(expected)
  })
})

describe('mergeContent', () => {
  it('append the new content node', () => {
    const parsedContent = [{ content: 'previous content', type: 'text' }]
    const currentContent = { content: 'current content', type: 'text' }
    const expected = [...parsedContent, currentContent]
    expect(mergeContent(parsedContent)(currentContent)).toEqual(expected)
  })
  it('merge child content if contentToMerge is true', () => {
    const parsedContent = [{ content: 'previous content', type: 'text' }]
    const currentContent = {
      content: [
        { content: 'current content', type: 'text' },
        { content: 'second current content', type: 'text' },
      ],
      contentToMerge: true,
    }
    const expected = [
      ...parsedContent,
      { content: 'current content', type: 'text' },
      { content: 'second current content', type: 'text' },
    ]
    expect(mergeContent(parsedContent)(currentContent)).toEqual(expected)
  })
})

describe('parseInstructions', () => {
  it('returns an object with instruction, args and data', () => {
    const dynamicContent = [
      { type: 'text', content: 'instruction arg0 arg1 arg2' },
      { type: 'data', content: 'data0' },
      { type: 'data', content: 'data1' },
    ]

    const expected = {
      instruction: 'instruction',
      args: ['arg0', 'arg1', 'arg2'],
      data: [
        { type: 'data', content: 'data0' },
        { type: 'data', content: 'data1' },
      ],
    }
    expect(parseInstructions(dynamicContent)).toEqual(expected)
  })
})
