import { describe, it, expect } from 'vitest';
import { toArray } from '../../../src';

describe('src/utils/array.ts', () => {
    it('should transform unknown value to array', () => {
        expect(toArray('')).toEqual([]);
        expect(toArray(undefined)).toBeUndefined();
    });
});
