import { Move } from '../../player'

const getPath = ({ target }: Move): string[] =>
  target?.split('/').splice(1) ?? []

export default getPath
