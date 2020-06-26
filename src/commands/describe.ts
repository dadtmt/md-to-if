import * as R from 'ramda'
import parseExpression from '../expressions'
import { TestCommandAndUpdateState, CommandUpdateState } from '.'
import { State } from '../moves'
import { SingleASTNode } from 'simple-markdown'
import { right, Either, fold, left } from 'fp-ts/lib/Either'
import { toArrayOfStrings } from '../utils/typeCheck'

const getContentList: (
  state: State
) => (
  content: SingleASTNode[][],
  parsedExpressions?: (string | number)[]
) => Either<string, (string | number)[]> = state => (
  content,
  parsedExpressions = []
) => {
  const [headOfContent, ...restOfContent] = content
  if (R.isNil(headOfContent)) {
    return right(parsedExpressions)
  }
  const mayBeParsedExpression = R.pipe(
    R.head,
    R.propOr('', 'content'),
    R.split(' '),
    parseExpression(state)
  )(headOfContent)
  return fold<string, string | number, Either<string, (string | number)[]>>(
    message => left(message),
    parsedExpression =>
      getContentList(state)(restOfContent, [
        ...parsedExpressions,
        parsedExpression,
      ])
  )(mayBeParsedExpression)
}

export const getDescription: (
  state: State
) => (data: SingleASTNode[]) => Either<string, object> = state => data => {
  const headerDataLens = R.lensPath([0, 'header'])
  const cellsDataLens = R.lensPath([0, 'cells', 0])
  const mayBeHeaderContent = R.pipe(
    R.view(headerDataLens),
    getContentList(state)
  )(data)
  const mayBeCellsContent = R.pipe(
    R.view(cellsDataLens),
    getContentList(state)
  )(data)

  return fold<string, (string | number)[], Either<string, object>>(
    message => left(message),
    (headerContent: (string | number)[]) => {
      return fold<string, (string | number)[], Either<string, object>>(
        message => left(message),
        (cellsContent: (string | number)[]) =>
          right(R.zipObj(toArrayOfStrings(headerContent), cellsContent))
      )(mayBeCellsContent)
    }
  )(mayBeHeaderContent)
}

const getDescriptionKey: (args: string[]) => string = R.pipe(
  R.head,
  R.when(R.isNil, R.always('Need a key for this description'))
)

const updateStateWithDescription: CommandUpdateState = ({
  args,
  data,
}) => state => {
  const maybeState = getDescription(state)(data)
  return fold(
    (message: string) => left(message),
    (description: object) =>
      right(R.assoc(getDescriptionKey(args), description)(state))
  )(maybeState)
}

const describe: TestCommandAndUpdateState = [
  R.propEq('instruction', 'describe'),
  updateStateWithDescription,
]

export default describe
