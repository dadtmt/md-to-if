import './test/types.d'
import parser from './parser'
import book from './book'
import type { BookScene } from '.'

const someMd = `# Story

a story

## The first scene

first scene content

## Scene with actions

sceen with actions

> the scene menu quote

### Action 1

action 1 content

#### Action 1 1

action 1 1 content

### Action 2

action 2 content
`

describe('book', () => {
  const someBook = book(parser(someMd))
  const [startScene, firstcene, sceneWithActions] = someBook
  const { actions, quoteMenu } = sceneWithActions

  it('splits the start scene', () => {
    const expected: BookScene = {
      name: 'story',
      actions: [],
      sceneContent: [
        {
          type: 'heading',
          level: 1,
          content: [{ type: 'text', content: 'Story' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', content: 'a story' }]
        }
      ]
    }
    expect(startScene).toEqual(expected)
  })
  it('splits the first scene', () => {
    const expected: BookScene = {
      name: 'the_first_scene',
      actions: [],
      sceneContent: [
        {
          type: 'heading',
          level: 2,
          content: [{ type: 'text', content: 'The first scene' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', content: 'first scene content' }]
        }
      ]
    }
    expect(firstcene).toEqual(expected)
  })
  it('splits actions into action scenes', () => {
    expect(actions[0].actions[0].actions).toHaveLength(0)
    expect(actions[1].actions).toHaveLength(0)
    expect(actions[0].name).toBe('action_1')
    expect(actions[1].name).toBe('action_2')
    expect(actions[0].actions[0].name).toBe('action_1_1')
  })

  const [action1, action2] = actions
  const {
    actionLabel: action1Label,
    actions: action1Actions,
    name: action1Name
  } = action1

  const {
    actionLabel: action2Label,
    actions: action2Actions,
    name: action2Name
  } = action2

  const [action11] = action1Actions

  const {
    actionLabel: action11Label,
    actions: action11Actions,
    name: action11Name
  } = action11

  it('the scene has 2 actions', () => {
    expect(actions).toHaveLength(2)
  })

  it('the first action has action 1 label and one child action', () => {
    expect(action1Label).toBe('Action 1')
    expect(action1Actions).toHaveLength(1)
    expect(action1Name).toBe('action_1')
  })

  it('the second action has action 2 label and no child action', () => {
    expect(action2Label).toBe('Action 2')
    expect(action2Actions).toHaveLength(0)
    expect(action2Name).toBe('action_2')
  })

  it('the first child action of action 1 has a action 1_1 label and no child action', () => {
    expect(action11Label).toBe('Action 1 1')
    expect(action11Actions).toHaveLength(0)
    expect(action11Name).toBe('action_1_1')
  })

  it('split the blockquote into the scene menu quote', () => {
    expect(quoteMenu).toBeDefined()
  })
})
