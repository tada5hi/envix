import { readArray, set } from '../../src';

describe('src/read-array.ts', () => {
    it('should read array env', () => {
        set('foo', 'bar,baz');

        let result = readArray('foo');
        expect(result).toEqual(['bar', 'baz']);

        set('foo', undefined);

        result = readArray('foo');
        expect(result).toBeUndefined();
    });
});
