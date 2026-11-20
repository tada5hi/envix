import {
    afterEach, 
    describe, 
    expect, 
    it, 
    vi,
} from 'vitest';
import { createRuntimeSource } from '../../../src/utils/source';

describe('src/utils/source.ts', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('resolves process.env on every call', () => {
        const source = createRuntimeSource();
        const original = process.env;

        try {
            process.env = { FRESH: 'yes' };

            expect(source.read('FRESH')).toBe('yes');
            expect(source.keys()).toEqual(['FRESH']);

            source.write('FRESH', 'changed');
            expect(process.env.FRESH).toBe('changed');

            source.write('FRESH', undefined);
            expect('FRESH' in process.env).toBe(false);
        } finally {
            process.env = original;
        }
    });

    it('falls back to globalThis.__env__ with string values only', () => {
        vi.stubGlobal('process', undefined);
        vi.stubGlobal('__env__', { A: '1', KV: { get() {} } });

        const source = createRuntimeSource();

        expect(source.read('A')).toBe('1');
        expect(source.read('KV')).toBeUndefined();
        expect(source.read('toString')).toBeUndefined();
        expect(source.read('__proto__')).toBeUndefined();
        expect(source.keys()).toEqual(['A']);

        source.write('B', '2');
        expect((globalThis as Record<string, any>).__env__.B).toBe('2');

        source.write('__proto__', 'literal');
        expect(source.read('__proto__')).toBe('literal');
        expect(source.keys()).toContain('__proto__');
        expect(Object.getPrototypeOf((globalThis as Record<string, any>).__env__)).toBe(Object.prototype);

        source.write('__proto__', undefined);
        expect(source.read('__proto__')).toBeUndefined();
    });

    it('uses an in-memory record without process or __env__', () => {
        vi.stubGlobal('process', undefined);
        vi.stubGlobal('__env__', undefined);

        const source = createRuntimeSource();

        expect(source.read('MEMORY_KEY')).toBeUndefined();
        expect(source.read('toString')).toBeUndefined();

        source.write('MEMORY_KEY', '1');
        expect(source.read('MEMORY_KEY')).toBe('1');
        expect(source.keys()).toContain('MEMORY_KEY');

        source.write('MEMORY_KEY', undefined);
        expect(source.read('MEMORY_KEY')).toBeUndefined();
    });
});
