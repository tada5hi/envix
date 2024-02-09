import { readNumberArray, write } from '../../src';

describe('src/read-number-array.ts', () => {
    it('should read number array env', () => {
        write('foo', '1,2');

        let result = readNumberArray('foo');
        expect(result).toEqual([1, 2]);

        write('foo', '1.0,foo');

        result = readNumberArray('foo');
        expect(result).toBeUndefined();

        write('foo', undefined);

        result = readNumberArray('foo');
        expect(result).toBeUndefined();
    });
});
