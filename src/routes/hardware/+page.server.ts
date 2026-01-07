import { getHardware, getMaterials } from '$lib/scs-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [hardware, materials] = await Promise.all([
		getHardware({ fetch }),
		getMaterials({ fetch })
	]);
	return { hardware, materials };
};
