import { read } from './read';

export function readArray(key: string) : string[] | undefined;
export function readArray(key: string, alt: string[]) : string[];
export function readArray(key: string, alt?: string[]): any {
    const value = read(key);
    if (typeof value === 'undefined') {
        return alt;
    }

    return value.split(',').filter(Boolean);
}
