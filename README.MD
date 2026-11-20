<p align="center">
    <img src="./.github/assets/logo.svg" alt="envix" width="128" height="128" />
</p>

<h1 align="center">envix</h1>

<p align="center">
    <b>Read environment variables as numbers, booleans and lists, with typed fallbacks.</b><br>
    No more <code>Number(process.env.PORT ?? 3000)</code> or <code>=== 'true'</code> checks scattered through your config,<br>
    and no <code>string | undefined</code> where you meant <code>number</code>.
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/envix"><img src="https://img.shields.io/npm/v/envix" alt="npm version" /></a>
    <a href="https://github.com/tada5hi/envix/actions/workflows/main.yml"><img src="https://github.com/tada5hi/envix/actions/workflows/main.yml/badge.svg" alt="CI" /></a>
    <a href="https://codecov.io/gh/tada5hi/envix"><img src="https://codecov.io/gh/tada5hi/envix/branch/master/graph/badge.svg?token=4KNSG8L13V" alt="Coverage" /></a>
    <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white" alt="Conventional Commits" /></a>
</p>

<p align="center">
    <a href="#installation"><b>Installation</b></a>
    ·
    <a href="#usage">Usage</a>
    ·
    <a href="#required-values-and-precedence">Required values</a>
    ·
    <a href="#api">API</a>
    ·
    <a href="#notes">Notes</a>
</p>

---

## Why envix?

Every environment variable is a string or missing. Most projects turn them into config values with one-off expressions: `Number(process.env.PORT)` here, `process.env.DEBUG === 'true'` there, a `.split(',')` for lists. Each one quietly gets an edge case wrong, and TypeScript types all of them as `string | undefined`.

envix is that conversion layer, written once:

| Concern | Hand-written | envix |
|---|---|---|
| **Numbers** | `Number(process.env.PORT ?? 3000)` gives `NaN` when `PORT=abc` | `readInt('PORT', 3000)` returns `3000` when the value does not parse |
| **Booleans** | `=== 'true'` misses `TRUE`, `1` and `' true '` | `readBool('DEBUG', false)` accepts `true`/`t`/`1` and `false`/`f`/`0`, trimmed, in any case |
| **Lists** | `.split(',')` keeps spaces and empty entries | `readArray('ORIGINS', [])` trims every entry and drops empty ones |
| **Types** | `string \| undefined`, narrowed by hand | `number` when you pass a fallback, `number \| undefined` when you don't |
| **Required values** | an `if (!value) throw` per variable | `orFail(read('DATABASE_URL'))` returns `string` or throws |
| **Several names for one setting** | chains of `??` | `oneOf([read('APP_REGION'), read('AWS_REGION')])` |

A config module with envix:

```typescript
import { oneOf, orFail, read, readArray, readBool, readInt } from 'envix';

export const config = {
    port: readInt('PORT', 3000), // number
    debug: readBool('DEBUG', false), // boolean
    origins: readArray('CORS_ORIGINS', []), // string[]
    databaseUrl: orFail(read('DATABASE_URL')), // string, throws when unset
    region: oneOf([read('APP_REGION'), read('AWS_REGION')]), // string | undefined
};
```

Every typed reader works the same way: look the key up, parse the string, and use the fallback when the key is missing **or** the value does not parse.

<p align="center">
    <img src="./.github/assets/read-flow.svg" alt="readInt('PORT', 3000) looks up PORT in process.env. When PORT is set, its string is parsed with toInt: a number such as 8080 is returned, and a value that does not parse, such as abc, falls back to 3000. When PORT is not set, the fallback 3000 is returned without parsing. Without a fallback the result is undefined, and orFail(readInt('PORT')) throws instead." width="100%" />
</p>

**Table of Contents**
- [Installation](#installation)
- [Usage](#usage)
  - [Write](#write)
  - [Has](#has)
  - [Read](#read)
  - [Read Array](#read-array)
  - [Read Bool](#read-bool)
  - [Read Float](#read-float)
  - [Read Int](#read-int)
  - [Read Number](#read-number)
  - [Read Number Array](#read-number-array)
- [Required values and precedence](#required-values-and-precedence)
- [API](#api)
- [Notes](#notes)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install envix --save
```

envix is published as an ES module and requires Node.js 24 or newer. Its only dependency is [std-env](https://github.com/unjs/std-env). It reads `globalThis.process.env`, so it also works in Deno and Bun, which provide that object.

## Usage

Each reader parses the raw string differently. The same value can give different results:

<p align="center">
    <img src="./.github/assets/parsers.svg" alt="The same environment value read with each envix reader. 8080 is 8080 for every number reader. 1.9 is 1 for readInt and 1.9 for readFloat and readNumber. 12px is 12 for readInt and readFloat but undefined for readNumber. 0x10 is 0 for readInt and readFloat and 16 for readNumber. 0 is 0 for the number readers and false for readBool. TRUE with surrounding spaces is true for readBool. a, b ,,c is a, b, c for readArray. An empty string is 0 for readNumber and an empty array for readArray. A reader that returns undefined returns your fallback instead, when you pass one." width="100%" />
</p>

### Write

`write` sets an environment variable after the process has started, so later reads see it. Passing `undefined` removes the variable.

```typescript
import { write } from 'envix';

write('foo', 'bar');

write('foo', undefined); // removes foo
```

### Has

`has` checks whether a variable is set, also when its value is an empty string.

```typescript
import { has, write } from 'envix';

write('foo', '');

has('foo'); // true
has('bar'); // false
```

### Read

`read` accepts the key of the environment variable as the first argument and a fallback as the second, which is returned if the variable is not set.
Called without arguments, it returns an object with all environment variables.

```typescript
import { read, write } from 'envix';

write('foo', 'bar');

read('foo'); // string | undefined
// 'bar'

read('bar', 'baz'); // string
// 'baz'

read(); // Record<string, string | undefined>
```

### Read Array

`readArray` reads an environment variable as a string array. It splits the value on `,`, trims every entry and drops empty entries.
A fallback can be passed as the second argument.

```typescript
import { readArray, write } from 'envix';

write('foo', 'bar, baz,,');

readArray('foo'); // string[] | undefined
// ['bar', 'baz']

readArray('bar', ['foo']); // string[]
// ['foo']
```

### Read Bool

`readBool` reads an environment variable as a boolean. `true`, `t` and `1` are `true`; `false`, `f` and `0` are `false`. Surrounding whitespace and letter case are ignored. Any other value, such as `yes`, gives the fallback.
A fallback can be passed as the second argument.

```typescript
import { readBool, write } from 'envix';

write('foo', 'TRUE');

readBool('foo'); // boolean | undefined
// true

readBool('bar', false); // boolean
// false
```

### Read Float

`readFloat` reads an environment variable as a floating point number, using `Number.parseFloat`.
A fallback can be passed as the second argument.

```typescript
import { readFloat, write } from 'envix';

write('foo', '1.5');

readFloat('foo'); // number | undefined
// 1.5

readFloat('bar', 2.5); // number
// 2.5
```

### Read Int

`readInt` reads an environment variable as an integer, using `Number.parseInt` with radix 10. Decimals are cut off, not rounded.
A fallback can be passed as the second argument.

```typescript
import { readInt, write } from 'envix';

write('foo', '1.9');

readInt('foo'); // number | undefined
// 1

readInt('bar', 2); // number
// 2
```

### Read Number

`readNumber` reads an environment variable as a number, using `Number()`. Unlike `readInt` and `readFloat`, it rejects trailing text such as `12px` and accepts hexadecimal such as `0x10`.
A fallback can be passed as the second argument.

```typescript
import { readNumber, write } from 'envix';

write('foo', '1.5');

readNumber('foo'); // number | undefined
// 1.5

readNumber('bar', 2.5); // number
// 2.5
```

### Read Number Array

`readNumberArray` reads an environment variable as a list of numbers. Entries are split like `readArray` and converted like `readNumber`. If any entry is not a number, the whole result is `undefined`.
It takes no fallback argument; use `??` for a default.

```typescript
import { readNumberArray, write } from 'envix';

write('foo', '1.5, 2');

readNumberArray('foo'); // number[] | undefined
// [1.5, 2]

write('foo', '1, x');

readNumberArray('foo') ?? [2, 3]; // number[]
// [2, 3]
```

## Required values and precedence

`orFail` turns an optional value into a required one: it returns the value with `undefined` removed from its type, or throws `Error('The environment variable could not be read.')`.

```typescript
import { orFail, readInt } from 'envix';

const port = orFail(readInt('PORT')); // number, throws when PORT is unset or not an integer
```

`oneOf` returns the first entry of an array that is not `undefined`. Use it when one setting can come from several variables, with the most specific one first.

```typescript
import { oneOf, orFail, read } from 'envix';

const region = oneOf([read('APP_REGION'), read('AWS_REGION')]); // string | undefined

const url = orFail(oneOf([read('DATABASE_URL'), read('POSTGRES_URL')])); // string
```

## API

| Export | Signature | Purpose |
|---|---|---|
| `read` | `read()`, `read(key)`, `read(key, alt)` | Raw string value, or all variables |
| `readArray` | `readArray(key)`, `readArray(key, alt)` | Comma-separated list of trimmed, non-empty strings |
| `readBool` | `readBool(key)`, `readBool(key, alt)` | `true`/`t`/`1` or `false`/`f`/`0`, case-insensitive |
| `readFloat` | `readFloat(key)`, `readFloat(key, alt)` | `Number.parseFloat` |
| `readInt` | `readInt(key)`, `readInt(key, alt)` | `Number.parseInt(value, 10)` |
| `readNumber` | `readNumber(key)`, `readNumber(key, alt)` | `Number(value)` |
| `readNumberArray` | `readNumberArray(key)` | List of numbers, `undefined` if any entry is not one |
| `has` | `has(key)` | Whether the variable is set |
| `write` | `write(key, value)` | Set a variable, or remove it with `undefined` |
| `orFail` | `orFail(value)` | Return `value` without `undefined`, or throw |
| `oneOf` | `oneOf(values)` | First entry that is not `undefined` |
| `toArray`, `toBool`, `toFloat`, `toInt`, `toNumber` | `toX(value)` | The parsers behind the readers, for values that do not come from the environment. `toArray` takes an optional separator (default `,`) |

The fallback `alt` can have any type. The return type is the parsed type or the fallback's type, so `readInt('PORT', null)` returns `number | null`.

## Notes

- **A value that does not parse gives the fallback.** `PORT=abc` with `readInt('PORT', 3000)` returns `3000`, the same as an unset `PORT`. Use `has('PORT')` if you need to tell the two apart.
- **An empty value is still set.** `read('KEY')` returns `''` for `KEY=`, not the fallback. `readNumber` turns it into `0` and `readArray` into `[]`.
- **`readInt` and `readFloat` stop at the first character that does not belong to a number.** `12px` is `12` and `0x10` is `0`. Use `readNumber` to reject such values.
- **`write` changes `process.env`.** Every later read in the same process sees the value, including reads by other libraries. In a runtime without `process`, envix reads and writes an empty in-memory object.
- **Build-time variables are not read.** `import.meta.env` (Vite and similar bundlers) and `Deno.env` without `process` are not sources; only `globalThis.process.env` is.

## Contributing

Before starting to work on a pull request, it is important to review the guidelines for
[contributing](./CONTRIBUTING.md) and the [code of conduct](./CODE_OF_CONDUCT.md).
These guidelines will help to ensure that contributions are made effectively and are accepted.

## License

Made with 💚

Published under [MIT License](./LICENSE).
