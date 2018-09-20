# `lib-template`

Lots of boilerplate for a library maintained using Typescript + Webpack.

## Usage
    
    git clone https://github.com/cubing/lib-template.js lib-template
    cd lib-template

    # Make sure you have `node` and `yarn` installed before running this:
    yarn install

    # Run tests
    # (This runs `make dist` under the hood.)
    make test

    # Use the built library in the browser directly
    make dist
    open test/html/index.html

To build the output file continuously while working on input files, run `make dev`.

# Layout

Source files are in `src`. They are compiled into `dist/lib-template.js` using [Webpack](https://webpack.js.org/).

`dist` will also contain an additional `.d.ts` TypeScript definition file for each source file, as well as a `lib-template.js.map` [source map](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) for debugging.

Tests are written in `test/test.ts`. Run `make test` to run them.

Some notes:

- It should be possible to decipher the meaning of every part of this project using comments, code search, and Google. Feel free to ask a question by [filing an issue](https://github.com/cubing/lib-template.js/issues) if you are wondering why something is/isn't structured in a particular way.
- For a larger project based on this template, see [`alg.js`](https://github.com/cubing/alg.js).
- `dist/lib-template.js` is a [UMD module](https://github.com/umdjs/umd). That roughly means it can be used in the browser directly as well as in `node`. To set the name use by the library as a UMD module, set `package.json` → `umdName`.
- This module is set up for building a library, but can be adapted for commandline tools. You can also run `node dist/lib-template.js` directly.
- The output file name (`lib-template.js`) is taken from `package.json` → `main`, but can be configured directly in `webpack-config.json` if needed.
- This library can be used in other projects like this project itself uses `alg`. You can either:
  - Publish to `npm`.
  - Include this project as a `node_modules` folder in another project.
  - Run `yarn link` in this checkout and then `yarn link lib-template` to automatically symlink this project into another project's `node_modules` folder.
- TypeScript has some nice autocompletion support in many editors. Make sure to install it!
- This project has a `.travis.yml` file you can use to automatically test every commit you push to GitHub (with `make test`), using [Travis CI](https://travis-ci.org/). If you want this, you'll need to log into Travis CI and set it up for the repo. See [this page](https://travis-ci.org/cubing/lib-template.js) for an example.
- Yes, `node_modules` is expected to contain over 10,000 files. That's apparently how modern JS development is done these days. 🤷‍♀️

# Release Process

1) Update versions for `dependencies` in `package.json` if needed
  - Then run `yarn install` to update that dependency in `yarn.lock`.
2) Update `version` in `package.json`.
3) `git commit` with a summary of user-facing changes.
4) `git tag [version]`
5) `git push`
6) `npm publish`
  - This template has a `prepublishOnly` script that runs `make dist`. Make sure that `make dist` will produce a production build from any state of the project.
  - Or `yarn publish` once <https://github.com/yarnpkg/yarn/issues/4904> is fixed.
