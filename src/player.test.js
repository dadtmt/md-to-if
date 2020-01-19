import parser from './parser'
import player, {
  gotoScene,
  getTarget,
  matchTarget,
  parseDynamicContentWithState,
  getDynamicContentAndState,
} from './player'
import adventure from './adventure.md.js'
import book from './book'

const adventureBook = book(parser(adventure))
const startMove = {
  type: 'start',
}
const moveToCantina = {
  type: 'anchor',
  target: '/cantina',
}
const moveToSpaceShip = {
  type: 'anchor',
  target: '/the_space_ship',
}

describe('player', () => {
  it('play book introduction if no actions', () => {
    expect(player(adventureBook)).toMatchSnapshot()
  })
  it('play first scene on start move and add state.played with first_scene: 1', () => {
    const moves = [startMove]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
  it('play cantina scene on cantina target', () => {
    const moves = [startMove, moveToCantina]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
  it('increment cantina scene played on second cantina move', () => {
    const moves = [startMove, moveToCantina, moveToCantina]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
  it('increment the spaceship scene played spaceship move', () => {
    const moves = [startMove, moveToCantina, moveToCantina, moveToSpaceShip]
    expect(player(adventureBook, moves)).toMatchSnapshot()
  })
})

describe('gotoScene', () => {
  it('goto scene', () => {
    expect(gotoScene(moveToCantina, [])(adventureBook)).toMatchSnapshot()
  })
})

describe('matchTarget', () => {
  it('move to cantina match cantina scene', () => {
    const cantinaScene = adventureBook[2]
    expect(matchTarget(moveToCantina)(cantinaScene)).toBe(true)
  })
  it('move to cantina does not match spaceship scene', () => {
    const spaceShipScene = adventureBook[1]
    expect(matchTarget(moveToCantina)(spaceShipScene)).toBe(false)
  })
  it('move to spaceship match spaceship scene', () => {
    const spaceShipScene = adventureBook[1]
    expect(matchTarget(moveToSpaceShip)(spaceShipScene)).toBe(true)
  })
})

describe('getTarget', () => {
  it('get move target', () => {
    expect(getTarget(moveToCantina)).toBe('cantina')
  })
})

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

  it('returns [empty text node, state] for instruction show playedCount', () => {
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

  it('returns [empty text content node, state with property setted] for instruction show playedCount', () => {
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
})
