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

describe('array parser map option', () => {
    const toPort = (item: string) => {
        const num = Number(item);

        return Number.isSafeInteger(num) ? num : undefined;
    };
    const toInteger = (item: number) => (Number.isSafeInteger(item) ? item : undefined);

    it('maps every trimmed entry of toArray', () => {
        expect(toArray(' 80, 443 ,', { map: toPort })).toEqual([80, 443]);
        expect(toArray('', { map: toPort })).toEqual([]);
    });

    it('makes the whole toArray value undefined when one entry does not map', () => {
        expect(toArray('80,http', { map: toPort })).toBeUndefined();
    });

    it('checks min and max before mapping', () => {
        const calls : string[] = [];
        const map = (item: string) => {
            calls.push(item);

            return item;
        };

        expect(toArray('a,b,c', { max: 2, map })).toBeUndefined();
        expect(calls).toEqual([]);
    });

    it('maps the parsed numbers of toNumberArray', () => {
        expect(toNumberArray('1,2', { map: (item) => item * 2 })).toEqual([2, 4]);
        expect(toNumberArray('1,2.5', { map: toInteger })).toBeUndefined();
        expect(toNumberArray('1,0x10', { strict: true, map: toInteger })).toBeUndefined();
    });

    it('does not call map when an entry is not a number', () => {
        const calls : number[] = [];

        expect(toNumberArray('1,foo', {
            map: (item) => {
                calls.push(item);

                return item;
            },
        })).toBeUndefined();
        expect(calls).toEqual([1]);
    });

    it('rejects a map that is not a function', () => {
        expect(() => toArray('a', { map: 'int' as never })).toThrow(TypeError);
        expect(() => toNumberArray('1', { map: 'int' as never })).toThrow(TypeError);
    });
});

describe('array parser options guard', () => {
    it('rejects a positional separator from the previous API', () => {
        expect(() => toArray('a;b', ';' as never)).toThrow(TypeError);
        expect(() => toNumberArray('1;2', ';' as never)).toThrow(TypeError);
    });
});
