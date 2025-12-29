import { getMaterials } from '$lib/scs-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const materials = await getMaterials({ fetch });
	return { materials };
};
