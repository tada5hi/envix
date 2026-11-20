import type { EnvixErrorInput, EnvixErrorOptions } from './types';

/**
 * Normalize error input and fill in a code and a message derived from the keys.
 * Codes are explicit, since class names do not survive minification.
 */
export function buildErrorOptions(
    input: EnvixErrorInput,
    code: string,
    message: (keys: string[]) => string,
) : EnvixErrorOptions {
    const options : EnvixErrorOptions = typeof input === 'string' ?
        { message: input } :
        { ...input };

    return {
        ...options,
        code: options.code || code,
        message: options.message || message(options.keys || []),
    };
}
