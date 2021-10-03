import { BookScene } from '../..'
import { Move } from '../../player'
import defaultDialog from '../../sceneBookParser/defaultDialog'
import getPath from './getPath'

const notFoundScene = (move: Move): BookScene => {
  return {
    dialog: defaultDialog(),
    name: 'unknown',
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
            content: `The scene with path: /${getPath(move).join(
              '/'
            )} does not exist`
          }
        ]
      }
    ]
  }
}

export default notFoundScene
