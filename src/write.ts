import { env } from 'std-env';

export function write(key: string, value: string | undefined) {
    if (typeof value === 'undefined') {
        delete env[key];
        return;
    }

    env[key] = value;
}
