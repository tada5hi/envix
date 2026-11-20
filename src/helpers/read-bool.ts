import { envix } from '../instance';
import type {
    DefaultReadOptions,
    EnvixKey,
    OptionalReadOptions,
    ReadOptions,
    RequiredReadOptions,
} from '../types';

export function readBool(key: EnvixKey, options?: OptionalReadOptions) : boolean | undefined;

export function readBool<D>(key: EnvixKey, options: DefaultReadOptions<D>) : boolean | D;

export function readBool(key: EnvixKey, options: RequiredReadOptions) : boolean;

export function readBool<D>(key: EnvixKey, options?: ReadOptions<D>) : boolean | D | undefined;

export function readBool<D>(key: EnvixKey, options?: ReadOptions<D>) : boolean | D | undefined {
    return envix.readBool(key, options);
}
