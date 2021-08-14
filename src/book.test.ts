import parser from './parser'
import book, {
  splitByScene,
  getSceneLabel,
  getSceneName,
  splitContentAndActions
} from './book'
import adventure from './adventure.md'

const lastSceneMd = `## Final landing

congrats you made it!!!
    `

const contentWithoutActions = `
    some content
  `
const contentWithActions = `
    some content
    
    ### Action1
    
    this is a level 3 action
    
    #### Action 1 1
    
    this is level 4 action
    
    
    ### Action2
    
    this is a level 3 action
        `

const sceneWithActions = `## Scene with actions ${contentWithActions}`

describe('getSceneLabel', () => {
  it('get scene label', () => {
    const scene = parser(lastSceneMd)
    expect(getSceneLabel(scene[0])).toBe('Final landing')
  })
})

describe('getSceneName', () => {
  it('get scene name', () => {
    const scene = parser(lastSceneMd)
    expect(getSceneName(scene[0])).toBe('final_landing')
  })
  it('get unamed if first element is not heading', () => {
    const scene = parser(`
    
    `)
    expect(getSceneName(scene[0])).toBe('unnamed')
  })
})

describe('splitContentAndActions', () => {
  it('splits content from actions', () => {
    const content = parser(contentWithActions)
    const { actions } = splitContentAndActions(3)(content)
    expect(actions).toHaveLength(2)
    expect(actions[0].actions).toHaveLength(1)
    expect(actions[0].actionLabel).toBe('Action1')
    expect(actions[0].actions[0].actions).toHaveLength(0)
    expect(actions[1].actions).toHaveLength(0)
    expect(actions[0].name).toBe('action1')
    expect(actions[1].name).toBe('action2')
    expect(actions[0].actions[0].name).toBe('action_1_1')
  })

  it('splits scene with emplty actions ', () => {
    const content = parser(contentWithoutActions)
    const { actions } = splitContentAndActions(3)(content)
    expect(actions).toHaveLength(0)
  })
})

describe('splitByScene', () => {
  it('split the first scene', () => {
    expect(splitByScene(2)(parser(adventure))).toMatchSnapshot()
  })
  it('split the last scene', () => {
    expect(splitByScene(2)(parser(lastSceneMd))).toMatchSnapshot()
  })
  it('split a Scene with actions', () => {
    expect(splitByScene(2)(parser(sceneWithActions))).toMatchSnapshot()
  })
})

describe('book', () => {
  it('sort by scene', () => {
    expect(book(parser(adventure))).toMatchSnapshot()
  })
})
