import parser from './parser'

describe('parser', () => {
  it('parse markdown', () => {
    const md = `# Choose your story

This is a test adventure, welcome.

## The space ship

You are the brave pilot of this ship.
The trip is long and boring.

Are you going to [pee](/space-toilet) or to [get a rest](/bedroom)`

    expect(parser(md)).toMatchSnapshot()
  })
})
