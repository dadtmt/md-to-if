/* eslint-disable no-var */
import JsDomEnvironment from 'jest-environment-jsdom'
import adventureGlobals from './adventureGlobals'

class AdventureJsDomEnvironment extends JsDomEnvironment {
  async setup(): Promise<void> {
    await super.setup()
    this.global.adventureGlobals = adventureGlobals
  }
}

export default AdventureJsDomEnvironment
