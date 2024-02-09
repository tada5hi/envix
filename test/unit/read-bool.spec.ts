import { readBool, write } from '../../src';

describe('src/read-bool.ts', () => {
    it('should read bool env', () => {
        write('foo', 't');

        let result = readBool('foo');
        expect(result).toBeTruthy();

        write('foo', undefined);

        result = readBool('foo');
        expect(result).toBeUndefined();
    });
});
