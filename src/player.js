import * as R from 'ramda'

const player = R.curry((source, moves = []) =>
  R.pipe(
    R.splitWhen(
      R.where({
        type: R.equals('heading'),
        level: R.equals(2),
      })
    ),
    R.head
  )(source)
)

export default player
