import * as R from 'ramda'
import { Either } from 'fp-ts/lib/Either'

import { State } from '../moves'
import { SingleASTNode } from 'simple-markdown'
import {
  TestAndComputeContentAndState,
  ConditionalFunction
} from '../parseSceneContent/parseContent'
import { applyCommand } from './helpers'
import set from './set'
import describe from './describe'
import test from './testCommand'
import show from './show'

export interface Command {
  instruction: string
  args: string[]
  data: SingleASTNode[]
}

type TestCommand = ConditionalFunction<Command>

export type CommandUpdateState = (
  command: Command
) => (state: State) => Either<string, State>

export type CommandToContent = (
  command: Command
) => Either<string, SingleASTNode>

export type TestCommandAndUpdateState = [TestCommand, CommandUpdateState]

export type TestCommandAndGetContent = [TestCommand, CommandToContent]

const parseCommandContent: (state: State) => TestAndComputeContentAndState = (
  state
) => [
  R.propEq('type', 'command'),
  applyCommand(state, [set, test, describe], [show(state)])
]

export default parseCommandContent
