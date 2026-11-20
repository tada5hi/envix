import { hasInstanceof, markInstanceof } from '@ebec/core';
import { EnvixError, buildErrorOptions } from './base';
import type { EnvixErrorInput } from './types';

export const ENVIX_NOT_SET_ERROR_MARKER = Symbol.for('@envix/not-set-error');

function buildMessage(keys: string[]) : string {
    if (keys.length === 0) {
        return 'The environment variable is not set.';
    }

    if (keys.length === 1) {
        return `Environment variable ${keys[0]} is not set.`;
    }

    return `None of the environment variables ${keys.join(', ')} is set.`;
}

export class NotSetError extends EnvixError {
    static override [Symbol.hasInstance](input: unknown) : boolean {
        return hasInstanceof(input, ENVIX_NOT_SET_ERROR_MARKER);
    }

    constructor(input: EnvixErrorInput = {}) {
        super(buildErrorOptions(input, 'NOT_SET_ERROR', buildMessage));
        markInstanceof(this, ENVIX_NOT_SET_ERROR_MARKER);
    }
}
