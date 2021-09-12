import * as R from 'ramda'

import goto from './goto'
import start from './start'

import parseSceneContent from '../parseSceneContent'
import { Move, PlayedScene } from '../player'
import { BookScene } from '..'

export interface State {
  currentSceneName?: string | undefined
  played?: { [sceneName: string]: number }
  path?: object
  testResult?: boolean
}

export interface MovedScene extends BookScene {
  state: State
}

// [Scene], [PlayedScene] ->  Move -> MovedScene
const applyMove: (
  scenes: BookScene[],
  playedScenes: PlayedScene[]
) => (move: Move) => MovedScene = (scenes, playedScenes) =>
  R.cond([start(scenes), goto(scenes, playedScenes)])

// MovedScene -> PlayedScene
const playScene: (movedScene: MovedScene) => PlayedScene = (movedScene) => {
  const { sceneContent, state, actions, name, ...restOfScene } = movedScene

  const [parsedSceneContent, parsedState] = parseSceneContent({
    sceneContent,
    state
  })
  return {
    sceneContent:
      actions.length > 0
        ? [
            ...parsedSceneContent,
            {
              type: 'menu',
              content: actions.map(({ actionLabel, name: actionName }) => ({
                type: 'link',
                target: `/${name}/${actionName}`,
                content: [{ type: 'text', content: actionLabel }]
              }))
            }
          ]
        : parsedSceneContent,
    state: parsedState,
    name,
    ...restOfScene
  }
}

// [PlayedScene] -> PlayedScene -> [PlayedScene]
const accPlayedScenes: (
  playedScenes: PlayedScene[]
) => (playedScene: PlayedScene) => PlayedScene[] =
  (playedScenes) => (playedScene) =>
    [...playedScenes, playedScene]

// [Scene], [PlayedScene] -> Move -> [PlayedScene]
const playMove: (
  scenes: BookScene[],
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
  scenes: BookScene[],
  playedScenes?: PlayedScene[]
) => PlayedScene[] = (moves, scenes, playedScenes = []) => {
  const move = R.head(moves)
  return move != null
    ? playMoves(R.tail(moves), scenes, playMove(scenes, playedScenes)(move))
    : playedScenes
}

export default playMoves
