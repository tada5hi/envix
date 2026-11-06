import { describe, expect, it } from 'vitest';
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
    it('preserves an own __proto__ environment key', () => {
        const previous = Object.getOwnPropertyDescriptor(process.env, '__proto__');
        try {
            Object.defineProperty(process.env, '__proto__', { value: 'literal-value', enumerable: true, writable: true, configurable: true });
            const result = read();
            expect(Object.getOwnPropertyDescriptor(result, '__proto__')?.value).toBe('literal-value');
            expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        } finally {
            delete process.env.__proto__;
            if (previous) Object.defineProperty(process.env, '__proto__', previous);
        }
    });
});
