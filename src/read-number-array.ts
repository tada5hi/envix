import { read } from './read';
import { toNumber } from './utils';

export function readNumberArray(key: string) : number[] | undefined {
    const value = read(key);
    if (!value) {
        return undefined;
    }

    const nums = value.split(',').map((el) => toNumber(el));
    if (nums.some((el) => typeof el === 'undefined')) {
        return undefined;
    }

    return nums as number[];
}
