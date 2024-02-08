import { toBool } from '../../../src/utils';

describe('src/utils/bool.ts', () => {
    it('should transform value to bool', () => {
        expect(toBool(true)).toBeTruthy();
        expect(toBool('t')).toBeTruthy();
        expect(toBool('1')).toBeTruthy();

        expect(toBool(false)).toBeFalsy();
        expect(toBool('f')).toBeFalsy();
        expect(toBool('0')).toBeFalsy();
    });

    it('should not transform value to bool', () => {
        expect(toBool('foo')).toBeUndefined();
    });
});
