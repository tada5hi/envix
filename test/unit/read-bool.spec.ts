import { readBool, set } from '../../src';

describe('src/read-bool.ts', () => {
    it('should read bool env', () => {
        set('foo', 't');

        let result = readBool('foo');
        expect(result).toBeTruthy();

        set('foo', undefined);

        result = readBool('foo');
        expect(result).toBeUndefined();
    });
});
