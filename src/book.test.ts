import parser from './parser'
import book, {
  splitByScene,
  getSceneName,
  splitContentAndActions,
} from './book'
import adventure from './adventure.md'

const lastSceneMd = `## Final landing

congrats you made it!!!
    `

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
    const contentWithActions = `
some content

### Action1

this is a level 3 action

#### Action 1.1

this is level 4 action


### Action2

this is a level 3 action
    `
    const content = parser(contentWithActions)

    expect(splitContentAndActions(3)(content)).toMatchSnapshot()
  })
})

describe('splitByScene', () => {
  it('split the first scene', () => {
    expect(splitByScene(2)(parser(adventure))).toMatchSnapshot()
  })
  it('split the last scene', () => {
    expect(splitByScene(2)(parser(lastSceneMd))).toMatchSnapshot()
  })
})

describe('book', () => {
  it('sort by scene', () => {
    expect(book(parser(adventure))).toMatchSnapshot()
  })
})
