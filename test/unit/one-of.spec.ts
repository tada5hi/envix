import { describe, expect, it } from 'vitest';
import {
    oneOf, read, readNumber, write,
} from '../../src';

describe('src/one-of.ts', () => {
    it('should read one of env', () => {
        write('foo', 'bar');

        const str = oneOf([
            read('bar'),
            read('foo'),
        ]);

        expect(str).toEqual('bar');

        const strNum = oneOf([
            readNumber('foo'),
            read('bar'),
        ]);
        expect(strNum).toBeUndefined();

        write('foo', undefined);
    });
    it('uses indexed order when an array has a custom iterator', () => {
        const values = [1, 2];
        values[Symbol.iterator] = function* () { yield 2; yield 1; };
        expect(oneOf(values)).toBe(1);
    });
});
