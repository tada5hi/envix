import { envix } from '../instance';
import type { Envix } from '../module';

export const write : Envix['write'] = envix.write.bind(envix);
