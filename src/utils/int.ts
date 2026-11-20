import { assertOptions } from './options';
import { parseStrictNumber } from './strict';
import type { NumberParseOptions } from './types';

export function toInt(value: unknown, options: NumberParseOptions = {}) : number | undefined {
    assertOptions(options);

    if (options.strict) {
        return parseStrictNumber(value, true);
    }

    const num = Number.parseInt(value as string, 10);

    if (Number.isNaN(num)) {
        return undefined;
    }

    return num;
}
