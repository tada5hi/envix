import { InvalidValueError, NotSetError, UnsupportedOperationError } from './errors';
import type {
    DefaultReadOptions,
    EnvixKey,
    EnvixOptions,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from './types';
import { createRuntimeSource } from './utils/source';

export class Envix {
    protected source: EnvixOptions;

    /**
     * Without options, the instance uses the runtime environment:
     * process.env, then globalThis.__env__, then an in-memory record.
     */
    constructor(options?: EnvixOptions) {
        this.source = options ?? createRuntimeSource();
    }

    // ---------------------------------------------------------------

    read() : Record<string, string | undefined>;

    read(key: EnvixKey, options?: OptionalReadOptions) : string | undefined;

    read<D>(key: EnvixKey, options: DefaultReadOptions<D>) : string | D;

    read(key: EnvixKey, options: RequiredReadOptions) : string;

    read<D>(key: EnvixKey, options?: ReadOptions<D>) : string | D | undefined;

    read(key?: EnvixKey, options?: ReadOptions) : unknown {
        if (typeof key === 'undefined') {
            if (!this.source.keys) {
                throw new UnsupportedOperationError('The environment source does not support listing keys.');
            }

            const keys = this.source.keys();

            return Object.fromEntries(keys.map((name) => [name, this.source.read(name)]));
        }

        return this.resolve(key, (raw) => raw, options);
    }

    has(key: string) : boolean {
        return typeof this.source.read(key) !== 'undefined';
    }

    write(key: string, value: string | undefined) : void {
        if (!this.source.write) {
            throw new UnsupportedOperationError({
                message: 'The environment source does not support writing.',
                keys: [key],
            });
        }

        this.source.write(key, value);
    }

    // ---------------------------------------------------------------

    /**
     * Look up the first set key, parse its value and apply default or required.
     * A set value that does not parse never falls through to later keys.
     */
    protected resolve<T>(
        key: EnvixKey,
        parse: (raw: string) => T | undefined,
        options: ReadOptions = {},
    ) : unknown {
        const keys = Array.isArray(key) ? key : [key];

        for (const name of keys) {
            const raw = this.source.read(name);

            if (typeof raw === 'undefined') {
                continue;
            }

            const value = parse(raw);

            if (typeof value !== 'undefined') {
                return value;
            }

            if (options.required) {
                throw new InvalidValueError({ keys: [name] });
            }

            return options.default;
        }

        if (options.required) {
            throw new NotSetError({ keys });
        }

        return options.default;
    }
}
