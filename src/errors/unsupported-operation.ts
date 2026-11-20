import { hasInstanceof, markInstanceof } from '@ebec/core';
import { EnvixError } from './base';
import { buildErrorOptions } from './utils';
import type { EnvixErrorInput } from './types';

export const ENVIX_UNSUPPORTED_OPERATION_ERROR_MARKER = Symbol.for('@envix/unsupported-operation-error');

export class UnsupportedOperationError extends EnvixError {
    static override [Symbol.hasInstance](input: unknown) : boolean {
        return hasInstanceof(input, ENVIX_UNSUPPORTED_OPERATION_ERROR_MARKER);
    }

    constructor(input: EnvixErrorInput = {}) {
        super(buildErrorOptions(
            input,
            'UNSUPPORTED_OPERATION_ERROR',
            () => 'The environment source does not support this operation.',
        ));
        markInstanceof(this, ENVIX_UNSUPPORTED_OPERATION_ERROR_MARKER);
    }
}
