import { envix } from '../instance';
import type { Envix } from '../module';

export const readFloat : Envix['readFloat'] = envix.readFloat.bind(envix);
