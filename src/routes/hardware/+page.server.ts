import { getHardware } from '$lib/scs-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const hardware = await getHardware({ fetch });
	return { hardware };
};
