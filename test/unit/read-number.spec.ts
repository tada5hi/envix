import { readNumber, write } from '../../src';

describe('src/read-number.ts', () => {
    it('should read number env', () => {
        write('foo', '1');

        let result = readNumber('foo');
        expect(result).toEqual(1);

        write('foo', '1.0');

        result = readNumber('foo');
        expect(result).toEqual(1.0);

        write('foo', undefined);

        result = readNumber('foo');
        expect(result).toBeUndefined();
    });
});
