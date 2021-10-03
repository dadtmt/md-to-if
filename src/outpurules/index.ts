import { defaultRules, OutputRules, ReactOutputRule } from 'simple-markdown'
import { MoveHandler } from '../renderer'
import LinkRenderer from './LinkRenderer'
import DialogRenderer from './DialogRenderer'

const rules = (moveHandler: MoveHandler): OutputRules<ReactOutputRule> => ({
  ...defaultRules,
  dialog: {
    react: DialogRenderer
  },
  link: {
    ...defaultRules.link,
    react: LinkRenderer(moveHandler)
  }
})

export default rules
