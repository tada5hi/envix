import { env } from 'std-env';

export function has(key: string) : boolean {
    return Reflect.has(env, key);
}
