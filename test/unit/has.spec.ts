import { has, set } from '../../src';

describe('src/has.ts', () => {
    it('should check env', () => {
        set('foo', 'bar');

        let result = has('foo');
        expect(result).toBeTruthy();

        result = has('bar');
        expect(result).toBeFalsy();

        set('foo', undefined);

        result = has('foo');
        expect(result).toBeFalsy();
    });
});
