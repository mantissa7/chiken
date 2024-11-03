export type FileMeta = {
	name: string;
	type: string;
	path: string;
};

export type ChikenState = {
	activeScratch: string;
	currentTable: unknown[][];
	scratch: string[];
	files: string[];
};

export const appState = $state<ChikenState>({
	activeScratch: 'default',
	currentTable: [],
	scratch: [],
	files: [],
});

// $state.snapshot

export const load = async () => {}

// export const load = async () => {}