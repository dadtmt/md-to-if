import * as R from 'ramda'

import parseExpression from './expressions'

// [String] -> State -> State
const setValue = args => state => {
  const [path, expression] = R.splitWhen(R.equals('val'), args)
  return R.assocPath(path, parseExpression(state)(R.tail(expression)))(state)
}

// [Command -> Boolean, Command -> State -> State]
const set = [R.propEq('instruction', 'set'), ({ args }) => setValue(args)]

export default set
