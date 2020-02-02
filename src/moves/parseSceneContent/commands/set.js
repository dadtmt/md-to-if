import * as R from 'ramda'

// [String] -> State -> State
const setValue = args => R.assocPath(R.dropLast(1, args), R.last(args))

// Command -> State -> State
const set = ({ args }) => setValue(args)

export default set
