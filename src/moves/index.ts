import * as R from 'ramda'
import * as t from 'io-ts'

import goto from './goto'
import start from './start'

import parseSceneContent from './parseSceneContent'
import { Move, PlayedScene } from '../player'
import { Scene } from '..'
import { SingleASTNode } from 'simple-markdown'

export type State = {
  currentSceneName?: string | undefined
  played?: object
  path?: object
  testResult?: boolean
}

export type MovedScene = {
  name: string
  sceneContent: SingleASTNode[]
  state: State
}

// [Scene], [PlayedScene] ->  Move -> MovedScene
const applyMove: (
  scenes: Scene[],
  playedScenes: PlayedScene[]
) => (move: Move) => MovedScene = (scenes, playedScenes) =>
  R.cond([start(scenes), goto(scenes, playedScenes)])

// MovedScene -> PlayedScene
const playScene: (movedScene: MovedScene) => PlayedScene = movedScene => {
  const { sceneContent, state, ...restOfScene } = movedScene

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
const accPlayedScenes: (
  playedScenes: PlayedScene[]
) => (
  playedScene: PlayedScene
) => PlayedScene[] = playedScenes => playedScene => [
  ...playedScenes,
  playedScene,
]

// [Scene], [PlayedScene] -> Move -> [PlayedScene]
const playMove: (
  scenes: Scene[],
  playedScenes: PlayedScene[]
) => (move: Move) => PlayedScene[] = (scenes, playedScenes) =>
  R.pipe(
    applyMove(scenes, playedScenes),
    playScene,
    accPlayedScenes(playedScenes)
  )

// [Move], [Scene], [PlayedScene] -> [PlayedScene]
const playMoves: (
  moves: Move[],
  scenes: Scene[],
  playedScenes?: PlayedScene[]
) => PlayedScene[] = (moves, scenes, playedScenes = []) => {
  const move = R.head(moves)
  return move
    ? playMoves(R.tail(moves), scenes, playMove(scenes, playedScenes)(move))
    : playedScenes
}

export default playMoves
