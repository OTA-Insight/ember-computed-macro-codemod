# ember-computed-macro-codemod


A codemod for converting Ember computed property macros (a.k.a. shorthands) to native getters in class syntax.

## Updating your codebase

The recommended Ember ESLint config [discourages computed property macros](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/require-computed-macros.md#configuration) for class based syntax. Instead, it recommends to use auto tracking and native getters. This codemod converts a subset (see support matrix) of all computed property macros to native getters.

See also:
- This codemod only runs on JavaScript Class syntax. If you haven't already, use the [ember-native-class](https://github.com/ember-codemods/ember-native-class-codemod) codemod to transform object syntax to class syntax.
- The [ember-tracked-properties](https://github.com/ember-codemods/ember-tracked-properties-codemod) codemod will further help you migrate from `@computed` to tracked properties.

## Usage

```
npx ember-computed-macro-codemod path/of/files/ or/some**/*glob.js
```

> **Warning**
> As with most codemods, changes are made in place, meaning it will overwrite existing files. Make sure to run this codemod on a codebase that has been checked into version control to avoid losing progress.

The codemod accepts the following options:

|        Option         |  Value  |             Default             |                                                                     Details                                                                      |
| --------------------- | ------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--macros`      | string | `alias,and,equal,gt,gte,lt,lte,or,readOnly`                          | Filter which computed macros should be transformed. By default, all supported ones are transformed.                                                                              |
| `--add-computed-decorator`      | boolean | `false`                          | Add the `@computed` decorator to the native getter for full compatibility. Skipping this works if all dependencies are auto tracked.<sup>1</sup>                                                                             |

<small>1. Computed property macros are computed properties, and thus only recompute once the dependency keys are updated. If you want to keep this behaviour, the `@cached` decorator should be added. This should however be used with caution, and is usually something you don't want. ([see docs](https://api.emberjs.com/ember/release/functions/@glimmer%2Ftracking/cached)) Alternatively, you can opt to readd the `@computed` decorator to keep compatible behaviour.</small>

## Basic example

Given the following input file:

```js
import { readOnly } from '@ember/object/computed';

class Foo {
  @readOnly('foo.bar') bar;
}
```

The codemod will rewrite this to use native getters:

```js
class Foo {
  get bar() {
    return this.foo?.bar;
  }
}
```

For a complete list of example transforms, see the [computed-macro](transforms/computed-macro/README.md) transform description.

## Support matrix

| Computed property macro   | Supported |
|------------------|-----------|
| alias            | ✅         |
| and              | ✅         |
| bool             | ❌         |
| collect          | ❌         |
| deprecatingAlias | ❌         |
| empty            | ❌         |
| equal            | ✅         |
| expandProperties | ❌         |
| filter           | ❌         |
| filterBy         | ❌         |
| gt               | ✅         |
| gte              | ✅         |
| intersect        | ❌         |
| lt               | ✅         |
| lte              | ✅         |
| map              | ❌         |
| mapBy            | ❌         |
| match            | ❌         |
| max              | ❌         |
| min              | ❌         |
| not              | ❌         |
| notEmpty         | ❌         |
| oneWay           | ❌         |
| or               | ✅         |
| readOnly         | ✅         |
| reads            | ❌         |
| setDiff          | ❌         |
| sort             | ❌         |
| sum              | ❌         |
| union            | ❌         |
| uniq             | ❌         |
| uniqBy           | ❌         |

### Known limitations

- Computed property macros with complex dependent keys are not supported (`@each`, `.{}`, `.[]`).
- Doesn't handle invalid usages of marcos, e.g. using `and`, `or` with only one argument.
- Expects you import computed macros from `@ember/object/computed`, instead of e.g. using `@computed.readOnly()`.


## Transforms

<!--TRANSFORMS_START-->
* [computed-macro](transforms/computed-macro/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`