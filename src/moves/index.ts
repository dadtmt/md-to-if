import * as R from 'ramda'
import { SingleASTNode } from 'simple-markdown'
import goto from './goto'
import start from './start'

import parseSceneContent from '../parseSceneContent'
import { Move, PlayedScene } from '../player'
import { BookScene, Dialog } from '..'
import { dialogNode } from '../node'

export interface State {
  currentSceneName?: string | undefined
  played?: { [sceneName: string]: number }
  path?: object
  testResult?: boolean
  mainDialog?: Dialog
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

const addDialogNode = (
  dialog: Dialog,
  sceneContent: SingleASTNode[],
  mainDialog?: Dialog
): SingleASTNode[] => {
  const { isDefault } = dialog
  const contentWithNotDefaultDialog = !isDefault
    ? [...sceneContent, dialogNode(dialog)]
    : sceneContent
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return isDefault && mainDialog
    ? [...contentWithNotDefaultDialog, dialogNode(mainDialog)]
    : contentWithNotDefaultDialog
}

const addMainDialogToState = (dialog: Dialog, state: State): State => {
  const { isMain } = dialog
  return isMain ? { ...state, mainDialog: dialog } : state
}

// MovedScene -> PlayedScene
const playScene: (movedScene: MovedScene) => PlayedScene = (movedScene) => {
  const { sceneContent, state, dialog, name, ...restOfScene } = movedScene

  const [parsedSceneContent, parsedState] = parseSceneContent({
    sceneContent,
    state
  })

  const { mainDialog } = parsedState
  return {
    sceneContent: addDialogNode(dialog, parsedSceneContent, mainDialog),
    state: addMainDialogToState(dialog, parsedState),
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
