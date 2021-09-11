/* eslint-disable no-var */
import NodeEnvironment from 'jest-environment-node'
import adventureGlobals from './adventureGlobals'

class AdventureEnvironment extends NodeEnvironment {
  async setup(): Promise<void> {
    await super.setup()
    this.global.adventureGlobals = adventureGlobals
  }
}

export default AdventureEnvironment
