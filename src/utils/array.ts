export function toArray(
    input: any,
    separator : string = ',',
) : string[] {
    if (typeof input !== 'string') {
        return [];
    }

    return input
        .split(separator)
        .map((el) => el.trim())
        .filter(Boolean);
}
