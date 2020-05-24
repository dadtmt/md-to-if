import * as R from 'ramda'

import goto from './goto'
import start from './start'

import parseSceneContent from './parseSceneContent'

export type State = {
  currentSceneName?: string | undefined
  played?: { currentSceneName: number }
  path?: object
  testResult?: boolean
}

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
const playMoves = (moves, scenes, playedScenes = []) => {
  const move = R.head(moves)
  return move
    ? playMoves(R.tail(moves), scenes, playMove(scenes, playedScenes)(move))
    : playedScenes
}

export default playMoves
