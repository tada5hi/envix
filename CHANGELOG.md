# Changelog

## [2.0.1](https://github.com/tada5hi/envix/compare/v2.0.0...v2.0.1) (2026-11-20)


### Bug Fixes

* support node 22 and newer ([a816407](https://github.com/tada5hi/envix/commit/a816407f5cf3aee71f5e5fe6518dcdf100bbf0fd))

## [2.0.0](https://github.com/tada5hi/envix/compare/v1.5.0...v2.0.0) (2026-11-20)


### ⚠ BREAKING CHANGES

* orFail throws NotSetError instead of a plain Error, with a different message.
* Node.js 24 or newer is required.
* envix is ESM-only. require('envix') only works on Node versions that support require(esm). Environment variables are read from globalThis.process.env only; import.meta.env, Deno.env and globalThis.__env__ are no longer consulted.

### Features

* add map option to array readers ([f6c3d62](https://github.com/tada5hi/envix/commit/f6c3d62b12f9bb185909b71ef8766f9a8705681c))
* add readBoolArray reader and toBoolArray parser ([85e8987](https://github.com/tada5hi/envix/commit/85e89874f80a05830c9c16bdee8de07a29abd0c8))
* deepen readers with options, Envix class and typed errors ([#71](https://github.com/tada5hi/envix/issues/71)) ([9060c30](https://github.com/tada5hi/envix/commit/9060c302b6a18cfeefb46e0140966b988e511f6a))
* reject NaN map results in number array readers ([780e94b](https://github.com/tada5hi/envix/commit/780e94ba8064222e11c20100adf48f861ceb4ae1))
* require node 24 ([656614a](https://github.com/tada5hi/envix/commit/656614a545c0a750a2561380ec5666af43407a02))
* upgrade dependencies and ship esm only ([45b8e8b](https://github.com/tada5hi/envix/commit/45b8e8be4310b6e859698c01a4e63ff1f6ded322))


### Bug Fixes

* read boolean words case-insensitively ([d926111](https://github.com/tada5hi/envix/commit/d9261117b4f0a7a7553a87a7365852b63255f803)), closes [#69](https://github.com/tada5hi/envix/issues/69)

## [1.5.0](https://github.com/tada5hi/envix/compare/v1.4.0...v1.5.0) (2024-02-12)


### Bug Fixes

* toArray accept arbitrary input ([b1800ee](https://github.com/tada5hi/envix/commit/b1800ee5ef1b5250aafc143fec16547343c82f1d))


### Features

* optimized readArray helpers & add test suite ([001ca2d](https://github.com/tada5hi/envix/commit/001ca2d36bf18c01833aa9cddf61867eb34b2752))

## [1.4.0](https://github.com/tada5hi/envix/compare/v1.3.0...v1.4.0) (2024-02-12)


### Bug Fixes

* expose utils directory ([cd00f35](https://github.com/tada5hi/envix/commit/cd00f35495919f9e8904b6766ea490cca8914949))


### Features

* toArray util & expose utils ([73df8b9](https://github.com/tada5hi/envix/commit/73df8b9c278d5a25edd9dde7f0f74bfc78c8fbbc))

## [1.3.0](https://github.com/tada5hi/envix/compare/v1.2.0...v1.3.0) (2024-02-09)


### Features

* add read-float helper ([282b834](https://github.com/tada5hi/envix/commit/282b834b4cd4b8ed7ea0459873a7e7e3e503afa5))
* optimized read-array & read-number-array helper & enhanced docs ([6dde86f](https://github.com/tada5hi/envix/commit/6dde86f48e5105c9b7c1ed7798f4b3cc9d2bdf99))

## [1.2.0](https://github.com/tada5hi/envix/compare/v1.1.0...v1.2.0) (2024-02-09)


### Features

* read-int helper implementation ([3ba0dca](https://github.com/tada5hi/envix/commit/3ba0dcab9e587a299a1c027e5a43cee63021db88))

## [1.1.0](https://github.com/tada5hi/envix/compare/v1.0.0...v1.1.0) (2024-02-09)


### Features

* rename set fn to write ([489ec09](https://github.com/tada5hi/envix/commit/489ec0971d306659d9ccaa5afc81770d0da8a02d))

## 1.0.0 (2024-02-08)


### Features

* initialized project ([b59cb2a](https://github.com/tada5hi/envix/commit/b59cb2abd7f10d430e446db54b2284f68c098df4))
