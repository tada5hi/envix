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
        if (typeof key === 'undefined') {
            if (!this.source.keys) {
                throw new UnsupportedOperationError('The environment source does not support listing keys.');
            }

            const keys = this.source.keys();

            return Object.fromEntries(keys.map((name) => [name, this.source.read(name)]));
        }

        return this.resolve(key, (raw) => raw, options);
    }

    readArray(key: EnvixKey, options?: OptionalReadOptions<ArrayParseOptions>) : string[] | undefined;

    readArray<D>(key: EnvixKey, options: DefaultReadOptions<D, ArrayParseOptions>) : string[] | D;

    readArray(key: EnvixKey, options: RequiredReadOptions<ArrayParseOptions>) : string[];

    readArray<D>(key: EnvixKey, options?: ReadOptions<D> & ArrayParseOptions) : string[] | D | undefined;

    readArray(key: EnvixKey, options?: ReadOptions & ArrayParseOptions) : unknown {
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
