import React from 'react'
import { ReactOutput, SingleASTNode, State } from 'simple-markdown'
import { MoveHandler } from '../react-renderer'

const LinkRenderer =
  (moveHandler: MoveHandler) =>
  ({ target, content }: SingleASTNode, output: ReactOutput, { key }: State) => {
    return (
      <a
        key={key}
        href={target}
        aria-label={target}
        onClick={() =>
          moveHandler(
            target === 'start'
              ? {
                  type: 'start'
                }
              : {
                  type: 'anchor',
                  target
                }
          )
        }>
        {output(content)}
      </a>
    )
  }

export default LinkRenderer
