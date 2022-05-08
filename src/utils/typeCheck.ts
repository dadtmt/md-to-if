import * as R from 'ramda'

export const isNotAString = R.pipe(R.is(String), R.not)

export const toStringIfNotString = R.when<any, string>(isNotAString, R.toString)

export const toArrayOfStrings = R.map<any, string>(toStringIfNotString)
