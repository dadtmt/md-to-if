import * as R from 'ramda'
import parseExpression, { ParsedExpression } from './expressions'
import { TestCommandAndUpdateState, CommandUpdateState } from '.'
import { State } from '../..'
import { SingleASTNode } from 'simple-markdown'
import { right } from 'fp-ts/lib/Either'

// State -> [Content] -> [String]
const getContentList: (
  state: State
) => (content: SingleASTNode[][]) => ParsedExpression[] = state =>
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

// TODO: Error "Need a key for this description"
const getDescriptionKey: (args: string[]) => string = R.pipe(
  R.head,
  R.when(R.isNil, R.always('Need a key for this description'))
)

const updateStateWithDescription: CommandUpdateState = ({
  args,
  data,
}) => state =>
  right(R.assoc(getDescriptionKey(args), getDescription(state)(data))(state))

const describe: TestCommandAndUpdateState = [
  R.propEq('instruction', 'describe'),
  updateStateWithDescription,
]

export default describe
