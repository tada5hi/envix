export type NumberParseOptions = {
    /**
     * Require the whole trimmed value to be plain decimal notation.
     * Rejects trailing text (12px), hex (0x10), Infinity and NaN.
     *
     * default: false
     */
    strict?: boolean,
};

export type ArrayParseOptions = {
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

export type NumberArrayParseOptions = ArrayParseOptions & NumberParseOptions;
