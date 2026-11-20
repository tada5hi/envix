export type NumberParseOptions = {
    /**
     * Require the whole trimmed value to be plain decimal notation.
     * Rejects trailing text (12px), hex (0x10), Infinity and NaN.
     *
     * default: false
     */
    strict?: boolean,
};

type ListParseOptions = {
    /**
     * default: ','
     */
    separator?: string,
    /**
     * Minimum number of elements, after trimming and dropping empty ones.
     *
     * default: 0
     */
    min?: number,
    /**
     * Maximum number of elements, after trimming and dropping empty ones.
     */
    max?: number,
};

export type ArrayParseOptions<T = string> = ListParseOptions & {
    /**
     * Convert each entry, after min and max are checked.
     * Return undefined to mark the whole value as invalid.
     */
    map?: (item: string) => T | undefined,
};

export type NumberArrayParseOptions = ListParseOptions & NumberParseOptions & {
    /**
     * Convert each parsed number, after min and max are checked.
     * Return undefined to mark the whole value as invalid.
     */
    map?: (item: number) => number | undefined,
};
