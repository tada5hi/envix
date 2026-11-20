import { describe, expect, it } from 'vitest';
import { toBool } from '../../../src/utils';

describe('src/utils/bool.ts', () => {
    it('should transform value to bool', () => {
        expect(toBool(true)).toBeTruthy();
        expect(toBool('t')).toBeTruthy();
        expect(toBool('1')).toBeTruthy();

        expect(toBool(false)).toBeFalsy();
        expect(toBool('f')).toBeFalsy();
        expect(toBool('0')).toBeFalsy();
    });

    it('should transform boolean words case-insensitively and trimmed', () => {
        expect(toBool('TRUE')).toBe(true);
        expect(toBool('True')).toBe(true);
        expect(toBool('T')).toBe(true);
        expect(toBool(' true ')).toBe(true);

        expect(toBool('FALSE')).toBe(false);
        expect(toBool('False')).toBe(false);
        expect(toBool('F')).toBe(false);
        expect(toBool(' 0 ')).toBe(false);
    });

    it('should not transform value to bool', () => {
        expect(toBool('foo')).toBeUndefined();
        expect(toBool('yes')).toBeUndefined();
        expect(toBool('')).toBeUndefined();
        expect(toBool(1)).toBeUndefined();
    });
});
