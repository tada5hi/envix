import { envix } from '../instance';
import type { Envix } from '../module';

export const readArray : Envix['readArray'] = envix.readArray.bind(envix);
