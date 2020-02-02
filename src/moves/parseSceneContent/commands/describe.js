import * as R from 'ramda'

// [Content] -> [String]
const getContentList = R.map(R.pipe(R.head, R.prop('content')))

// [Content] -> Object
export const getDescription = R.pipe(
  R.head,
  R.converge(R.zipObj, [
    R.pipe(R.prop('header'), getContentList),
    R.pipe(R.prop('cells'), R.head, getContentList),
  ])
)

// Command -> State -> State
const describe = ({ args, data }) => R.assoc(R.head(args), getDescription(data))

export default describe
