import * as R from 'ramda'

const hello = R.curry((firstName, lastName) => `Hello ${firstName} ${lastName}`)

export default hello
