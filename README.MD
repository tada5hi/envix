# envix ⚙️

[![npm version][npm-version-src]][npm-version-href]
[![npm version][codecov-src]][codecov-href]
[![Master Workflow][workflow-src]][workflow-href]
[![Known Vulnerabilities][snyk-src]][snyk-href]
[![Conventional Commits][conventional-src]][conventional-href]


This library simplifies reading, transforming, and requiring environment variables across runtimes like Node.js, Deno, Bun.js, Browser, and more.

**Table of Contents**
- [Installation](#installation)
- [Usage](#usage)
  - [write](#write)
  - [read](#read)
  - [readArray](#read-array)
  - [readBool](#read-bool)
  - [readFloat](#read-float)
  - [readInt](#read-int)
  - [readNumber](#read-number)
  - [readNumberArray](#read-number-array)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install envix --save
```

## Usage

### Write
The write method makes it possible to set an environment variable retrospectively for later accesses.

```typescript
import { write } from 'envix';

write('foo', 'bar');
```

### Read
The read method accepts the key of the environment variable as the first argument and an
alternative value as the second argument, which is returned if the variable does not exist.
If no argument is passed, an object with all environment variables is returned.

```typescript
import { read, write } from 'envix';

write('foo', 'bar');

read('foo'); // string | undefined
// bar

read('bar', 'baz'); // string
// baz
```

### Read Array
The readArray method makes it possible to read an environment variable as a string array.
A fallback value can be defined as the second argument.
```typescript
import { readArray, write } from 'envix';

write('foo', 'bar,baz');

readArray('foo'); // string[] | undefined
// ['bar', 'baz']

readArray('bar', ['foo']); // string[]
// ['foo']
```

### Read Bool
The readBool method makes it possible to read an environment variable as a boolean.
A fallback value can be defined as the second argument.

```typescript
import { readBool, write } from 'envix';

write('foo', 'true');

readBool('foo'); // boolean | undefined
// true

readBool('bar', false); // boolean
// false
```

### Read Float
The readFloat method makes it possible to read an environment variable as a float.
A fallback value can be defined as the second argument.

```typescript
import { readFloat, write } from 'envix';

write('foo', '1');

readFloat('foo'); // number | undefined
// 1.0

readFloat('bar', 2.0); // number
// 2.0
```

### Read Int
The readInt method makes it possible to read an environment variable as a integer.
A fallback value can be defined as the second argument.

```typescript
import { readInt, write } from 'envix';

write('foo', '1.0');

readInt('foo'); // number | undefined
// 1

readInt('bar', 2); // number
// 2
```

### Read Number
The readNumber method makes it possible to read an environment variable as a number.
A fallback value can be defined as the second argument.

```typescript
import { readNumber, write } from 'envix';

write('foo', '1.0');

readNumber('foo'); // number | undefined
// 1.0

readNumber('bar', 2.0); // number
// 2.0
```

### Read Number Array
The readNumberArray method makes it possible to read an environment variable as a number array.
A fallback value can be defined as the second argument.

```typescript
import { readNumberArray, write } from 'envix';

write('foo', '1.0,2.1');

readNumberArray('foo'); // number[] | undefined
// [1.0,2.1]

readNumberArray('bar', [2,3]); // number[]
// [2,3]
```

## Contributing

Before starting to work on a pull request, it is important to review the guidelines for
[contributing](./CONTRIBUTING.md) and the [code of conduct](./CODE_OF_CONDUCT.md).
These guidelines will help to ensure that contributions are made effectively and are accepted.

## License

Made with 💚

Published under [MIT License](./LICENSE).

[npm-version-src]: https://badge.fury.io/js/envix.svg
[npm-version-href]: https://npmjs.com/package/envix
[codecov-src]: https://codecov.io/gh/Tada5hi/envix/branch/master/graph/badge.svg?token=4KNSG8L13V
[codecov-href]: https://codecov.io/gh/Tada5hi/envix
[workflow-src]: https://github.com/Tada5hi/envix/workflows/CI/badge.svg
[workflow-href]: https://github.com/Tada5hi/envix
[snyk-src]: https://snyk.io/test/github/Tada5hi/envix/badge.svg?targetFile=package.json
[snyk-href]: https://snyk.io/test/github/Tada5hi/envix?targetFile=package.json
[conventional-src]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white
[conventional-href]: https://conventionalcommits.org
