type Unwrap<T> = T extends Array<infer Return> ? Return : T;
export function oneOf<T extends any[]>(input: T): Unwrap<T> | undefined {
    return input.find((element) => typeof element !== 'undefined');
}
