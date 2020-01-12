import SimpleMarkdown from 'simple-markdown'

export const matchBraces = source => /^\{(.*?)\}/.exec(source)

export const matchSetter = source => /^<!(.*?)!>/.exec(source)

const dynamic = {
  order: 0,
  match: matchBraces,
  parse: (capture, parse, state) => ({ content: parse(capture[1], state) }),
}

const setter = {
  order: 0,
  match: matchSetter,
  parse: (capture, parse, state) => ({ content: parse(capture[1], state) }),
}

const parser = SimpleMarkdown.parserFor({
  ...SimpleMarkdown.defaultRules,
  dynamic,
  setter,
})

export default parser
