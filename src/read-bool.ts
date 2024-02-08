import { read } from './read';
import { toBool } from './utils';

export function readBool(key: string) : boolean | undefined;
export function readBool<T>(key: string, alt: T) : T | boolean;
export function readBool<T>(key: string, alt?: T) : any {
    const value = read(key) as any;
    if (typeof value !== 'undefined') {
        return toBool(value) ?? alt;
    }

    return alt;
}
