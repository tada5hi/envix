type Unwrap<T> = T extends Array<infer Return> ? Return : T;
export function oneOf<T extends any[]>(input: T): Unwrap<T> | undefined {
    for (const element of input) {
        if (typeof element !== 'undefined') {
            return element;
        }
    }

    return undefined;
}
