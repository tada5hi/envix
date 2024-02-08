import { env } from 'std-env';

export function read() : Record<string, string | undefined>;
export function read(key: string) : string | undefined;
export function read<T>(key: string, alt: T) : T | string;
export function read<T>(key?: string, alt?: T): any {
    if (typeof key === 'undefined') {
        const keys = Reflect.ownKeys(env) as string[];
        const output : Record<string, string | undefined> = {};
        for (let i = 0; i < keys.length; i++) {
            output[keys[i]] = env[keys[i]];
        }
        return output;
    }

    if (Reflect.has(env, key)) {
        return env[key];
    }

    /* istanbul ignore next */
    if (Reflect.has(globalThis.process?.env, key)) {
        return globalThis.process?.env[key];
    }

    return alt;
}
