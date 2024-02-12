import { read } from './read';
import { toArray, toNumber } from './utils';

export function readNumberArray(key: string) : number[] | undefined {
    const value = read(key);
    if (!value) {
        return undefined;
    }

    const nums = toArray(value)
        .map((el) => toNumber(el));

    if (nums.some((el) => typeof el === 'undefined')) {
        return undefined;
    }

    return nums as number[];
}
