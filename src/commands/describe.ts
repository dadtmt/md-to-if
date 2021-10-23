import * as R from 'ramda'
import { TestCommandAndUpdateState, CommandUpdateState } from '.'
import { State } from '../moves'
import { right } from 'fp-ts/lib/Either'
import foldError from '../utils/foldError'
import { getDescription } from './helpers'

export interface Description {
  [key: string]: string | number
}

const getDescriptionKey: (args: string[]) => string = R.pipe(
  R.head,
  R.when(R.isNil, R.always('Need a key for this description'))
)

const updateStateWithDescription: CommandUpdateState =
  ({ args, data }) =>
  (state) =>
    foldError<Description, State>((description: Description) => {
      const { store } = state
      return right({
        ...state,
        store: {
          ...store,
          [getDescriptionKey(args)]: description
        }
      })
    })(getDescription(state)(data))

const describe: TestCommandAndUpdateState = [
  R.propEq('instruction', 'describe'),
  updateStateWithDescription
]

export default describe
