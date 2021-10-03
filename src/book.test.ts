import './test/types.d'
import parser from './parser'
import book from './book'
import defaultDialog from './sceneBookParser/defaultDialog'

const someMd = `# Story

a story

## The first scene

first scene content

## Scene with a main menu

sceen with actions

> the scene menu quote
> *

### Action 1

action 1 content

> the action 1 menu quote

#### Action 1 1

action 1 1 content

### Action 2

action 2 content

## Scene with a not main menu

sceen with actions

> the scene not main menu quote

### An action with a main menu

> the action main menu quote
> *

### An action with a main menu and child action

> the action main menu quote
> *

#### an action
`

describe('book', () => {
  const someBook = book(parser(someMd))
  const [startScene, firstScene, sceneWithActions, sceneWithNotMainMenu] =
    someBook

  describe('The start scene is the welcome page of the book', () => {
    const { name: startSceneName } = startScene
    it('splits the start scene', () => {
      expect(startSceneName).toBe('story')
    })
  })

  describe('The first scene is the begining of the adventure', () => {
    const { name: firstSceneName } = firstScene
    it('splits the first scene', () => {
      expect(firstSceneName).toBe('the_first_scene')
    })
  })

  describe('The scene with a main menu is a scene whith a dialog that will be repeated through the child action scenes', () => {
    const {
      dialog: { actions, isMain, quote },
      name: mainSceneName
    } = sceneWithActions

    it('the scene dialog is a main dialog', () => {
      expect(isMain).toBe(true)
    })

    it('has a dialog quote', () => {
      expect(quote).toBeDefined()
    })

    it('the scene dialog has 2 actions', () => {
      expect(actions).toHaveLength(2)
    })

    const [action1, action2] = actions

    describe('The first action is a scene with a dialog with one action', () => {
      const {
        label,
        name: action1Name,
        dialog: { actions, quote, isMain },
        path
      } = action1
      it('the first action label is Action 1', () => {
        expect(label).toBe('Action 1')
      })
      it('the first action name is action_1', () => {
        expect(action1Name).toBe('action_1')
      })
      it('the first action path is a concatenation of /, the parent scene name and the scene name', () => {
        expect(path).toBe(`/${mainSceneName}/${action1Name}`)
      })
      it('the first action dialog is not a main dialog', () => {
        expect(isMain).toBe(false)
      })
      it('the first action dialog has one action', () => {
        expect(actions).toHaveLength(1)
      })
      it('the first action dialog has a quote', () => {
        expect(quote).toBeDefined()
      })

      const [action] = actions

      describe('The first action child action is a scene with no dialog', () => {
        const { label, name, dialog, path } = action

        it('the first action child action label is Action 1 1', () => {
          expect(label).toBe('Action 1 1')
        })
        it('the first action child action name is action_1_1', () => {
          expect(name).toBe('action_1_1')
        })
        it('the first action child action path is a concatenation of /, all the parent scene names and the scene name', () => {
          expect(path).toBe(`/${mainSceneName}/${action1Name}/${name}`)
        })
        it('the first action child has default dialog', () => {
          expect(dialog).toEqual(defaultDialog())
        })
      })
    })

    describe('The second action is a scene with default dialog', () => {
      const { label, name, dialog, path } = action2

      it('the second action label is Action 2', () => {
        expect(label).toBe('Action 2')
      })
      it('the second action name is action_2', () => {
        expect(name).toBe('action_2')
      })
      it('the second action path is a concatenation of /, all the parent scene names and the scene name', () => {
        expect(path).toBe(`/${mainSceneName}/${name}`)
      })
      it('the second action has default a dialog ', () => {
        expect(dialog).toEqual(defaultDialog())
      })
    })
  })

  describe('The scene with a not main menu is a scene whith a dialog that will not be repeated through the child action scenes', () => {
    const {
      dialog: { isMain, quote, actions }
    } = sceneWithNotMainMenu
    it('the scene dialog has a quote', () => {
      expect(quote).toBeDefined()
    })
    it('the scene dialog is not a main dialog', () => {
      expect(isMain).toBe(false)
    })
    const [actionWithMain, actionWithMainAndChildren] = actions
    describe('The child action has a main dialog', () => {
      const {
        dialog: { quote, isMain }
      } = actionWithMain
      it('the child action dialog has a quote', () => {
        expect(quote).toBeDefined()
      })
      it('the child action dialog is not a main dialog', () => {
        expect(isMain).toBe(true)
      })
    })
    describe('The child action with children has a main dialog', () => {
      const {
        dialog: { quote, isMain }
      } = actionWithMainAndChildren
      it('the child action dialog has a quote', () => {
        expect(quote).toBeDefined()
      })
      it('the child action dialog is not a main dialog', () => {
        expect(isMain).toBe(true)
      })
    })
  })
})
