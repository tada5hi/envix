import { envix } from '../instance';
import type {
    DefaultReadOptions,
    EnvixKey,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from '../types';
import type { BoolArrayParseOptions } from '../utils';

export function readBoolArray(key: EnvixKey, options?: OptionalReadOptions<BoolArrayParseOptions>) : boolean[] | undefined;

export function readBoolArray<D>(key: EnvixKey, options: DefaultReadOptions<D, BoolArrayParseOptions>) : boolean[] | D;

export function readBoolArray(key: EnvixKey, options: RequiredReadOptions<BoolArrayParseOptions>) : boolean[];

export function readBoolArray<D>(key: EnvixKey, options?: ReadOptions<D> & BoolArrayParseOptions) : boolean[] | D | undefined;

export function readBoolArray<D>(key: EnvixKey, options?: ReadOptions<D> & BoolArrayParseOptions) : boolean[] | D | undefined {
    return envix.readBoolArray(key, options);
}
