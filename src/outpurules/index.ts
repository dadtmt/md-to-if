import { defaultRules, OutputRules, ReactOutputRule } from 'simple-markdown'
import { MoveHandler } from '../renderer'
import LinkRenderer from './LinkRenderer'
import MenuRenderer from './MenuRenderer'

const rules = (moveHandler: MoveHandler): OutputRules<ReactOutputRule> => ({
  ...defaultRules,
  menu: {
    react: MenuRenderer
  },
  link: {
    ...defaultRules.link,
    react: LinkRenderer(moveHandler)
  }
})

export default rules
