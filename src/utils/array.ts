import { assertMapOption, assertOptions } from './options';
import type { ArrayParseOptions } from './types';

/**
 * Parse a separated list. With map, a single entry that maps to undefined
 * makes the whole list undefined.
 */
export function toArray<T = string>(
    value: unknown,
    options: ArrayParseOptions<T> = {},
) : T[] | undefined {
    assertOptions(options);
    assertMapOption(options.map);

    if (typeof value !== 'string') {
        return undefined;
    }

    const items = value
        .split(options.separator ?? ',')
        .map((el) => el.trim())
        .filter(Boolean);

    if (items.length < (options.min ?? 0)) {
        return undefined;
    }

    if (typeof options.max === 'number' && items.length > options.max) {
        return undefined;
    }

    if (!options.map) {
        return items as T[];
    }

    const output : T[] = [];

    for (const item of items) {
        const mapped = options.map(item);

        if (typeof mapped === 'undefined') {
            return undefined;
        }

        output.push(mapped);
    }

    return output;
}
