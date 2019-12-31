import parser from './parser'
import book, { splitByScene, getSceneName } from './book'
import adventure from './adventure.md.js'

const lastSceneMd = `## Final landing

congrats you made it!!!
    `

describe('getSceneName', () => {
  it('get scene name', () => {
    const scene = parser(lastSceneMd)
    expect(getSceneName(scene)).toMatchSnapshot()
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
