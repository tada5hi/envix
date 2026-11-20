import { describe, expect, it } from 'vitest';
import { toFloat, toInt, toNumber } from '../../../src';

describe('src/utils/number.ts', () => {
    it.each([
        ['42', 42],
        ['', undefined],
        ['  ', undefined],
        ['0x10', 16],
        ['12px', undefined],
        ['1e3', 1000],
        ['abc', undefined],
    ])('toNumber(%j) → %j', (input, expected) => {
        expect(toNumber(input)).toEqual(expected);
    });

    it.each([
        ['0x10', undefined],
        ['Infinity', undefined],
        ['NaN', undefined],
        [' 42 ', 42],
        ['-.5', -0.5],
        ['1e3', 1000],
        ['+3', 3],
        ['', undefined],
        ['1.', 1],
    ])('toNumber(%j, { strict }) → %j', (input, expected) => {
        expect(toNumber(input, { strict: true })).toEqual(expected);
    });
});

describe('src/utils/int.ts', () => {
    it.each([
        ['12px', 12],
        ['12.9', 12],
        ['', undefined],
        ['  ', undefined],
        ['abc', undefined],
    ])('toInt(%j) → %j', (input, expected) => {
        expect(toInt(input)).toEqual(expected);
    });

    it.each([
        ['12px', undefined],
        ['12.9', undefined],
        ['1e3', undefined],
        ['0x10', undefined],
        ['+3', 3],
        [' -7 ', -7],
        ['42', 42],
        ['99999999999999999999', undefined],
    ])('toInt(%j, { strict }) → %j', (input, expected) => {
        expect(toInt(input, { strict: true })).toEqual(expected);
    });
});

describe('src/utils/float.ts', () => {
    it.each([
        ['1.5x', 1.5],
        ['1.5', 1.5],
        ['', undefined],
        ['abc', undefined],
    ])('toFloat(%j) → %j', (input, expected) => {
        expect(toFloat(input)).toEqual(expected);
    });

    it.each([
        ['1.5x', undefined],
        ['1.5', 1.5],
        ['Infinity', undefined],
        ['0x10', undefined],
    ])('toFloat(%j, { strict }) → %j', (input, expected) => {
        expect(toFloat(input, { strict: true })).toEqual(expected);
    });
});

describe('number parser options guard', () => {
    it('rejects non-object options', () => {
        expect(() => toInt('1', 10 as never)).toThrow(TypeError);
        expect(() => toFloat('1', true as never)).toThrow(TypeError);
        expect(() => toNumber('1', 'x' as never)).toThrow(TypeError);
    });
});
