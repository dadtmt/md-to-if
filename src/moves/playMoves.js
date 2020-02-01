import * as R from 'ramda'

import goto from './gotoMove'
import start from './startMove'

import parseDynamicSceneContentWithState from './parseSceneContent'

const addToStory = story => scene => [...story, scene]

const playSceneContent = scene => {
  const { sceneContent, state, ...restOfScene } = scene

  const [parsedSceneContent, parsedState] = parseDynamicSceneContentWithState({
    sceneContent,
    state,
  })
  return {
    sceneContent: parsedSceneContent,
    state: parsedState,
    ...restOfScene,
  }
}

const playMoves = (moves, scenes, story = []) => {
  const move = R.head(moves)
  return move
    ? playMoves(
        R.tail(moves),
        scenes,
        R.pipe(
          R.cond([start(scenes), goto(scenes, story)]),
          playSceneContent,
          addToStory(story)
        )(move)
      )
    : story
}

export default playMoves
