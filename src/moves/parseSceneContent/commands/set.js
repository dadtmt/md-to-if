import * as R from 'ramda'

// [String] -> State -> State
const setValue = args => R.assocPath(R.dropLast(1, args), R.last(args))

// [Command -> Boolean, Command -> State -> State]
const set = [R.propEq('instruction', 'set'), ({ args }) => setValue(args)]

export default set
