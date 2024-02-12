export function toArray(
    input: string,
    separator : string = ',',
) : string[] {
    return input
        .split(separator)
        .map((el) => el.trim())
        .filter(Boolean);
}
