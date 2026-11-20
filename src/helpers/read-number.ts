import { envix } from '../instance';
import type { Envix } from '../module';

export const readNumber : Envix['readNumber'] = envix.readNumber.bind(envix);
