<p align="center">
    <img src="./.github/assets/logo.svg" alt="envix" width="128" height="128" />
</p>

<h1 align="center">envix</h1>

<p align="center">
    <b>Read environment variables as numbers, booleans and lists, with typed defaults and required values.</b><br>
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
    <a href="#reader-options">Options</a>
    ·
    <a href="#required-values-and-precedence">Required values</a>
    ·
    <a href="#custom-sources">Custom sources</a>
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
| **Numbers** | `Number(process.env.PORT ?? 3000)` gives `NaN` when `PORT=abc` | `readInt('PORT', { default: 3000 })` returns `3000` when the value does not parse |
| **Booleans** | `=== 'true'` misses `TRUE`, `1` and `' true '` | `readBool('DEBUG', { default: false })` accepts `true`/`t`/`1` and `false`/`f`/`0`, trimmed, in any case |
| **Lists** | `.split(',')` keeps spaces and empty entries | `readArray('ORIGINS', { default: [] })` trims every entry and drops empty ones |
| **Types** | `string \| undefined`, narrowed by hand | `number` with a default or `required`, `number \| undefined` without |
| **Required values** | an `if (!value) throw` per variable | `read('DATABASE_URL', { required: true })` returns `string` or throws a typed error |
| **Several names for one setting** | chains of `??` | `read(['APP_REGION', 'AWS_REGION'])`: the first key that is set wins |

A config module with envix:

```typescript
import { read, readArray, readBool, readInt } from 'envix';

export const config = {
    port: readInt('PORT', { default: 3000 }), // number
    debug: readBool('DEBUG', { default: false }), // boolean
    origins: readArray('CORS_ORIGINS', { default: [] }), // string[]
    databaseUrl: read('DATABASE_URL', { required: true }), // string, throws when unset
    region: read(['APP_REGION', 'AWS_REGION']), // string | undefined
};
```

Every typed reader works the same way: look the key up, parse the string, and use the default when the key is missing **or** the value does not parse.

<p align="center">
    <img src="./.github/assets/read-flow.svg" alt="readInt('PORT', { default: 3000 }) looks up PORT in the environment source. When PORT is set, its string is parsed with toInt: a number such as 8080 is returned, and a value that does not parse, such as abc, gives the default 3000. When PORT is not set, the default 3000 is returned without parsing. Without a default the result is undefined, and with { required: true } the reader throws NotSetError or InvalidValueError instead." width="100%" />
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
- [Reader options](#reader-options)
- [Required values and precedence](#required-values-and-precedence)
- [Errors](#errors)
- [Custom sources](#custom-sources)
- [API](#api)
- [Notes](#notes)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install envix --save
```

envix is published as an ES module and requires Node.js 24 or newer. Its only dependency is [@ebec/core](https://www.npmjs.com/package/@ebec/core), which its error classes build on.

The free functions read the runtime environment. On every call envix uses the first source that exists: `globalThis.process.env` (Node.js, Deno, Bun), then `globalThis.__env__` (for example Nitro and some Cloudflare setups), then an in-memory record (browsers and other runtimes). Sources are never merged. To read anything else, such as `import.meta.env`, create an [`Envix` instance](#custom-sources).

## Usage

Each reader parses the raw string differently. The same value can give different results:

<p align="center">
    <img src="./.github/assets/parsers.svg" alt="The same environment value read with each envix reader. 8080 is 8080 for every number reader. 1.9 is 1 for readInt and 1.9 for readFloat and readNumber. 12px is 12 for readInt and readFloat but undefined for readNumber. 0x10 is 0 for readInt and readFloat and 16 for readNumber. 0 is 0 for the number readers and false for readBool. TRUE with surrounding spaces is true for readBool. a, b ,,c is a, b, c for readArray. An empty string is undefined for every number reader and readBool, and an empty array for readArray. A reader that returns undefined returns your default instead, when you pass one, or throws with required." width="100%" />
</p>

Every reader takes a key, or a [list of keys](#required-values-and-precedence), and an optional [options object](#reader-options).

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

`read` returns the raw string. Called without arguments, it returns an object with all environment variables.

```typescript
import { read, write } from 'envix';

write('foo', 'bar');

read('foo'); // string | undefined
// 'bar'

read('bar', { default: 'baz' }); // string
// 'baz'

read(); // Record<string, string | undefined>
```

### Read Array

`readArray` splits the value on `,` (or `separator`), trims every entry and drops empty entries. `min` and `max` bound the number of entries.

```typescript
import { readArray, write } from 'envix';

write('foo', 'bar, baz,,');

readArray('foo'); // string[] | undefined
// ['bar', 'baz']

readArray('bar', { default: ['foo'] }); // string[]
// ['foo']

write('path', '/usr/bin:/bin');

readArray('path', { separator: ':', max: 1, default: [] });
// [], since the value has two entries
```

### Read Bool

`readBool` reads `true`, `t` and `1` as `true`, and `false`, `f` and `0` as `false`. Surrounding whitespace and letter case are ignored. Any other value, such as `yes`, gives the default.

```typescript
import { readBool, write } from 'envix';

write('foo', 'TRUE');

readBool('foo'); // boolean | undefined
// true

readBool('bar', { default: false }); // boolean
// false
```

### Read Float

`readFloat` uses `Number.parseFloat`, or plain decimal notation only with `strict`.

```typescript
import { readFloat, write } from 'envix';

write('foo', '1.5');

readFloat('foo'); // number | undefined
// 1.5

readFloat('bar', { default: 2.5 }); // number
// 2.5
```

### Read Int

`readInt` uses `Number.parseInt` with radix 10, so decimals are cut off, not rounded. With `strict`, the value must be a whole safe integer.

```typescript
import { readInt, write } from 'envix';

write('foo', '1.9');

readInt('foo'); // number | undefined
// 1

readInt('foo', { strict: true, default: 2 }); // number
// 2, since 1.9 is not an integer
```

### Read Number

`readNumber` uses `Number()`. Unlike `readInt` and `readFloat`, it rejects trailing text such as `12px` and accepts hexadecimal such as `0x10`. An empty or blank value gives the default.

```typescript
import { readNumber, write } from 'envix';

write('foo', '1.5');

readNumber('foo'); // number | undefined
// 1.5

readNumber('bar', { default: 2.5 }); // number
// 2.5
```

### Read Number Array

`readNumberArray` splits entries like `readArray` and converts each like `readNumber`. If any entry is not a number, the whole value gives the default.

```typescript
import { readNumberArray, write } from 'envix';

write('foo', '1.5, 2');

readNumberArray('foo'); // number[] | undefined
// [1.5, 2]

write('foo', '1, x');

readNumberArray('foo', { default: [2, 3] }); // number[]
// [2, 3]
```

## Reader options

| Option | Readers | Default | Effect |
|---|---|---|---|
| `default` | all | `undefined` | Returned when no key is set or the value does not parse. Any type: `readInt('PORT', { default: null })` returns `number \| null` |
| `required` | all | `false` | Throw instead of returning `undefined`. The return type drops `undefined`. Cannot be combined with `default` |
| `strict` | `readInt`, `readFloat`, `readNumber`, `readNumberArray` | `false` | The whole trimmed value must be plain decimal notation: `42`, `-7`, `+3` for `readInt` (safe integers only), also `1.5`, `-.5`, `1e3` for the others. Rejects `12px`, `0x10`, `Infinity`, `NaN`, and `12.9` for `readInt` |
| `separator` | `readArray`, `readNumberArray` | `','` | String to split the value on |
| `min` | `readArray`, `readNumberArray` | `0` | Minimum number of entries, after trimming and dropping empty ones |
| `max` | `readArray`, `readNumberArray` | none | Maximum number of entries |

A value that breaks `strict`, `min` or `max` counts as a value that does not parse: it gives the default, or throws with `required`.

```typescript
import { readInt } from 'envix';

// @ts-expect-error default and required are mutually exclusive
readInt('PORT', { default: 3000, required: true });
```

## Required values and precedence

`required: true` turns an optional value into a required one: the reader returns the parsed type without `undefined`, or throws a [`NotSetError`](#errors) when the key is not set and an `InvalidValueError` when its value does not parse.

```typescript
import { readInt } from 'envix';

const port = readInt('PORT', { required: true }); // number
```

Pass a list of keys when one setting can come from several variables, with the most specific one first. The first key that is set wins, also with an empty value. If that value does not parse, the reader gives the default (or throws with `required`); it never falls through to later keys.

```typescript
import { read } from 'envix';

const region = read(['APP_REGION', 'AWS_REGION']); // string | undefined

const url = read(['DATABASE_URL', 'POSTGRES_URL'], { required: true }); // string
```

For values that do not come from envix, `orFail(value, key?)` returns the value without `undefined`, or throws a `NotSetError` naming the key(s). `oneOf(values)` returns the first entry that is not `undefined`.

```typescript
import { oneOf, orFail } from 'envix';

const secrets = new Map<string, string>([['TOKEN', 's3cr3t']]);

const token = orFail(oneOf([secrets.get('API_TOKEN'), secrets.get('TOKEN')]), ['API_TOKEN', 'TOKEN']); // string
```

## Errors

All errors extend `EnvixError`, which builds on [@ebec/core](https://www.npmjs.com/package/@ebec/core). Each one has a `code` and the `keys` it refers to. Messages and properties never include the value, since it may be a secret.

| Error | `code` | Thrown when |
|---|---|---|
| `NotSetError` | `NOT_SET_ERROR` | `required` is set and no key is set, or `orFail` gets `undefined` |
| `InvalidValueError` | `INVALID_VALUE_ERROR` | `required` is set and the first set value does not parse or breaks `strict`, `min` or `max` |
| `UnsupportedOperationError` | `UNSUPPORTED_OPERATION_ERROR` | The source has no `write` or `keys` for `write()` or `read()` without a key |
| `EnvixError` | `ENVIX_ERROR` | Base class |

```typescript
import { InvalidValueError, NotSetError, readInt } from 'envix';

try {
    readInt(['PORT', 'HTTP_PORT'], { required: true, strict: true });
} catch (error) {
    if (error instanceof NotSetError) {
        console.error(error.code, error.keys); // 'NOT_SET_ERROR', ['PORT', 'HTTP_PORT']
    } else if (error instanceof InvalidValueError) {
        console.error(error.message); // 'Environment variable PORT has an invalid value.'
    }
}
```

## Custom sources

The free functions are bound methods of the default instance `envix`. Create your own `Envix` instance to read from another source, such as `import.meta.env`, a secrets map or a test record. A source needs `read`; `write` and `keys` are optional, and calling `write()` or `read()` without a key on a source that lacks them throws an `UnsupportedOperationError`.

```typescript
import { Envix } from 'envix';

const env = new Envix({
    read: (key) => import.meta.env[key],
});

const port = env.readInt('PORT', { default: 3000 }); // number
```

```typescript
import { Envix } from 'envix';

const values : Record<string, string | undefined> = { DEBUG: 'true' };

const { readBool, write } = new Envix({
    read: (key) => values[key],
    write: (key, value) => {
        values[key] = value;
    },
    keys: () => Object.keys(values),
});

readBool('DEBUG'); // true
write('DEBUG', '0');
```

Methods are bound, so they can be destructured. `new Envix()` without options reads the runtime environment, like the default instance.

## API

| Export | Signature | Purpose |
|---|---|---|
| `read` | `read()`, `read(key, options?)` | Raw string value, or all variables |
| `readArray` | `readArray(key, options?)` | Separated list of trimmed, non-empty strings |
| `readBool` | `readBool(key, options?)` | `true`/`t`/`1` or `false`/`f`/`0`, case-insensitive |
| `readFloat` | `readFloat(key, options?)` | `Number.parseFloat`, or plain decimal with `strict` |
| `readInt` | `readInt(key, options?)` | `Number.parseInt(value, 10)`, or a safe integer with `strict` |
| `readNumber` | `readNumber(key, options?)` | `Number(value)`, or plain decimal with `strict` |
| `readNumberArray` | `readNumberArray(key, options?)` | List of numbers, the default if any entry is not one |
| `has` | `has(key)` | Whether the variable is set |
| `write` | `write(key, value)` | Set a variable, or remove it with `undefined` |
| `orFail` | `orFail(value, key?)` | Return `value` without `undefined`, or throw `NotSetError` |
| `oneOf` | `oneOf(values)` | First entry that is not `undefined` |
| `Envix` | `new Envix(source?)` | Readers, `has` and `write` over a custom source |
| `envix` | | The default instance over the runtime environment |
| `toInt`, `toFloat`, `toNumber` | `toX(value, { strict? })` | The number parsers behind the readers |
| `toArray`, `toNumberArray` | `toX(value, { separator?, min?, max?, strict? })` | The list parsers; `strict` applies to `toNumberArray` |
| `toBool` | `toBool(value)` | The boolean parser |
| `EnvixError`, `NotSetError`, `InvalidValueError`, `UnsupportedOperationError` | | See [Errors](#errors) |

`key` is a string or a list of strings. The parsers return `undefined` for a value that does not parse, and are useful for values that do not come from the environment.

## Notes

- **A value that does not parse gives the default.** `PORT=abc` with `readInt('PORT', { default: 3000 })` returns `3000`, the same as an unset `PORT`. Use `has('PORT')` or `required` if you need to tell the two apart.
- **An empty value is still set.** `read('KEY')` returns `''` for `KEY=`, not the default, and `readArray` and `readNumberArray` return `[]` (unless `min` is above 0). The number readers and `readBool` treat it as a value that does not parse. In a key list, an empty value still wins over later keys.
- **`readInt` and `readFloat` stop at the first character that does not belong to a number.** `12px` is `12` and `0x10` is `0`. Use `strict` or `readNumber` to reject such values.
- **`write` changes the runtime source.** With `process.env`, every later read in the same process sees the value, including reads by other libraries.
- **Only string values count as set.** This holds for every source, so inherited members such as `toString` and non-string bindings (for example a Cloudflare KV namespace in a custom source) read as unset.
- **Options must be an object.** A call in the style of the previous API, such as `readInt('PORT', 3000)` or `toArray(value, ';')`, throws a `TypeError` instead of silently ignoring the argument.
- **Build-time variables are not read by default.** `import.meta.env` (Vite and similar bundlers) is not a runtime source; read it through a [custom source](#custom-sources).

## Contributing

Before starting to work on a pull request, it is important to review the guidelines for
[contributing](./CONTRIBUTING.md) and the [code of conduct](./CODE_OF_CONDUCT.md).
These guidelines will help to ensure that contributions are made effectively and are accepted.

## License

Made with 💚

Published under [MIT License](./LICENSE).
