import { envix } from '../instance';
import type {
    DefaultReadOptions,
    EnvixKey,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from '../types';
import type { ArrayParseOptions } from '../utils';

export function readArray<T = string>(key: EnvixKey, options?: OptionalReadOptions<ArrayParseOptions<T>>) : T[] | undefined;

export function readArray<D, T = string>(key: EnvixKey, options: DefaultReadOptions<D, ArrayParseOptions<T>>) : T[] | D;

export function readArray<T = string>(key: EnvixKey, options: RequiredReadOptions<ArrayParseOptions<T>>) : T[];

export function readArray<D, T = string>(key: EnvixKey, options?: ReadOptions<D> & ArrayParseOptions<T>) : T[] | D | undefined;

export function readArray<D, T = string>(key: EnvixKey, options?: ReadOptions<D> & ArrayParseOptions<T>) : T[] | D | undefined {
    return envix.readArray(key, options);
}
