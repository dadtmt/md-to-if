import React from 'react'
import {
  ReactElement,
  ReactOutput,
  SingleASTNode,
  State
} from 'simple-markdown'

const MenuRenderer = (
  { content }: SingleASTNode,
  output: ReactOutput,
  { key }: State
): ReactElement => {
  return (
    <ul key={key}>
      {content.map((link: SingleASTNode) => (
        <li key={link.target}>{output(link)}</li>
      ))}
    </ul>
  )
}

export default MenuRenderer
