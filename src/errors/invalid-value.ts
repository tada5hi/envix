import { hasInstanceof, markInstanceof } from '@ebec/core';
import { EnvixError, buildErrorOptions } from './base';
import type { EnvixErrorInput } from './types';

export const ENVIX_INVALID_VALUE_ERROR_MARKER = Symbol.for('@envix/invalid-value-error');

function buildMessage(keys: string[]) : string {
    if (keys.length === 0) {
        return 'The environment variable has an invalid value.';
    }

    return `Environment variable ${keys.join(', ')} has an invalid value.`;
}

/**
 * The value itself is never part of the error, since it may be a secret.
 */
export class InvalidValueError extends EnvixError {
    static override [Symbol.hasInstance](input: unknown) : boolean {
        return hasInstanceof(input, ENVIX_INVALID_VALUE_ERROR_MARKER);
    }

    constructor(input: EnvixErrorInput = {}) {
        super(buildErrorOptions(input, 'INVALID_VALUE_ERROR', buildMessage));
        markInstanceof(this, ENVIX_INVALID_VALUE_ERROR_MARKER);
    }
}
