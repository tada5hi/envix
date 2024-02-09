import { read } from './read';
import { toFloat } from './utils';

export function readFloat(key: string) : number | undefined;
export function readFloat<T>(key: string, alt: T) : T | number;
export function readFloat<T>(key: string, alt?: T) : any {
    const value = read(key) as any;
    if (typeof value !== 'undefined') {
        return toFloat(value) ?? alt;
    }

    return alt;
}
