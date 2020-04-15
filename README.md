# eBet

## Lerna commands

- install packages listed in all packages.json: `lerna bootstrap`
- install npm package in all subRepo: `lerna add packageName --dev`
- install npm package in specific subRepo: `lerna add packageName --scope MySubRepo --dev`
- run api: `lerna run dev --scope api --stream`
- run app: `lerna run start --scope app --stream --npm-client=yarn`
