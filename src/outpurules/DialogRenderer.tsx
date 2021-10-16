import React from 'react'
import {
  ReactElement,
  ReactOutput,
  SingleASTNode,
  State
} from 'simple-markdown'

const DialogRenderer = (
  { content }: SingleASTNode,
  output: ReactOutput,
  { key }: State
): ReactElement => {
  const [blockQuote, ...actionLinks] = content as SingleASTNode[]
  // console.log(blockQuote.content[0].type)
  return (
    <div key={key}>
      {output(blockQuote)}
      {actionLinks.length > 0 && (
        <ul>
          {actionLinks.map((link: SingleASTNode) => (
            <li key={link.target}>{output(link)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DialogRenderer
