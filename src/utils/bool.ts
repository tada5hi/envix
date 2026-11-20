export function toBool(value: any) : boolean | undefined {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value !== 'string') {
        return undefined;
    }

    switch (value.trim().toLowerCase()) {
        case 'true':
        case 't':
        case '1':
            return true;
        case 'false':
        case 'f':
        case '0':
            return false;
    }

    return undefined;
}
