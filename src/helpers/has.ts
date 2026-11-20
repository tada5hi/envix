import { envix } from '../instance';
import type { Envix } from '../module';

export const has : Envix['has'] = envix.has.bind(envix);
