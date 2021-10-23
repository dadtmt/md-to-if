import { commandNode, emptyTextNode, tableNode, textNode } from '../node'
import { applyCommand } from './helpers'
import describeCommand from './describe'

describe('applyCommand describe', () => {
  it('stores an object description', () => {
    const command = commandNode([
      textNode('describe droid'),
      tableNode(
        [[textNode('CC')], [textNode('CT')]],
        [[[textNode('5')], [textNode('45')]]]
      )
    ])
    const state = {}
    const expected = [
      emptyTextNode,
      {
        store: { droid: { CC: 5, CT: 45 } }
      }
    ]
    expect(applyCommand(state, [describeCommand])(command)).toEqual(expected)
  })
})
