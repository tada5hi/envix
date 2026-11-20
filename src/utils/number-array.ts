import { toArray } from './array';
import { toNumber } from './number';
import { assertMapOption, assertOptions } from './options';
import type { NumberArrayParseOptions } from './types';

/**
 * Parse a separated list of numbers. A single element that does not parse,
 * or that map turns into undefined, NaN or a non-number, makes the whole
 * list undefined.
 */
export function toNumberArray(
    value: unknown,
    options: NumberArrayParseOptions = {},
) : number[] | undefined {
    assertOptions(options);
    assertMapOption(options.map);

    const { map, ...rest } = options;

    return toArray(value, {
        separator: rest.separator,
        min: rest.min,
        max: rest.max,
        map: (item) => {
            const num = toNumber(item, rest);

            if (typeof num === 'undefined' || !map) {
                return num;
            }

            const mapped = map(num);

            if (typeof mapped !== 'number' || Number.isNaN(mapped)) {
                return undefined;
            }

            return mapped;
        },
    });
}
