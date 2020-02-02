import SimpleMarkdown from 'simple-markdown'

// String -> [String]
export const matchBraces = source => /^\{([\s\S]*?)\}/.exec(source)

// String -> [String]
export const matchBracketPipe = source => /^\[([\s\S]*?)\|/.exec(source)

// String -> [String]
export const matchPipeBracket = source => /^\|([\s\S]*?)\]/.exec(source)

const command = {
  order: 0,
  match: matchBraces,
  parse: (capture, parse, state) => ({ content: parse(capture[1], state) }),
}

const trueCaseContent = {
  order: 0,
  match: matchBracketPipe,
  parse: (capture, parse, state) => ({ content: parse(capture[1], state) }),
}

const falseCaseContent = {
  order: 0,
  match: matchPipeBracket,
  parse: (capture, parse, state) => ({ content: parse(capture[1], state) }),
}

// String -> [Content]
const parser = SimpleMarkdown.parserFor({
  ...SimpleMarkdown.defaultRules,
  command,
  trueCaseContent,
  falseCaseContent,
})

export default parser
