import { envix } from '../instance';

export function has(key: string) : boolean {
    return envix.has(key);
}
