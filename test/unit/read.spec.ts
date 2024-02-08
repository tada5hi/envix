import { read, set } from '../../src';

describe('src/read.ts', () => {
    it('should read env', () => {
        set('foo', 'bar');

        let result = read('foo');
        expect(result).toEqual('bar');

        set('foo', undefined);

        result = read('foo', 'baz');
        expect(result).toEqual('baz');
    });

    it('should read all env', () => {
        set('foo', 'bar');

        const result = read();
        const keys = Object.keys(result);
        expect(keys.length).toBeGreaterThanOrEqual(1);

        set('foo', undefined);
    });
});
