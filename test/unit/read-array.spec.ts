import { readArray, write } from '../../src';

describe('src/read-array.ts', () => {
    it('should read array env', () => {
        write('foo', 'bar,baz');

        let result = readArray('foo');
        expect(result).toEqual(['bar', 'baz']);

        write('foo', undefined);

        result = readArray('foo');
        expect(result).toBeUndefined();
    });
});
