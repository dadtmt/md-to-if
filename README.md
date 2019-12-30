# A boilerplate to build JS exercises

## features

- tests with jest
- linting with eslint (airbnb styleguide)
- prettier
- ES6

## how to create your exercices

### Duplicate this repository

**Don't fork this repository**.

1. Download it as a **ZIP Archive** with the big green button!
2. Create a new repo from its content

**OR duplicate it with CLI**

1. Create a new repository `https://github.com/WildCodeSchool/new-exercises`
2. Duplicate this repository
```bash
git clone --bare git@github.com:WildCodeSchool/js-exercises-boilerplate.git
cd js-exercises-boilerplate.git
git push --mirror git@github.com:WildCodeSchool/new-exercises
```
### Create your exercises

1. Write your tests in `index.test.js`
2. Write functions that fails tests in `index.js`
3. Comments each function with instructions to the students
4. Replace `README.md` with this :
```markdown
# YOUR TOPIC exercises

## Topic description

Describe these exercises topic

## How to complete

1. clone this repository
2. install with `npm install`
3. read instructions in `index.js`
4. run tests with `npm run test`
5. edit `index.js` to pass the tests
6. repeat steps 3 to 6 until every tests pass successfuly
```
