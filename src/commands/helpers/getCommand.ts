import R from 'ramda'
import type { SingleASTNode } from 'simple-markdown'
import type { Command } from '..'

const getContentAsString: (content: SingleASTNode) => string = R.pipe(
  R.prop<string>('content'),
  R.when(R.pipe(R.type, R.equals('String'), R.not), R.always(''))
)

const getCommandLine: (content: SingleASTNode) => string[] = R.pipe(
  getContentAsString,
  R.trim,
  R.split(' ')
)

const getCommand: (contentBody: SingleASTNode[]) => Command = ([
  commandLine,
  ...data
]) => {
  const [instruction, ...args] = getCommandLine(commandLine)

  return { instruction, args, data }
}

export default getCommand
