import { describe, expect, it } from 'vitest';
import { toArray, toNumberArray } from '../../../src';

describe('src/utils/array.ts', () => {
    it.each([
        ['', undefined, []],
        ['a, b ,,c', undefined, ['a', 'b', 'c']],
        ['a;b', { separator: ';' }, ['a', 'b']],
        ['', { min: 1 }, undefined],
        ['a', { min: 1 }, ['a']],
        ['a,b,c,d', { max: 3 }, undefined],
        ['a,b,c', { max: 3 }, ['a', 'b', 'c']],
        [undefined, undefined, undefined],
        [42, undefined, undefined],
    ])('toArray(%j, %j) → %j', (input, options, expected) => {
        expect(toArray(input, options)).toEqual(expected);
    });
});

describe('src/utils/number-array.ts', () => {
    it.each([
        ['1,2', undefined, [1, 2]],
        ['', undefined, []],
        ['1,foo', undefined, undefined],
        ['1,0x10', undefined, [1, 16]],
        ['1,0x10', { strict: true }, undefined],
        ['1, 2', { strict: true }, [1, 2]],
        ['1,2,3', { max: 2 }, undefined],
        ['', { min: 1 }, undefined],
        ['1;2', { separator: ';' }, [1, 2]],
    ])('toNumberArray(%j, %j) → %j', (input, options, expected) => {
        expect(toNumberArray(input, options)).toEqual(expected);
    });
});
