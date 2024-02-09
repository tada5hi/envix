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
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install envix --save
```

## Usage

### Write

```typescript
import { write } from 'envix';

write('foo', 'bar');
```

### Read

```typescript
import { read, write } from 'envix';

write('foo', 'bar');

read('foo'); // string | undefined
// bar

read('bar', 'baz'); // string
// baz
```

### Read Array
```typescript
import { readArray, write } from 'envix';

write('foo', 'bar,baz');

readArray('foo'); // string[] | undefined
// ['bar', 'baz']
```

### Read Bool
```typescript
import { readBool, write } from 'envix';

write('foo', 'true');

readBool('foo'); // boolean | undefined
// true
```

### Read Int
```typescript
import { readInt, write } from 'envix';

write('foo', '1.0');

readInt('foo'); // number | undefined
// 1
```

### Read Number
```typescript
import { readNumber, write } from 'envix';

write('foo', '1.0');

readNumber('foo'); // number | undefined
// 1.0
```

### Read Number Array
```typescript
import { readNumberArray, write } from 'envix';

write('foo', '1.0,2.1');

readNumberArray('foo'); // number[] | undefined
// [1.0,2.1]
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
