import { read } from './read';

export function readArray(key: string) : string[] | undefined {
    const value = read(key);
    if (typeof value === 'undefined') {
        return undefined;
    }

    return value.split(',');
}
