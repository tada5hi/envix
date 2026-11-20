import { BaseError, hasInstanceof, markInstanceof } from '@ebec/core';
import type { EnvixErrorInput, EnvixErrorOptions } from './types';

export const ENVIX_ERROR_MARKER = Symbol.for('@envix/error');

export class EnvixError extends BaseError {
    static override [Symbol.hasInstance](input: unknown) : boolean {
        return hasInstanceof(input, ENVIX_ERROR_MARKER);
    }

    public readonly keys: string[];

    constructor(input: EnvixErrorInput = {}) {
        if (typeof input === 'string') {
            super({ message: input, code: 'ENVIX_ERROR' });
            this.keys = [];
        } else {
            const { keys, ...rest } = input;

            super({ code: 'ENVIX_ERROR', ...rest });
            this.keys = keys ? [...keys] : [];
        }

        markInstanceof(this, ENVIX_ERROR_MARKER);
    }
}

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
