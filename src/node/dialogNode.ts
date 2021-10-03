import { SingleASTNode } from 'simple-markdown'
import { Dialog } from '..'

const dialogNode = ({ actions, quote }: Dialog): SingleASTNode => ({
  type: 'dialog',
  content: [
    quote,
    ...actions.map(({ label, path }) => ({
      type: 'link',
      target: path,
      content: [{ type: 'text', content: label }]
    }))
  ]
})

export default dialogNode
