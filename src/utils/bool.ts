export function toBool(value: any) : boolean | undefined {
    switch (value) {
        case true:
        case 'true':
        case 't':
        case '1':
            return true;
        case false:
        case 'false':
        case 'f':
        case '0':
            return false;
    }

    return undefined;
}
