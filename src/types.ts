/**
 * An environment variable key, or a list of keys in order of precedence.
 * With a list, the first key that is set wins.
 */
export type EnvixKey = string | string[];

/**
 * The environment source an Envix instance reads from and writes to.
 */
export type EnvixOptions = {
    /**
     * Return the value of a key, or undefined when it is not set.
     */
    read: (key: string) => string | undefined,
    /**
     * Set a key, or remove it when the value is undefined.
     * Without it, write() throws an UnsupportedOperationError.
     */
    write?: (key: string, value: string | undefined) => void,
    /**
     * List all set keys.
     * Without it, read() without a key throws an UnsupportedOperationError.
     */
    keys?: () => string[],
};

/**
 * default and required are mutually exclusive.
 */
export type ReadOptions<D = unknown> = {
    /**
     * Returned when no key is set or the value does not parse.
     */
    default?: D,
    required?: false,
} | {
    default?: undefined,
    /**
     * Throw a NotSetError or InvalidValueError instead of returning undefined.
     */
    required?: boolean,
};

export type OptionalReadOptions<O extends object = object> = O & {
    default?: undefined,
    required?: false,
};

export type DefaultReadOptions<D, O extends object = object> = O & {
    default: D,
    required?: false,
};

export type RequiredReadOptions<O extends object = object> = O & {
    default?: undefined,
    required: true,
};
