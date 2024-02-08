import {
    oneOf, read, readNumber, set,
} from '../../src';

describe('src/one-of.ts', () => {
    it('should read one of env', () => {
        set('foo', 'bar');

        const str = oneOf([
            read('bar'),
            read('foo'),
        ]);

        expect(str).toEqual('bar');

        const strNum = oneOf([
            readNumber('foo'),
            read('bar'),
        ]);
        expect(strNum).toBeUndefined();

        set('foo', undefined);
    });
});
