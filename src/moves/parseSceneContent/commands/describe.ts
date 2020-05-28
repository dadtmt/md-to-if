import * as R from 'ramda'
import parseExpression from './expressions'
import { Command } from '.'
import { State } from '../..'
import { Content } from '..'

type DescriptionData = {
  type: string
  header: Content[][]
  cells: Content[][]
}[]

// State -> [Content] -> [String]
const getContentList: (
  state: State
) => (content: Content[][]) => object = state =>
  R.map(R.pipe(R.head, R.prop('content'), R.split(' '), parseExpression(state)))

// State -> [Content] -> Object
export const getDescription: (
  state: State
) => (data: DescriptionData) => object = state =>
  R.pipe(
    R.head,
    R.converge(R.zipObj, [
      R.pipe(R.prop('header'), getContentList(state)),
      R.pipe(R.prop('cells'), R.head, getContentList(state)),
    ])
  )

const updateStateWithCommand: (command: Command) => (state: State) => State = ({
  args,
  data,
}) => state => R.assoc(R.head(args), getDescription(state)(data))(state)

// [Command -> Boolean, Command -> State -> State]
const describe: [
  (command: Command) => boolean,
  (command: Command) => (state: State) => State
] = [R.propEq('instruction', 'describe'), updateStateWithCommand]

export default describe
