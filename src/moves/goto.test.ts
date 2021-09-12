import '../test/types.d'
import parser from '../parser'
import { getTargetedScene } from './goto'
import book from '../book'
import { ActionScene } from '..'

const { adventureGlobals } = global
const { adventureMd, moveToCantina, moveToCantinaDrink, moveToUnknown } =
  adventureGlobals
const adventureBook = book(parser(adventureMd))

const cantinaScene = adventureBook[2]
const { actions } = cantinaScene as ActionScene
const [drinkActionScene] = actions

describe('getTargetedScene', () => {
  it('get the targeted scene', () => {
    expect(getTargetedScene(moveToCantina)(adventureBook)).toEqual(cantinaScene)
  })
  it('get the targeted action scene', () => {
    expect(getTargetedScene(moveToCantinaDrink)(adventureBook)).toEqual(
      drinkActionScene
    )
  })
  it('get the unknown scene', () => {
    expect(getTargetedScene(moveToUnknown)(adventureBook)).toMatchSnapshot()
  })
})
