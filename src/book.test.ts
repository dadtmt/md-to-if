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
    const { actions } = sceneWithActions
    expect(actions).toHaveLength(2)
    expect(actions[0].actions).toHaveLength(1)
    expect(actions[0].actionLabel).toBe('Action 1')
    expect(actions[0].actions[0].actions).toHaveLength(0)
    expect(actions[1].actions).toHaveLength(0)
    expect(actions[0].name).toBe('action_1')
    expect(actions[1].name).toBe('action_2')
    expect(actions[0].actions[0].name).toBe('action_1_1')
  })
})
