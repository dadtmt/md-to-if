import '../../test/types.d'
import parser from '../../parser'
import getTargetedScene from './getTargetedScene'
import book from '../../book'
import { ActionScene, BookScene } from '../..'
import defaultDialog from '../../sceneBookParser/defaultDialog'

const { adventureGlobals } = global
const { adventureMd, moveToCantina, moveToCantinaDrink, moveToUnknown } =
  adventureGlobals
const adventureBook = book(parser(adventureMd))

const cantinaScene = adventureBook[2]
const {
  dialog: { actions }
} = cantinaScene as ActionScene
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
    const expected: BookScene = {
      name: 'unknown',
      dialog: defaultDialog(),
      sceneContent: [
        {
          type: 'heading',
          level: 2,
          content: [
            {
              type: 'text',
              content: 'unknown'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              content: `The scene with path: /unknown does not exist`
            }
          ]
        }
      ]
    }
    expect(getTargetedScene(moveToUnknown)(adventureBook)).toEqual(expected)
  })
})
