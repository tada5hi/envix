import { toArray } from './array';
import { toNumber } from './number';
import { assertOptions } from './options';
import type { NumberArrayParseOptions } from './types';

/**
 * Parse a separated list of numbers. A single element that does not parse
 * makes the whole list undefined.
 */
export function toNumberArray(
    value: unknown,
    options: NumberArrayParseOptions = {},
) : number[] | undefined {
    assertOptions(options);

    const items = toArray(value, options);

    if (!items) {
        return undefined;
    }

    const output : number[] = [];

    for (const item of items) {
        const num = toNumber(item, options);

        if (typeof num === 'undefined') {
            return undefined;
        }

        output.push(num);
    }

    return output;
}
