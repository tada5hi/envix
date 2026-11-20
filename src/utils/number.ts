import { parseStrictNumber } from './strict';
import type { NumberParseOptions } from './types';

export function toNumber(value: unknown, options: NumberParseOptions = {}) : number | undefined {
    if (options.strict) {
        return parseStrictNumber(value, false);
    }

    if (typeof value === 'string' && value.trim().length === 0) {
        return undefined;
    }

    const num = Number(value);

    if (Number.isNaN(num)) {
        return undefined;
    }

    return num;
}
