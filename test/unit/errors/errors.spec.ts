import { markInstanceof } from '@ebec/core';
import { describe, expect, it } from 'vitest';
import {
    EnvixError,
    InvalidValueError,
    NotSetError,
    UnsupportedOperationError,
} from '../../../src';

describe('src/errors', () => {
    it('names a single unset key', () => {
        const error = new NotSetError({ keys: ['PORT'] });

        expect(error.message).toBe('Environment variable PORT is not set.');
        expect(error.code).toBe('NOT_SET_ERROR');
        expect(error.keys).toEqual(['PORT']);
        expect(error).toBeInstanceOf(NotSetError);
        expect(error).toBeInstanceOf(EnvixError);
        expect(error).toBeInstanceOf(Error);
    });

    it('lists every checked key when none is set', () => {
        const error = new NotSetError({ keys: ['APP_PORT', 'PORT'] });

        expect(error.message).toBe('None of the environment variables APP_PORT, PORT is set.');
    });

    it('uses a generic message without keys', () => {
        const error = new NotSetError();

        expect(error.message).toBe('The environment variable is not set.');
        expect(error.keys).toEqual([]);
    });

    it('keeps an explicit message', () => {
        expect(new NotSetError({ keys: ['A'], message: 'custom' }).message).toBe('custom');
        expect(new EnvixError('plain').message).toBe('plain');
    });

    it('describes an invalid value without exposing it', () => {
        const error = new InvalidValueError({ keys: ['PORT'] });

        expect(error.message).toBe('Environment variable PORT has an invalid value.');
        expect(error.code).toBe('INVALID_VALUE_ERROR');
        expect(error).toBeInstanceOf(EnvixError);
        expect(error).not.toBeInstanceOf(NotSetError);
    });

    it('derives the unsupported operation code', () => {
        const error = new UnsupportedOperationError('The environment source does not support writing.');

        expect(error.code).toBe('UNSUPPORTED_OPERATION_ERROR');
        expect(error).toBeInstanceOf(EnvixError);
    });

    it('recognizes errors from another envix copy through markers', () => {
        const foreign = new Error('foreign');

        markInstanceof(foreign, Symbol.for('@envix/error'));
        markInstanceof(foreign, Symbol.for('@envix/not-set-error'));

        expect(foreign).toBeInstanceOf(NotSetError);
        expect(foreign).toBeInstanceOf(EnvixError);
        expect(foreign).not.toBeInstanceOf(InvalidValueError);
    });
});
