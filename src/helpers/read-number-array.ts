import { envix } from '../instance';
import type { Envix } from '../module';

export const readNumberArray : Envix['readNumberArray'] = envix.readNumberArray.bind(envix);
