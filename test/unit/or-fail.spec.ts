import {
    orFail, read, write,
} from '../../src';

describe('src/or-fail.ts', () => {
    it('should read env or fail', () => {
        write('foo', 'bar');

        let str = orFail(read('foo'));
        expect(str).toEqual('bar');

        try {
            str = orFail(read('bar'));
            expect(1).toEqual(2);
        } catch (e) {
            expect(1).toEqual(1);
        }

        write('foo', undefined);
    });
});
