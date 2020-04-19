# eBet-api

## Heroku manual deployment of lerna package

-   From root lerna project, run `git subtree push --prefix packages/api heroku master`

## Heroku automated deployment of lerna package

-   Use subdir-heroku-buildpack (https://github.com/timanovsky/subdir-heroku-buildpack, https://stackoverflow.com/questions/39197334/automated-heroku-deploy-from-subfolder/53221996#53221996)
