export function toNumber(value: any) : number | undefined {
    const num = Number(value);
    if (Number.isNaN(num)) {
        return undefined;
    }

    return num;
}
