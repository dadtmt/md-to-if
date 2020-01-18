import SimpleMarkdown from 'simple-markdown'

export const matchBraces = source => /^\{(.*?)\}/.exec(source)

export const matchSetter = source => /^<!(.*?)!>/.exec(source)

const dynamic = {
  order: 0,
  match: matchBraces,
  parse: (capture, parse, state) => ({ content: parse(capture[1], state) }),
}

const parser = SimpleMarkdown.parserFor({
  ...SimpleMarkdown.defaultRules,
  dynamic,
})

export default parser
