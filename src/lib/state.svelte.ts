export type FileMeta = {
	name: string;
	type: string;
	path: string;
};

export type ChikenState = {
	currentTable: unknown[][];
	scratch: string[];
	files: string[];
};

export const appState = $state<ChikenState>({
	currentTable: [],
	scratch: [],
	files: [],
});

// $state.snapshot

export const load = async () => {}

// export const load = async () => {}