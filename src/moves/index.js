import * as R from 'ramda'

import goto from './gotoMove'
import start from './startMove'

import parseSceneContent from './parseSceneContent'

// [Scene], [PlayedScene] ->  Move -> MovedScene
const applyMove = (scenes, playedScenes) =>
  R.cond([start(scenes), goto(scenes, playedScenes)])

// MovedScene -> PlayedScene
const playScene = movedscene => {
  const { sceneContent, state, ...restOfScene } = movedscene

  const [parsedSceneContent, parsedState] = parseSceneContent({
    sceneContent,
    state,
  })
  return {
    sceneContent: parsedSceneContent,
    state: parsedState,
    ...restOfScene,
  }
}

// [PlayedScene] -> PlayedScene -> [PlayedScene]
const accPlayedScenes = playedScenes => playedScene => [
  ...playedScenes,
  playedScene,
]

// [Scene], [PlayedScene] -> Move -> [PlayedScene]
const playMove = (scenes, playedScenes) =>
  R.pipe(
    applyMove(scenes, playedScenes),
    playScene,
    accPlayedScenes(playedScenes)
  )

// [Move], [Scene], [PlayedScene] -> [PlayedScene]
const playMoves = (moves, scenes, story = []) => {
  const move = R.head(moves)
  return move
    ? playMoves(R.tail(moves), scenes, playMove(scenes, story)(move))
    : story
}

export default playMoves
