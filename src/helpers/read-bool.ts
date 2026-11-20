import { envix } from '../instance';
import type { Envix } from '../module';

export const readBool : Envix['readBool'] = envix.readBool.bind(envix);
