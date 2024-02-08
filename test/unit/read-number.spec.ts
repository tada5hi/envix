import { readNumber, set } from '../../src';

describe('src/read-number.ts', () => {
    it('should read number env', () => {
        set('foo', '1');

        let result = readNumber('foo');
        expect(result).toEqual(1);

        set('foo', '1.0');

        result = readNumber('foo');
        expect(result).toEqual(1.0);

        set('foo', undefined);

        result = readNumber('foo');
        expect(result).toBeUndefined();
    });
});
