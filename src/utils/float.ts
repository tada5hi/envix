import { parseStrictNumber } from './strict';
import type { NumberParseOptions } from './types';

export function toFloat(value: unknown, options: NumberParseOptions = {}) : number | undefined {
    if (options.strict) {
        return parseStrictNumber(value, false);
    }

    const num = Number.parseFloat(value as string);

    if (Number.isNaN(num)) {
        return undefined;
    }

    return num;
}
