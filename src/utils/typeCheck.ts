import * as R from 'ramda'

export const isNotAString = R.pipe(R.is(String), R.not)

export const toStringIfNotString = R.when(isNotAString, R.toString)
