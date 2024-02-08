import { env } from 'std-env';

export function has(key: string) : boolean {
    if (Reflect.has(env, key)) {
        return true;
    }

    /* istanbul ignore next */
    return Reflect.has(globalThis.process?.env, key);
}
