import * as R from 'ramda'
import parseExpression from './expressions'

// State -> [Content] -> [String]
const getContentList = state =>
  R.map(R.pipe(R.head, R.prop('content'), R.split(' '), parseExpression(state)))

// State -> [Content] -> Object
export const getDescription = state =>
  R.pipe(
    R.head,
    R.converge(R.zipObj, [
      R.pipe(R.prop('header'), getContentList(state)),
      R.pipe(R.prop('cells'), R.head, getContentList(state)),
    ])
  )

// [Command -> Boolean, Command -> State -> State]
const describe = [
  R.propEq('instruction', 'describe'),
  ({ args, data }) => state =>
    R.assoc(R.head(args), getDescription(state)(data))(state),
]

export default describe
