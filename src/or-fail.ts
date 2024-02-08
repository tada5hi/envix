export function orFail<T>(output: T) : Exclude<T, undefined> {
    if (typeof output === 'undefined') {
        throw new Error('The environment variable could not be read.');
    }

    return output as Exclude<T, undefined>;
}
