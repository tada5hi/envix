import { envix } from '../instance';
import type { Envix } from '../module';

export const readInt : Envix['readInt'] = envix.readInt.bind(envix);
