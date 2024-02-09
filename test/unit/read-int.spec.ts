import { readInt, write } from '../../src';

describe('src/read-int.ts', () => {
    it('should read number env', () => {
        write('foo', '1.0');

        let result = readInt('foo');
        expect(result).toEqual(1);

        write('foo', 'foo');

        result = readInt('foo');
        expect(result).toBeUndefined();

        write('foo', undefined);

        result = readInt('foo', 2);
        expect(result).toEqual(2);

        result = readInt('foo');
        expect(result).toBeUndefined();
    });
});
