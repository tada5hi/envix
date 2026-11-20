# Project Structure

| Source | Responsibility |
|---|---|
| `src/module.ts` | `Envix` class: readers, `has` and `write` over an environment source |
| `src/instance.ts` | Default `envix` instance over the runtime source |
| `src/types.ts` | Key, source and reader option types |
| `src/errors/` | `EnvixError` and its `NotSetError`, `InvalidValueError` and `UnsupportedOperationError` subclasses; internal `utils.ts` is not exported |
| `src/helpers/` | Public free functions that delegate to the default instance, plus `orFail` and `oneOf` |
| `src/utils/` | Public parsers (`toInt`, `toFloat`, `toNumber`, `toArray`, `toNumberArray`, `toBool`, `toBoolArray`); internal `source.ts`, `strict.ts` and `options.ts` are not exported |
| `src/index.ts` | Public package exports |
| `tsdown.config.mts` | JavaScript build configuration |

The package exports map declares the package root, `./package.json`. Use these declared entrypoints under exports-aware resolution; undeclared `dist/` paths are not additional public exports. Preserve the declared output paths. `types.ts` files own shared type declarations; filesystem declaration paths and facades provide legacy compatibility only where the resolver supports them.

The build type-checks `src/` and `test/` through `build:types` (`test/tsconfig.json`), then runs tsdown, which emits `dist/index.mjs` and one bundled `dist/index.d.ts` without relative imports, so declarations resolve under both `Bundler` and `NodeNext` resolution. Generated `dist/` files are build artifacts.
