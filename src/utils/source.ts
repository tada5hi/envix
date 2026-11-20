import type { EnvixOptions } from '../types';

type EnvRecord = Record<string, unknown>;

const memory : EnvRecord = Object.create(null);

function isRecord(input: unknown) : input is EnvRecord {
    return typeof input === 'object' && input !== null;
}

/**
 * Pick the source for the current call: process.env, then
 * globalThis.__env__, then an in-memory record. One source handles
 * every operation of a call; sources are never merged.
 */
function current() : EnvRecord {
    const processEnv = globalThis.process?.env;

    if (isRecord(processEnv)) {
        return processEnv;
    }

    const globalEnv = (globalThis as Record<string, unknown>).__env__;

    if (isRecord(globalEnv)) {
        return globalEnv;
    }

    return memory;
}

function readOwnString(record: EnvRecord, key: string) : string | undefined {
    if (!Object.prototype.hasOwnProperty.call(record, key)) {
        return undefined;
    }

    const value = record[key];

    return typeof value === 'string' ? value : undefined;
}

export function createRuntimeSource() : Required<EnvixOptions> {
    return {
        read: (key) => readOwnString(current(), key),
        write: (key, value) => {
            const record = current();

            if (typeof value === 'undefined') {
                delete record[key];
            } else {
                // define an own property, so keys like __proto__ do not hit inherited setters
                Object.defineProperty(record, key, {
                    value,
                    enumerable: true,
                    writable: true,
                    configurable: true,
                });
            }
        },
        keys: () => {
            const record = current();

            return Object.keys(record)
                .filter((key) => typeof record[key] === 'string');
        },
    };
}
