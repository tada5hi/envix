import { describe, expect, it } from 'vitest';
import { toBoolArray } from '../../../src';

describe('src/utils/bool-array.ts', () => {
    it.each([
        ['', undefined, []],
        ['true, f ,,1,FALSE', undefined, [true, false, true, false]],
        ['t;0', { separator: ';' }, [true, false]],
        ['true,yes', undefined, undefined],
        ['', { min: 1 }, undefined],
        ['1,0,1', { max: 2 }, undefined],
        [undefined, undefined, undefined],
        [true, undefined, undefined],
    ])('toBoolArray(%j, %j) → %j', (input, options, expected) => {
        expect(toBoolArray(input, options)).toEqual(expected);
    });

    it('rejects options that are not an object', () => {
        expect(() => toBoolArray('1;0', ';' as never)).toThrow(TypeError);
    });
});
