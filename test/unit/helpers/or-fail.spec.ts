import { describe, expect, it } from 'vitest';
import { NotSetError, orFail } from '../../../src';

describe('src/helpers/or-fail.ts', () => {
    it('returns defined values unchanged', () => {
        expect(orFail('bar')).toBe('bar');
        expect(orFail('')).toBe('');
        expect(orFail(0)).toBe(0);
        expect(orFail(null)).toBeNull();
    });

    it('throws a NotSetError naming the given key', () => {
        try {
            orFail(undefined, 'PORT');
            expect.unreachable();
        } catch (e) {
            expect(e).toBeInstanceOf(NotSetError);
            expect((e as NotSetError).keys).toEqual(['PORT']);
            expect((e as NotSetError).message).toBe('Environment variable PORT is not set.');
        }
    });

    it('accepts a key list', () => {
        expect(() => orFail(undefined, ['A', 'B'])).toThrow('None of the environment variables A, B is set.');
    });

    it('throws a keyless NotSetError without a key', () => {
        try {
            orFail(undefined);
            expect.unreachable();
        } catch (e) {
            expect(e).toBeInstanceOf(NotSetError);
            expect((e as NotSetError).keys).toEqual([]);
        }
    });
});
