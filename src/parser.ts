import SimpleMarkdown, { SingleASTNode } from 'simple-markdown'

// String -> [String]
export const matchBraces = (source: string): RegExpExecArray | null =>
  /^\{([\s\S]*?)\}/.exec(source)

// String -> [String]
export const matchBracketPipe = (source: string): RegExpExecArray | null =>
  /^\[([\s\S]*?)\|/.exec(source)

// String -> [String]
export const matchPipeBracket = (source: string): RegExpExecArray | null =>
  /^\|([\s\S]*?)\]/.exec(source)

const parse: (capture: any, parse: any, state: any) => any = (
  capture,
  parse,
  state
) => ({ content: parse(capture[1], state) })

const command = {
  order: 0,
  match: matchBraces,
  parse
}

const trueCaseContent = {
  order: 0,
  match: matchBracketPipe,
  parse
}

const falseCaseContent = {
  order: 0,
  match: matchPipeBracket,
  parse
}

// String -> [Content]
const parser: (source: string) => SingleASTNode[] = SimpleMarkdown.parserFor({
  ...SimpleMarkdown.defaultRules,
  command,
  trueCaseContent,
  falseCaseContent
})

export default parser
