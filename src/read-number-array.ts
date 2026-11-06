import { readArray } from './read-array';
import { toNumber } from './utils';

export function readNumberArray(key: string) : number[] | undefined {
    const value = readArray(key);

    if (!value) {
        return undefined;
    }

    const nums = value.map((el) => toNumber(el));

    const hasInvalidNumber = nums.some((el) => typeof el === 'undefined');

    if (hasInvalidNumber) {
        return undefined;
    }

    return nums as number[];
}
