import { getMaterials } from '$lib/scs-api';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const materials = await getMaterials();
	return { materials };
};
