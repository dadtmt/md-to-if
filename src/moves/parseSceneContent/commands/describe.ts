import * as R from 'ramda'
import parseExpression from './expressions'
import { Command } from '.'
import { State } from '../..'
import { SingleASTNode } from 'simple-markdown'

// State -> [Content] -> [String]
const getContentList: (
  state: State
) => (content: SingleASTNode[][]) => (string | number)[] = state =>
  R.map(
    R.pipe(
      R.head,
      R.propOr('missing content', 'content'),
      R.split(' '),
      parseExpression(state)
    )
  )

// State -> [Content] -> Object
export const getDescription: (
  state: State
) => (data: SingleASTNode[]) => object = state =>
  R.pipe(
    R.head,
    R.converge(R.zipObj, [
      R.pipe(R.prop('header'), getContentList(state)),
      R.pipe(R.prop('cells'), R.head, getContentList(state)),
    ])
  )

const getFirstArg: (args: string[]) => string = R.pipe(
  R.head,
  R.when(R.isNil, R.always('missing first arg'))
)

const updateStateWithCommand: (command: Command) => (state: State) => State = ({
  args,
  data,
}) => state => R.assoc(getFirstArg(args), getDescription(state)(data))(state)

// [Command -> Boolean, Command -> State -> State]
const describe: [
  (command: Command) => boolean,
  (command: Command) => (state: State) => State
] = [R.propEq('instruction', 'describe'), updateStateWithCommand]

export default describe
