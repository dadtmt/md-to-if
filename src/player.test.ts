import './test/types.d'
import parser from './parser'
import player, { PlayedScene } from './player'
import book from './book'

jest.mock('./expressions/rollDices')

const { adventureGlobals } = global
const { adventureMd, startMove, moveToCantina } = adventureGlobals
const adventureBook = book(parser(adventureMd))
const [startScene, firstScene] = adventureBook
const { actions, ...restOfFirstScene } = firstScene
const playedStartScene: PlayedScene = {
  ...startScene,
  state: {}
}
const playedFirstScene: PlayedScene = {
  ...restOfFirstScene,
  state: {
    currentSceneName: 'the_space_ship',
    played: {
      the_space_ship: 1
    }
  }
}

describe('player', () => {
  it('play book introduction if no moves', () => {
    const expected = [playedStartScene]
    expect(player(adventureBook)).toEqual(expected)
  })
  it('play first scene on start move and add state.played with first_scene: 1', () => {
    const moves = [startMove]
    const expected = [playedStartScene, playedFirstScene]
    expect(player(adventureBook, moves)).toEqual(expected)
  })
  it('play cantina scene on cantina target', () => {
    const moves = [startMove, moveToCantina]
    const { name } = player(adventureBook, moves).pop()
    expect(name).toBe('cantina')
  })
  it('add menu with 2 links at the end of cantina content', () => {
    const moves = [startMove, moveToCantina]
    const { sceneContent } = player(adventureBook, moves).pop()
    const { type, content } = sceneContent.pop()
    expect(type).toBe('menu')
    expect(content).toHaveLength(2)
  })
  it('increment cantina scene played on second cantina move', () => {
    const moves = [startMove, moveToCantina, moveToCantina]
    const { state } = player(adventureBook, moves).pop()
    const { played } = state
    const { cantina } = played
    expect(cantina).toBe(2)
  })
})
