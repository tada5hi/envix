import { envix } from '../instance';
import type { Envix } from '../module';

export const read : Envix['read'] = envix.read.bind(envix);
