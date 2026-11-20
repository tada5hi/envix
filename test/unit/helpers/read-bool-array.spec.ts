import { describe, expect, it } from 'vitest';
import { readBoolArray, write } from '../../../src';

describe('src/read-bool-array.ts', () => {
    it('should read bool array env', () => {
        write('foo', 'true,0');

        let result = readBoolArray('foo');

        expect(result).toEqual([true, false]);

        write('foo', 'true,yes');

        result = readBoolArray('foo');
        expect(result).toBeUndefined();

        write('foo', undefined);

        result = readBoolArray('foo');
        expect(result).toBeUndefined();
    });
});
