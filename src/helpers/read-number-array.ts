import { envix } from '../instance';
import type {
    DefaultReadOptions,
    EnvixKey,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from '../types';
import type { NumberArrayParseOptions } from '../utils';

export function readNumberArray(key: EnvixKey, options?: OptionalReadOptions<NumberArrayParseOptions>) : number[] | undefined;

export function readNumberArray<D>(key: EnvixKey, options: DefaultReadOptions<D, NumberArrayParseOptions>) : number[] | D;

export function readNumberArray(key: EnvixKey, options: RequiredReadOptions<NumberArrayParseOptions>) : number[];

export function readNumberArray<D>(key: EnvixKey, options?: ReadOptions<D> & NumberArrayParseOptions) : number[] | D | undefined;

export function readNumberArray<D>(key: EnvixKey, options?: ReadOptions<D> & NumberArrayParseOptions) : number[] | D | undefined {
    return envix.readNumberArray(key, options);
}
