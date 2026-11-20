import { envix } from '../instance';

export function write(key: string, value: string | undefined) : void {
    envix.write(key, value);
}
