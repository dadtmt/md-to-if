import * as R from 'ramda'

// State -> [[String] -> Boolean, [String] -> String]
const playedCount = state => [R.pipe(R.head, R.equals('val')), R.nth(1)]

export default playedCount
