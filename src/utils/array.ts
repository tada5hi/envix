import type { ArrayParseOptions } from './types';

export function toArray(
    value: unknown,
    options: ArrayParseOptions = {},
) : string[] | undefined {
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

    return items;
}
