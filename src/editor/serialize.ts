import { serialize, BlockType } from 'remark-slate'

export type Chunk = Parameters<typeof serialize>[0]

const options = {
  nodeTypes: {
    paragraph: 'p',
    block_quote: 'blockquote',
    code_block: 'code_block',
    link: 'a',
    ul_list: 'ul',
    ol_list: 'ol',
    listItem: 'li',
    heading: {
      1: 'h1',
      2: 'h2',
      3: 'h3',
      4: 'h4',
      5: 'h5',
      6: 'h6'
    },
    emphasis_mark: 'em',
    strong_mark: 'bold',
    delete_mark: 'strikethrough',
    inline_code_mark: 'code',
    thematic_break: 'thematic_break',
    image: 'img'
  }
}

function isBlockType(x: any): x is BlockType {
  return x.type !== undefined
}

const serializeToMdIF = (node: Chunk): string | undefined => {
  if (isBlockType(node)) {
    const { type, children } = node
    if (type === 'command') {
      const serializedCommandChildren = children.reduce(
        // @ts-expect-error
        (acc, child) => `${acc}${serialize(child, options) ?? ''}`,
        ''
      )
      return `{${serializedCommandChildren}}`
    }
  }
  // @ts-expect-error
  return serialize(node, options)
}

export default serializeToMdIF
