// Polyfill for localStorage in Node.js environments
// This fixes issues with Node.js v22+ where --localstorage-file flag creates a broken localStorage

if (typeof window === "undefined") {
	// Server-side: ensure localStorage is not broken
	const storage: Record<string, string> = {};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).localStorage = {
		getItem: (key: string) => storage[key] ?? null,
		setItem: (key: string, value: string) => {
			storage[key] = value;
		},
		removeItem: (key: string) => {
			delete storage[key];
		},
		clear: () => {
			Object.keys(storage).forEach((key) => delete storage[key]);
		},
		get length() {
			return Object.keys(storage).length;
		},
		key: (index: number) => Object.keys(storage)[index] ?? null,
	};
}

export {};

