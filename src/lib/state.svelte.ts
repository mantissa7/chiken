export type ChikenFile = {
	name: string;
	type: string;
	text: string;
	data?: unknown[];
};

export type ChikenState = {
	currentTable: unknown[];
	files: ChikenFile[];
};

export const app = $state<ChikenState>({
	currentTable: [],
	files: [],
});

// $state.snapshot

// export default state;
