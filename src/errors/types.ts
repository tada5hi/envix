import type { ErrorOptions } from '@ebec/core';

export type EnvixErrorOptions = ErrorOptions & {
    /**
     * The environment variable keys the error refers to.
     */
    keys?: string[],
};

export type EnvixErrorInput = string | EnvixErrorOptions;
