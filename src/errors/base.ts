import { BaseError, hasInstanceof, markInstanceof } from '@ebec/core';
import type { EnvixErrorInput } from './types';

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

