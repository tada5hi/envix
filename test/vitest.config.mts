import { defineConfig } from 'vitest/config';

export default defineConfig({
    "test": {
        "include": [
            "test/unit/**/*.{js,jsx,ts,tsx}",
            "test/**/*.{test,spec}.{js,jsx,ts,tsx}"
        ],
        "exclude": ["**/node_modules/**", "**/dist/**", "test/unit/mock-util.ts"],
        "coverage": {
            "provider": "v8",
            "reportsDirectory": "coverage",
            "include": [
                "src/**/*.{ts,tsx,js,jsx}"
            ],
            "exclude": [],
            "thresholds": {
                "branches": 80,
                "functions": 80,
                "lines": 80,
                "statements": 80
            }
        }
    }
});
