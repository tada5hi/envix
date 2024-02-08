import { read } from './read';
import { toNumber } from './utils';

export function readNumber(key: string) : number | undefined;
export function readNumber<T>(key: string, alt: T) : T | number;
export function readNumber<T>(key: string, alt?: T) : any {
    const value = read(key) as any;
    if (typeof value !== 'undefined') {
        return toNumber(value) ?? alt;
    }

    return alt;
}
