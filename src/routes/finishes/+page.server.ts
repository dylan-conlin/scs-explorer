import { getFinishOptions } from '$lib/scs-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const finishes = await getFinishOptions(fetch);
	return { finishes };
};
