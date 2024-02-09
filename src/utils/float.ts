export function toFloat(value: any) : number | undefined {
    const num = Number.parseFloat(value);
    if (Number.isNaN(num) || Number.isNaN(value)) {
        return undefined;
    }

    return num;
}
