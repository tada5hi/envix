import { toArray } from './array';
import { toBool } from './bool';
import { assertOptions } from './options';
import type { BoolArrayParseOptions } from './types';

/**
 * Parse a separated list of booleans. A single element that does not parse
 * makes the whole list undefined.
 */
export function toBoolArray(
    value: unknown,
    options: BoolArrayParseOptions = {},
) : boolean[] | undefined {
    assertOptions(options);

    return toArray(value, {
        separator: options.separator,
        min: options.min,
        max: options.max,
        map: (item) => toBool(item),
    });
}
