import { has, write } from '../../src';

describe('src/has.ts', () => {
    it('should check env', () => {
        write('foo', 'bar');

        let result = has('foo');
        expect(result).toBeTruthy();

        result = has('bar');
        expect(result).toBeFalsy();

        write('foo', undefined);

        result = has('foo');
        expect(result).toBeFalsy();
    });
});
