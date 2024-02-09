import { readFloat, write } from '../../src';

describe('src/read-float.ts', () => {
    it('should read float env', () => {
        write('foo', '1');

        let result = readFloat('foo');
        expect(result).toEqual(1.0);

        write('foo', 'foo');

        result = readFloat('foo');
        expect(result).toBeUndefined();

        write('foo', undefined);

        result = readFloat('foo', 2.0);
        expect(result).toEqual(2.0);

        result = readFloat('foo');
        expect(result).toBeUndefined();
    });
});
