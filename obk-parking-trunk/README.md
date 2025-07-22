# obk-parking

## Usage
1. Clone this repo sitory
2. Search all text 'obk-parking' and replace with your app name
3. Run `yarn` to install packages
4. Run `yarn openapi:build` to generate openapi specs
5. To test, run `yarn dev`. You will see an error if there is no model defined in prisma.schema. Now check `localhost:3000/docs`, you should see test endpoint. Don't forget to remove this endpoint

## Caution
- `yarn test` will not work unless you already have defined a model.
- If you intend to export api sdk, update package.json inside sdk directory.
