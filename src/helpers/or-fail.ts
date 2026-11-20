import { NotSetError } from '../errors';

/**
 * Return the value, or throw a NotSetError when it is undefined.
 *
 * @param value - The value to check.
 * @param key - The environment variable key(s) to name in the error.
 */
export function orFail<T>(value: T, key?: string | string[]) : Exclude<T, undefined> {
    if (typeof value === 'undefined') {
        let keys : string[] = [];

        if (typeof key === 'string') {
            keys = [key];
        } else if (key) {
            keys = key;
        }

        throw new NotSetError({ keys });
    }

    return value as Exclude<T, undefined>;
}
