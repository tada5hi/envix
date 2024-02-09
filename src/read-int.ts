import { read } from './read';
import { toInt } from './utils';

export function readInt(key: string) : number | undefined;
export function readInt<T>(key: string, alt: T) : T | number;
export function readInt<T>(key: string, alt?: T) : any {
    const value = read(key) as any;
    if (typeof value !== 'undefined') {
        return toInt(value) ?? alt;
    }

    return alt;
}
