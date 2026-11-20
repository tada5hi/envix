# Glossary

**Reader**: A function such as `readInt` or `readArray` that looks up a key in an environment source and parses its value into a typed result. Every reader takes a key or key list and an optional options object.

**Parser**: A function such as `toInt` or `toArray` that turns a raw string into a typed value, or `undefined` when the string does not parse. Readers use parsers; parsers never touch an environment source.

**Environment source**: Where an `Envix` instance reads and writes values, given as `read` and optional `write` and `keys` functions. The default runtime source is the first available of `process.env`, `globalThis.__env__` and an in-memory record.

**Default**: The value a reader returns when no key is set or the value does not parse. It can have any type, and the reader's return type includes it.

**Key list**: Several keys for one setting, in order of precedence. The first key that is set wins, even with an empty value; its value decides the result without falling through to later keys.

**Strict**: A number parsing mode that accepts only plain decimal notation for the whole trimmed value. It rejects values such as `12px`, `0x10` and `Infinity` that the lenient parsers accept.

**Required**: A reader option that replaces `undefined` with an error: `NotSetError` when no key is set, `InvalidValueError` when the value does not parse. It cannot be combined with a default.
