import { envix } from '../instance';
import type {
    DefaultReadOptions,
    EnvixKey,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from '../types';
import type { ArrayParseOptions } from '../utils';

export function readArray(key: EnvixKey, options?: OptionalReadOptions<ArrayParseOptions>) : string[] | undefined;

export function readArray<D>(key: EnvixKey, options: DefaultReadOptions<D, ArrayParseOptions>) : string[] | D;

export function readArray(key: EnvixKey, options: RequiredReadOptions<ArrayParseOptions>) : string[];

export function readArray<D>(key: EnvixKey, options?: ReadOptions<D> & ArrayParseOptions) : string[] | D | undefined;

export function readArray<D>(key: EnvixKey, options?: ReadOptions<D> & ArrayParseOptions) : string[] | D | undefined {
    return envix.readArray(key, options);
}
