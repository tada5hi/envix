import { describe, expect, it } from 'vitest';
import { has, write } from '../../../src';

describe('src/has.ts', () => {
    it('should check env', () => {
        write('foo', 'bar');

        let result = has('foo');

        expect(result).toBeTruthy();

        result = has('bar');
        expect(result).toBeFalsy();

        write('foo', undefined);

        result = has('foo');
        expect(result).toBeFalsy();
    });

    it('agrees with read after process.env is replaced', () => {
        const original = process.env;

        try {
            process.env = { ...original, HAS_REPLACED_ONLY: 'new' };

            expect(has('HAS_REPLACED_ONLY')).toBe(true);
        } finally {
            process.env = original;
        }
    });
});
