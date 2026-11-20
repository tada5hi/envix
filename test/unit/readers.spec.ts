import {
    describe,
    expect,
    expectTypeOf,
    it,
} from 'vitest';
import {
    Envix,
    InvalidValueError,
    NotSetError,
    envix,
    has,
    read,
    readArray,
    readBool,
    readBoolArray,
    readFloat,
    readInt,
    readNumber,
    readNumberArray,
    write,
} from '../../src';

function createRecordEnvix(record: Record<string, string | undefined>) {
    return new Envix({ read: (key) => record[key] });
}

type ReaderName = 'readArray' | 'readBool' | 'readBoolArray' | 'readFloat' | 'readInt' | 'readNumber' | 'readNumberArray';

const cases : {
    reader: ReaderName, 
    valid: string, 
    parsed: unknown, 
    invalid: string, 
    fallback: unknown 
}[] = [
    {
        reader: 'readArray', 
        valid: 'a,b', 
        parsed: ['a', 'b'], 
        invalid: 'a,b,c', 
        fallback: ['d'],
    },
    {
        reader: 'readBool', 
        valid: 'true', 
        parsed: true, 
        invalid: 'yes', 
        fallback: false,
    },
    {
        reader: 'readBoolArray',
        valid: 'true, 0,F',
        parsed: [true, false, false],
        invalid: 'true,yes',
        fallback: [false],
    },
    {
        reader: 'readFloat', 
        valid: '1.5', 
        parsed: 1.5, 
        invalid: 'abc', 
        fallback: 2.5,
    },
    {
        reader: 'readInt', 
        valid: '42', 
        parsed: 42, 
        invalid: 'abc', 
        fallback: 7,
    },
    {
        reader: 'readNumber', 
        valid: '42', 
        parsed: 42, 
        invalid: 'abc', 
        fallback: 7,
    },
    {
        reader: 'readNumberArray', 
        valid: '1,2', 
        parsed: [1, 2], 
        invalid: '1,foo', 
        fallback: [0],
    },
];

// readArray's invalid case relies on max: 2
const extra = (reader: ReaderName) => (reader === 'readArray' ? { max: 2 } : {});

describe.each(cases)('$reader', ({
    reader, 
    valid, 
    parsed, 
    invalid, 
    fallback,
}) => {
    const call = (record: Record<string, string>, options?: Record<string, unknown>) => {
        const instance = createRecordEnvix(record) as unknown as Record<ReaderName, (k: string | string[], o?: unknown) => unknown>;

        return instance[reader]('K', { ...extra(reader), ...options });
    };

    it('parses a valid value', () => {
        expect(call({ K: valid })).toEqual(parsed);
    });

    it('returns undefined when absent', () => {
        expect(call({})).toBeUndefined();
    });

    it('returns the default when absent', () => {
        expect(call({}, { default: fallback })).toEqual(fallback);
    });

    it('returns the default when the value does not parse', () => {
        expect(call({ K: invalid }, { default: fallback })).toEqual(fallback);
    });

    it('throws NotSetError when required and absent', () => {
        expect(() => call({}, { required: true })).toThrow(NotSetError);
    });

    it('throws InvalidValueError naming the key when required and invalid', () => {
        try {
            call({ K: invalid }, { required: true });
            expect.unreachable();
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidValueError);
            expect((e as InvalidValueError).keys).toEqual(['K']);
        }
    });
});

describe('reader options', () => {
    it('treats an empty number as not parseable', () => {
        const instance = createRecordEnvix({ E: '', B: '  ' });

        expect(instance.readNumber('E')).toBeUndefined();
        expect(instance.readNumber('E', { default: 7 })).toBe(7);
        expect(instance.readNumber('B', { default: 7 })).toBe(7);
    });

    it('keeps an empty array unless min requires elements', () => {
        const instance = createRecordEnvix({ E: '' });

        expect(instance.readArray('E')).toEqual([]);
        expect(instance.readArray('E', { min: 1, default: ['d'] })).toEqual(['d']);
    });

    it('passes separator through to array readers', () => {
        const instance = createRecordEnvix({ L: 'a;b', N: '1;2' });

        expect(instance.readArray('L', { separator: ';' })).toEqual(['a', 'b']);
        expect(instance.readNumberArray('N', { separator: ';' })).toEqual([1, 2]);
        expect(createRecordEnvix({ B: 'true;0' }).readBoolArray('B', { separator: ';' })).toEqual([true, false]);
    });

    it('gives readNumberArray a default', () => {
        expect(createRecordEnvix({ N: '1,foo' }).readNumberArray('N', { default: [0] })).toEqual([0]);
    });

    it('maps array entries and treats an unmapped entry as invalid', () => {
        const instance = createRecordEnvix({ P: '80,443', X: '80,4.5' });
        const toInteger = (item: number) => (Number.isSafeInteger(item) ? item : undefined);

        expect(instance.readArray('P', { map: (item) => Number(item) })).toEqual([80, 443]);
        expect(instance.readNumberArray('P', { map: toInteger })).toEqual([80, 443]);
        expect(instance.readNumberArray('X', { map: toInteger })).toBeUndefined();
        expect(instance.readNumberArray('X', { map: toInteger, default: [1] })).toEqual([1]);
        expect(instance.readArray('X', { map: (item) => (item.includes('.') ? undefined : item), default: [] })).toEqual([]);

        try {
            instance.readNumberArray('X', { map: toInteger, required: true });
            expect.unreachable();
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidValueError);
            expect((e as InvalidValueError).keys).toEqual(['X']);
        }
    });

    it('applies strict parsing on request only', () => {
        const instance = createRecordEnvix({ P: '12px', H: '0x10' });

        expect(instance.readInt('P')).toBe(12);
        expect(instance.readInt('P', { strict: true, default: 1 })).toBe(1);
        expect(instance.readFloat('P', { strict: true })).toBeUndefined();
        expect(instance.readNumber('H')).toBe(16);
        expect(instance.readNumber('H', { strict: true })).toBeUndefined();
        expect(instance.readNumberArray('H', { strict: true })).toBeUndefined();
    });

    it('does not fall through when the first set key is empty or invalid', () => {
        const instance = createRecordEnvix({ APP_PORT: '', PORT: '8080' });

        expect(instance.readInt(['APP_PORT', 'PORT'], { default: 1 })).toBe(1);
        expect(instance.readInt(['MISSING', 'PORT'])).toBe(8080);
    });

    it('lists every checked key when none is set', () => {
        try {
            createRecordEnvix({}).readBool(['A', 'B'], { required: true });
            expect.unreachable();
        } catch (e) {
            expect((e as NotSetError).keys).toEqual(['A', 'B']);
        }
    });

    it('never exposes the raw value in errors', () => {
        const instance = createRecordEnvix({ DATABASE_URL: 'postgres://u:secret@h' });

        try {
            instance.readInt('DATABASE_URL', { required: true });
            expect.unreachable();
        } catch (e) {
            const error = e as InvalidValueError;
            const serialized = JSON.stringify({
                ...error,
                message: error.message,
                json: error.toJSON(), 
            });

            expect(serialized).not.toContain('secret');
        }
    });

    it('works as detached methods and free functions', () => {
        process.env.DETACHED_PORT = '5';

        const { readInt: detached } = envix;

        expect(detached('DETACHED_PORT')).toBe(5);
        expect(readInt('DETACHED_PORT')).toBe(5);

        delete process.env.DETACHED_PORT;
    });

    it('narrows return types from the options', () => {
        const instance = createRecordEnvix({
            P: '1', 
            L: 'a', 
            B: 'true', 
        });

        expectTypeOf(instance.readInt('P')).toEqualTypeOf<number | undefined>();
        expectTypeOf(instance.readInt('P', { default: 3000 })).toEqualTypeOf<number>();
        expectTypeOf(instance.readInt('P', { default: 'auto' as const })).toEqualTypeOf<number | 'auto'>();
        expectTypeOf(instance.readInt('P', { required: true })).toEqualTypeOf<number>();
        expectTypeOf(instance.readArray('L', { default: [] as string[] })).toEqualTypeOf<string[]>();
        expectTypeOf(instance.readBool('B', { required: true })).toEqualTypeOf<boolean>();
        expectTypeOf(instance.readBoolArray('B')).toEqualTypeOf<boolean[] | undefined>();
        expectTypeOf(instance.readBoolArray('B', { required: true })).toEqualTypeOf<boolean[]>();
        expectTypeOf(instance.readBoolArray('B', { default: null })).toEqualTypeOf<boolean[] | null>();
        expectTypeOf(instance.readArray('L', { map: (item) => item.length })).toEqualTypeOf<number[] | undefined>();
        expectTypeOf(instance.readArray('L', { map: (item) => item.length, required: true })).toEqualTypeOf<number[]>();
        expectTypeOf(instance.readArray('L', { map: (item) => item.length, default: null })).toEqualTypeOf<number[] | null>();
        expectTypeOf(instance.readArray('L', {
            map: (item) => (item === 'a' || item === 'b' ? item : undefined),
            required: true,
        })).toEqualTypeOf<('a' | 'b')[]>();
        expectTypeOf(instance.readNumberArray('P', { map: (item) => item, required: true })).toEqualTypeOf<number[]>();

        // @ts-expect-error readNumberArray map must return a number
        instance.readNumberArray('L', { map: (item: number) => String(item) });

        // @ts-expect-error required and default are mutually exclusive
        instance.readInt('P', { required: true, default: 1 });
    });

    it('narrows return types of the free functions', () => {
        expectTypeOf(read()).toEqualTypeOf<Record<string, string | undefined>>();
        expectTypeOf(read('UNSET_TYPE_KEY')).toEqualTypeOf<string | undefined>();
        expectTypeOf(read('UNSET_TYPE_KEY', { default: 'x' })).toEqualTypeOf<string>();
        expectTypeOf(readInt('UNSET_TYPE_KEY')).toEqualTypeOf<number | undefined>();
        expectTypeOf(readInt('UNSET_TYPE_KEY', { default: 3000 })).toEqualTypeOf<number>();
        expectTypeOf(readFloat('UNSET_TYPE_KEY', { default: 1.5, strict: true })).toEqualTypeOf<number>();
        expectTypeOf(readNumber('UNSET_TYPE_KEY', { default: null })).toEqualTypeOf<number | null>();
        expectTypeOf(readBool('UNSET_TYPE_KEY', { default: false })).toEqualTypeOf<boolean>();
        expectTypeOf(readArray('UNSET_TYPE_KEY', { default: [] as string[], max: 2 })).toEqualTypeOf<string[]>();
        expectTypeOf(readNumberArray('UNSET_TYPE_KEY', { default: [0] })).toEqualTypeOf<number[]>();
        expectTypeOf(readBoolArray('UNSET_TYPE_KEY', { default: [false] })).toEqualTypeOf<boolean[]>();
        expectTypeOf(readArray('UNSET_TYPE_KEY', { map: Number, default: [] as number[] })).toEqualTypeOf<number[]>();
        expectTypeOf(readArray('UNSET_TYPE_KEY', { map: (item) => item.length })).toEqualTypeOf<number[] | undefined>();
        expectTypeOf(has('UNSET_TYPE_KEY')).toEqualTypeOf<boolean>();
        expectTypeOf(write).parameters.toEqualTypeOf<[string, string | undefined]>();

        // required wins at runtime when the type error is bypassed
        // @ts-expect-error required and default are mutually exclusive
        expect(() => readInt('UNSET_TYPE_KEY', { required: true, default: 1 })).toThrow(NotSetError);
    });
});
