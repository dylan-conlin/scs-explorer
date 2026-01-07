import { getFinishOptions, getMaterials } from '$lib/scs-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [finishes, materials] = await Promise.all([
		getFinishOptions(fetch),
		getMaterials({ fetch })
	]);
	return { finishes, materials };
};
