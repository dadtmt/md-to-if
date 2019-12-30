import parser from './parser'
import book, { splitByScene } from './book'
import adventure from './adventure.md.js'

describe('splitByScene', () => {
  it('split the first scene', () => {
    expect(splitByScene(parser(adventure))).toMatchSnapshot()
  })
  it('split the last scene', () => {
    const lastSceneMd = `## Final landing

congrats you made it!!!
    `
    expect(splitByScene(parser(lastSceneMd))).toMatchSnapshot()
  })
})

describe('book', () => {
  it('sort by scene', () => {
    expect(book(parser(adventure))).toMatchSnapshot()
  })
})
