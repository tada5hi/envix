import { envix } from '../instance';
import type {
    DefaultReadOptions,
    EnvixKey,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from '../types';
import type { NumberParseOptions } from '../utils';

export function readInt(key: EnvixKey, options?: OptionalReadOptions<NumberParseOptions>) : number | undefined;

export function readInt<D>(key: EnvixKey, options: DefaultReadOptions<D, NumberParseOptions>) : number | D;

export function readInt(key: EnvixKey, options: RequiredReadOptions<NumberParseOptions>) : number;

export function readInt<D>(key: EnvixKey, options?: ReadOptions<D> & NumberParseOptions) : number | D | undefined;

export function readInt<D>(key: EnvixKey, options?: ReadOptions<D> & NumberParseOptions) : number | D | undefined {
    return envix.readInt(key, options);
}
