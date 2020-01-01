import parser from './parser'
import book, { splitByScene, getSceneName } from './book'
import adventure from './adventure.md.js'

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

describe('splitByScene', () => {
  it('split the first scene', () => {
    expect(splitByScene(parser(adventure))).toMatchSnapshot()
  })
  it('split the last scene', () => {
    expect(splitByScene(parser(lastSceneMd))).toMatchSnapshot()
  })
})

describe('book', () => {
  it('sort by scene', () => {
    expect(book(parser(adventure))).toMatchSnapshot()
  })
})
