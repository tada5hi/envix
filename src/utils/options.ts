/**
 * Reject anything but an options object, so calls in the style of the
 * previous API (a positional fallback or separator) fail loudly instead of
 * returning wrong values.
 */
export function assertOptions(options: unknown) : void {
    if (typeof options === 'undefined') {
        return;
    }

    if (
        typeof options !== 'object' ||
        options === null ||
        Array.isArray(options)
    ) {
        throw new TypeError('The options argument must be an object, e.g. { default: value }.');
    }
}

/**
 * Reject a map option that is not a function.
 */
export function assertMapOption(map: unknown) : void {
    if (typeof map !== 'undefined' && typeof map !== 'function') {
        throw new TypeError('The map option must be a function.');
    }
}
