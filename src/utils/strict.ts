const INTEGER_PATTERN = /^[+-]?\d+$/;
const DECIMAL_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

function isAccepted(num: number, integer: boolean) : boolean {
    return integer ?
        Number.isSafeInteger(num) :
        Number.isFinite(num);
}

/**
 * Parse a value in plain decimal notation, or return undefined.
 * Integers must be safe integers, so they keep their exact value.
 */
export function parseStrictNumber(value: unknown, integer: boolean) : number | undefined {
    if (typeof value === 'number') {
        return isAccepted(value, integer) ? value : undefined;
    }

    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmed = value.trim();
    const pattern = integer ? INTEGER_PATTERN : DECIMAL_PATTERN;

    if (!pattern.test(trimmed)) {
        return undefined;
    }

    const num = Number(trimmed);

    return isAccepted(num, integer) ? num : undefined;
}
