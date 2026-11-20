import { describe, expect, it } from 'vitest';
import { readBool, write } from '../../../src';

describe('src/read-bool.ts', () => {
    it('should read bool env', () => {
        write('foo', 't');

        let result = readBool('foo');

        expect(result).toBeTruthy();

        write('foo', undefined);

        result = readBool('foo');
        expect(result).toBeUndefined();
    });

    it('should read upper and mixed case bool env', () => {
        write('foo', 'TRUE');
        expect(readBool('foo')).toBe(true);

        write('foo', 'False');
        expect(readBool('foo', true)).toBe(false);

        write('foo', undefined);
    });
});
