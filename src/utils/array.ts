export function toArray(
    input: any,
    separator : string = ',',
) : string[] | undefined {
    if (typeof input !== 'string') {
        return undefined;
    }

    return input
        .split(separator)
        .map((el) => el.trim())
        .filter(Boolean);
}
