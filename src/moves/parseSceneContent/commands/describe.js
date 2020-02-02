import * as R from 'ramda'

const getContentList = R.map(R.pipe(R.head, R.prop('content')))

const getDescription = R.pipe(
  R.head,
  R.converge(R.zipObj, [
    R.pipe(R.prop('header'), getContentList),
    R.pipe(R.prop('cells'), R.head, getContentList),
  ])
)

export default getDescription
