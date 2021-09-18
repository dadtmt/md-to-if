import * as R from 'ramda'
import { TestCommandAndUpdateState, CommandUpdateState } from '.'
import { State } from '../moves'
import { right } from 'fp-ts/lib/Either'
import foldError from '../utils/foldError'
import { getDescription } from './helpers'

const getDescriptionKey: (args: string[]) => string = R.pipe(
  R.head,
  R.when(R.isNil, R.always('Need a key for this description'))
)

const updateStateWithDescription: CommandUpdateState =
  ({ args, data }) =>
  (state) =>
    foldError<object, State>((description: object) =>
      right(R.assoc(getDescriptionKey(args), description)(state))
    )(getDescription(state)(data))

const describe: TestCommandAndUpdateState = [
  R.propEq('instruction', 'describe'),
  updateStateWithDescription
]

export default describe
