import { getMaterials } from '$lib/scs-api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const materials = await getMaterials({ fetch });
	return { materials };
};
