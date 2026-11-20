import { envix } from '../instance';
import type {
    DefaultReadOptions,
    EnvixKey,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from '../types';
import type { NumberParseOptions } from '../utils';

export function readNumber(key: EnvixKey, options?: OptionalReadOptions<NumberParseOptions>) : number | undefined;

export function readNumber<D>(key: EnvixKey, options: DefaultReadOptions<D, NumberParseOptions>) : number | D;

export function readNumber(key: EnvixKey, options: RequiredReadOptions<NumberParseOptions>) : number;

export function readNumber<D>(key: EnvixKey, options?: ReadOptions<D> & NumberParseOptions) : number | D | undefined;

export function readNumber<D>(key: EnvixKey, options?: ReadOptions<D> & NumberParseOptions) : number | D | undefined {
    return envix.readNumber(key, options);
}
