import * as R from 'ramda'
import goto from './goto'
import start from './start'

import parseSceneContent from '../parseSceneContent'
import { Move, PlayedScene } from '../player'
import { BookScene, Dialog } from '..'
import addDialogNode from './helpers/addDialogNode'
import { ExpressionValidResult } from '../expressions'

interface Store {
  [key: string]: Store | ExpressionValidResult
}

export interface State {
  currentSceneName?: string | undefined
  played?: { [sceneName: string]: number }
  testResult?: boolean
  mainDialog?: Dialog
  store?: Store
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
  const { sceneContent, state, dialog, name, ...restOfScene } = movedScene

  const [parsedSceneContent, parsedState] = parseSceneContent({
    sceneContent,
    state
  })
  const { mainDialog } = parsedState
  const [parsedSceneContentWithDialog, parsedStateWithDialog] = addDialogNode(
    dialog,
    parsedSceneContent,
    parsedState,
    mainDialog
  )
  return {
    sceneContent: parsedSceneContentWithDialog,
    state: parsedStateWithDialog,
    name,
    ...restOfScene
  }
}

const accPlayedScenes: (
  playedScenes: PlayedScene[]
) => (playedScene: PlayedScene) => PlayedScene[] =
  (playedScenes) => (playedScene) =>
    [...playedScenes, playedScene]

const playMove: (
  scenes: BookScene[],
  playedScenes: PlayedScene[]
) => (move: Move) => PlayedScene[] = (scenes, playedScenes) =>
  R.pipe(
    applyMove(scenes, playedScenes),
    playScene,
    accPlayedScenes(playedScenes)
  )

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
