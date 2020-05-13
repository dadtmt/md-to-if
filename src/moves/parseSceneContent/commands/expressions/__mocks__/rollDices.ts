import * as R from 'ramda'

// [[String] -> Boolean, [String] -> Number]
const rollDices = [R.pipe(R.head, R.equals('roll')), R.always(42)]

export default rollDices
