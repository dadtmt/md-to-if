import SimpleMarkdown from 'simple-markdown'

export const matchBraces = source => /^\{([\s\S]*?)\}/.exec(source)

export const matchBracketPipe = source => /^\[([\s\S]*?)\|/.exec(source)

export const matchPipeBracket = source => /^\|([\s\S]*?)\]/.exec(source)

const dynamic = {
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

const parser = SimpleMarkdown.parserFor({
  ...SimpleMarkdown.defaultRules,
  dynamic,
  trueCaseContent,
  falseCaseContent,
})

export default parser
