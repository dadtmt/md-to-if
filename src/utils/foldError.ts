import { Either, fold, left } from 'fp-ts/lib/Either'

const foldError: <T, U>(
  onRight: (validResult: T) => Either<string, U>
) => (maybe: Either<string, T>) => Either<string, U> = (onRight) =>
  fold<string, any, Either<string, any>>((message) => left(message), onRight)

export default foldError
