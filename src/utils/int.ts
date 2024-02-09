export function toInt(value: any) : number | undefined {
    const num = Number.parseInt(value, 10);
    if (Number.isNaN(num)) {
        return undefined;
    }

    return num;
}
