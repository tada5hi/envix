import { read, write } from '../../src';

describe('src/read.ts', () => {
    it('should read env', () => {
        write('foo', 'bar');

        let result = read('foo');
        expect(result).toEqual('bar');

        write('foo', undefined);

        result = read('foo', 'baz');
        expect(result).toEqual('baz');
    });

    it('should read all env', () => {
        write('foo', 'bar');

        const result = read();
        const keys = Object.keys(result);
        expect(keys.length).toBeGreaterThanOrEqual(1);

        write('foo', undefined);
    });
});
