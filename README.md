# eBet

## Get started

- install common packages : `npm install`
- install packages listed in all packages.json: `lerna bootstrap`

## Commands to run projects

- run api: `yarn dev-api`
- run app: `yarn dev-app`
- run tests: `yarn tests`

## Lerna commands to dev

- install packages listed in all packages.json: `lerna bootstrap`
- install npm package in all subRepo: `lerna add packageName --dev`
- install npm package in specific subRepo: `lerna add packageName --scope MySubRepo --dev`
