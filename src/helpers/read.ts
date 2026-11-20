import { envix } from '../instance';
import type {
    DefaultReadOptions,
    EnvixKey,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from '../types';
import { assertOptions } from '../utils/options';

export function read() : Record<string, string | undefined>;

export function read(key: EnvixKey, options?: OptionalReadOptions) : string | undefined;

export function read<D>(key: EnvixKey, options: DefaultReadOptions<D>) : string | D;

export function read(key: EnvixKey, options: RequiredReadOptions) : string;

export function read<D>(key: EnvixKey, options?: ReadOptions<D>) : string | D | undefined;

export function read(key?: EnvixKey, options?: ReadOptions) : unknown {
    assertOptions(options);

    if (typeof key === 'undefined') {
        return envix.read();
    }

    return envix.read(key, options);
}
