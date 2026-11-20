import { describe, expect, it } from 'vitest';
import {
    Envix,
    NotSetError,
    UnsupportedOperationError,
    envix,
    read,
} from '../../src';

function createRecordEnvix(record: Record<string, string | undefined>) {
    return new Envix({
        read: (key) => record[key],
        write: (key, value) => {
            if (typeof value === 'undefined') {
                delete record[key];
            } else {
                record[key] = value;
            }
        },
        keys: () => Object.keys(record),
    });
}

describe('src/module.ts', () => {
    it('reads from the given source', () => {
        const instance = createRecordEnvix({ A: 'a', EMPTY: '' });

        expect(instance.read('A')).toBe('a');
        expect(instance.read('EMPTY')).toBe('');
        expect(instance.read('MISSING')).toBeUndefined();
        expect(instance.read('MISSING', { default: 'x' })).toBe('x');
        expect(instance.read()).toEqual({ A: 'a', EMPTY: '' });
    });

    it('picks the first set key of a key list', () => {
        const instance = createRecordEnvix({ A: 'a', B: 'b' });

        expect(instance.read(['MISSING', 'B', 'A'])).toBe('b');
        expect(instance.read(['MISSING', 'OTHER'], { default: 'x' })).toBe('x');
    });

    it('throws NotSetError for a required unset key list', () => {
        const instance = createRecordEnvix({});

        try {
            instance.read(['B', 'A'], { required: true });
            expect.unreachable();
        } catch (e) {
            expect(e).toBeInstanceOf(NotSetError);
            expect((e as NotSetError).keys).toEqual(['B', 'A']);
        }

        expect(createRecordEnvix({ A: '' }).read('A', { required: true })).toBe('');
    });

    it('writes and deletes through the source', () => {
        const instance = createRecordEnvix({});

        instance.write('A', '1');
        expect(instance.read('A')).toBe('1');
        expect(instance.has('A')).toBe(true);

        instance.write('A', undefined);
        expect(instance.has('A')).toBe(false);
    });

    it('throws UnsupportedOperationError for missing source operations', () => {
        const instance = new Envix({ read: () => undefined });

        expect(() => instance.write('A', '1')).toThrow(UnsupportedOperationError);
        expect(() => instance.read()).toThrow(UnsupportedOperationError);
    });

    it('exposes the default instance', () => {
        process.env.DEFAULT_INSTANCE_KEY = 'v';

        expect(envix.read('DEFAULT_INSTANCE_KEY')).toBe('v');
        expect(read('DEFAULT_INSTANCE_KEY')).toBe('v');

        delete process.env.DEFAULT_INSTANCE_KEY;
    });
});
