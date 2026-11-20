import { describe, expect, it } from 'vitest';
import * as envix from '../../src';

describe('public exports', () => {
    it('does not expose internal helpers', () => {
        expect(envix).not.toHaveProperty('buildErrorOptions');
        expect(envix).not.toHaveProperty('createRuntimeSource');
        expect(envix).not.toHaveProperty('parseStrictNumber');
    });
});
