import './test/types.d'
import parser from './parser'
import book from './book'

const someMd = `# Story

a story

## The first scene

first scene content

## Scene with a menu

sceen with actions

> the scene menu quote

### Action 1

action 1 content

> the action 1 menu quote

#### Action 1 1

action 1 1 content

### Action 2

action 2 content
`

describe('book', () => {
  const someBook = book(parser(someMd))
  const [startScene, firstScene, sceneWithActions] = someBook
  const { name: startSceneName } = startScene
  it('splits the start scene', () => {
    expect(startSceneName).toBe('story')
  })
  const { name: firstSceneName } = firstScene
  it('splits the first scene', () => {
    expect(firstSceneName).toBe('the_first_scene')
  })

  const { menu, name: sceneWithActionsName } = sceneWithActions
  const { actions, quoteMenu } = menu

  const [action1, action2] = actions
  const {
    label: action1Label,
    name: action1Name,
    menu: { actions: action1Actions, quoteMenu: action1QuoteMenu },
    path: action1Path
  } = action1

  const {
    label: action2Label,
    name: action2Name,
    menu: { actions: action2Actions, quoteMenu: action2QuoteMenu },
    path: action2Path
  } = action2

  const [action11] = action1Actions

  const {
    label: action11Label,
    name: action11Name,
    menu: { actions: action11Actions },
    path: action11Path
  } = action11

  it('the scene has 2 actions', () => {
    expect(actions).toHaveLength(2)
  })

  it('the first action has action 1 label, one child action and a path', () => {
    expect(action1Label).toBe('Action 1')
    expect(action1Actions).toHaveLength(1)
    expect(action1Name).toBe('action_1')
    expect(action1Path).toBe(`/${sceneWithActionsName}/${action1Name}`)
  })

  it('the second action has action 2 label and no child action', () => {
    expect(action2Label).toBe('Action 2')
    expect(action2Actions).toHaveLength(0)
    expect(action2Name).toBe('action_2')
    expect(action2Path).toBe(`/${sceneWithActionsName}/${action2Name}`)
  })

  it('the first child action of action 1 has a action 1_1 label, no child action and a path', () => {
    expect(action11Label).toBe('Action 1 1')
    expect(action11Actions).toHaveLength(0)
    expect(action11Name).toBe('action_1_1')
    expect(action11Path).toBe(
      `/${sceneWithActionsName}/${action1Name}/${action11Name}`
    )
  })

  it('split the blockquote into the scene menu quote', () => {
    expect(quoteMenu).toBeDefined()
  })

  it('action 2 has no quoteMenu', () => {
    expect(action2QuoteMenu).not.toBeDefined()
  })

  it('action 1 has a quoteMenu', () => {
    expect(action1QuoteMenu).toBeDefined()
  })
})
