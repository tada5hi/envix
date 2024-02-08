import { readNumberArray, set } from '../../src';

describe('src/read-number-array.ts', () => {
    it('should read number array env', () => {
        set('foo', '1,2');

        let result = readNumberArray('foo');
        expect(result).toEqual([1, 2]);

        set('foo', '1.0,foo');

        result = readNumberArray('foo');
        expect(result).toBeUndefined();

        set('foo', undefined);

        result = readNumberArray('foo');
        expect(result).toBeUndefined();
    });
});
