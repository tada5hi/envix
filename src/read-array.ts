import { read } from './read';
import { toArray } from './utils';

export function readArray(key: string) : string[] | undefined;
export function readArray(key: string, alt: string[]) : string[];
export function readArray(key: string, alt?: string[]): any {
    const value = read(key);
    if (typeof value === 'undefined') {
        return alt;
    }

    return toArray(value) ?? alt;
}
