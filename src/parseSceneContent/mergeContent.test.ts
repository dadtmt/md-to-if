import mergeContent from './mergeContent'
import { textNode, paragraphNode } from '../node'

describe('mergeContent', () => {
  const previousContent = textNode('previous content')
  const currentContent = textNode('current content')
  it('append the new content node', () => {
    const expected = [previousContent, currentContent]
    expect(mergeContent([previousContent])(currentContent)).toEqual(expected)
  })
  it('merge child content if contentToMerge is true', () => {
    const secondContent = textNode('second current content')
    const paragraphToMerge = {
      ...paragraphNode([currentContent, secondContent]),
      contentToMerge: true
    }
    const expected = [previousContent, currentContent, secondContent]
    expect(mergeContent([previousContent])(paragraphToMerge)).toEqual(expected)
  })
})
