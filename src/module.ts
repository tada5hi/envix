import { InvalidValueError, NotSetError, UnsupportedOperationError } from './errors';
import type {
    DefaultReadOptions,
    EnvixKey,
    EnvixOptions,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from './types';
import {
    toArray,
    toBool,
    toFloat,
    toInt,
    toNumber,
    toNumberArray,
} from './utils';
import { assertOptions } from './utils/options';
import { createRuntimeSource } from './utils/source';
import type { ArrayParseOptions, NumberArrayParseOptions, NumberParseOptions } from './utils';

export class Envix {
    protected source: EnvixOptions;

    /**
     * Without options, the instance uses the runtime environment:
     * process.env, then globalThis.__env__, then an in-memory record.
     */
    constructor(options?: EnvixOptions) {
        this.source = options ?? createRuntimeSource();

        // bind public methods, so they can be destructured or passed around
        this.read = this.read.bind(this);
        this.readArray = this.readArray.bind(this);
        this.readBool = this.readBool.bind(this);
        this.readFloat = this.readFloat.bind(this);
        this.readInt = this.readInt.bind(this);
        this.readNumber = this.readNumber.bind(this);
        this.readNumberArray = this.readNumberArray.bind(this);
        this.has = this.has.bind(this);
        this.write = this.write.bind(this);
    }

    // ---------------------------------------------------------------

    read() : Record<string, string | undefined>;

    read(key: EnvixKey, options?: OptionalReadOptions) : string | undefined;

    read<D>(key: EnvixKey, options: DefaultReadOptions<D>) : string | D;

    read(key: EnvixKey, options: RequiredReadOptions) : string;

    read<D>(key: EnvixKey, options?: ReadOptions<D>) : string | D | undefined;

    read(key?: EnvixKey, options?: ReadOptions) : unknown {
        assertOptions(options);

        if (typeof key === 'undefined') {
            if (!this.source.keys) {
                throw new UnsupportedOperationError('The environment source does not support listing keys.');
            }

            const entries : [string, string][] = [];

            for (const name of this.source.keys()) {
                const value = this.lookup(name);

                if (typeof value !== 'undefined') {
                    entries.push([name, value]);
                }
            }

            return Object.fromEntries(entries);
        }

        return this.resolve(key, (raw) => raw, options);
    }

    readArray<T = string>(key: EnvixKey, options?: OptionalReadOptions<ArrayParseOptions<T>>) : T[] | undefined;

    readArray<D, T = string>(key: EnvixKey, options: DefaultReadOptions<D, ArrayParseOptions<T>>) : T[] | D;

    readArray<T = string>(key: EnvixKey, options: RequiredReadOptions<ArrayParseOptions<T>>) : T[];

    readArray<D, T = string>(key: EnvixKey, options?: ReadOptions<D> & ArrayParseOptions<T>) : T[] | D | undefined;

    readArray(key: EnvixKey, options?: ReadOptions & ArrayParseOptions<unknown>) : unknown {
        return this.resolve(key, (raw) => toArray(raw, options), options);
    }

    readBool(key: EnvixKey, options?: OptionalReadOptions) : boolean | undefined;

    readBool<D>(key: EnvixKey, options: DefaultReadOptions<D>) : boolean | D;

    readBool(key: EnvixKey, options: RequiredReadOptions) : boolean;

    readBool<D>(key: EnvixKey, options?: ReadOptions<D>) : boolean | D | undefined;

    readBool(key: EnvixKey, options?: ReadOptions) : unknown {
        return this.resolve(key, (raw) => toBool(raw), options);
    }

    readFloat(key: EnvixKey, options?: OptionalReadOptions<NumberParseOptions>) : number | undefined;

    readFloat<D>(key: EnvixKey, options: DefaultReadOptions<D, NumberParseOptions>) : number | D;

    readFloat(key: EnvixKey, options: RequiredReadOptions<NumberParseOptions>) : number;

    readFloat<D>(key: EnvixKey, options?: ReadOptions<D> & NumberParseOptions) : number | D | undefined;

    readFloat(key: EnvixKey, options?: ReadOptions & NumberParseOptions) : unknown {
        return this.resolve(key, (raw) => toFloat(raw, options), options);
    }

    readInt(key: EnvixKey, options?: OptionalReadOptions<NumberParseOptions>) : number | undefined;

    readInt<D>(key: EnvixKey, options: DefaultReadOptions<D, NumberParseOptions>) : number | D;

    readInt(key: EnvixKey, options: RequiredReadOptions<NumberParseOptions>) : number;

    readInt<D>(key: EnvixKey, options?: ReadOptions<D> & NumberParseOptions) : number | D | undefined;

    readInt(key: EnvixKey, options?: ReadOptions & NumberParseOptions) : unknown {
        return this.resolve(key, (raw) => toInt(raw, options), options);
    }

    readNumber(key: EnvixKey, options?: OptionalReadOptions<NumberParseOptions>) : number | undefined;

    readNumber<D>(key: EnvixKey, options: DefaultReadOptions<D, NumberParseOptions>) : number | D;

    readNumber(key: EnvixKey, options: RequiredReadOptions<NumberParseOptions>) : number;

    readNumber<D>(key: EnvixKey, options?: ReadOptions<D> & NumberParseOptions) : number | D | undefined;

    readNumber(key: EnvixKey, options?: ReadOptions & NumberParseOptions) : unknown {
        return this.resolve(key, (raw) => toNumber(raw, options), options);
    }

    readNumberArray(key: EnvixKey, options?: OptionalReadOptions<NumberArrayParseOptions>) : number[] | undefined;

    readNumberArray<D>(key: EnvixKey, options: DefaultReadOptions<D, NumberArrayParseOptions>) : number[] | D;

    readNumberArray(key: EnvixKey, options: RequiredReadOptions<NumberArrayParseOptions>) : number[];

    readNumberArray<D>(key: EnvixKey, options?: ReadOptions<D> & NumberArrayParseOptions) : number[] | D | undefined;

    readNumberArray(key: EnvixKey, options?: ReadOptions & NumberArrayParseOptions) : unknown {
        return this.resolve(key, (raw) => toNumberArray(raw, options), options);
    }

    has(key: string) : boolean {
        return typeof this.lookup(key) !== 'undefined';
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
     * Read a key from the source. Only string values count as set, so
     * inherited members (toString) and bindings (KV objects) of plain
     * records are never returned.
     */
    protected lookup(key: string) : string | undefined {
        const value : unknown = this.source.read(key);

        return typeof value === 'string' ? value : undefined;
    }

    /**
     * Look up the first set key, parse its value and apply default or required.
     * A set value that does not parse never falls through to later keys.
     */
    protected resolve<T>(
        key: EnvixKey,
        parse: (raw: string) => T | undefined,
        options: ReadOptions = {},
    ) : unknown {
        assertOptions(options);

        const keys = Array.isArray(key) ? key : [key];

        for (const name of keys) {
            const raw = this.lookup(name);

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
