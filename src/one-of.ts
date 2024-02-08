type Unwrap<T> = T extends Array<infer Return> ? Return : T;
export function oneOf<T extends any[]>(input: T): Unwrap<T> | undefined {
    for (let i = 0; i < input.length; i++) {
        if (typeof input[i] !== 'undefined') {
            return input[i];
        }
    }

    return undefined;
}
