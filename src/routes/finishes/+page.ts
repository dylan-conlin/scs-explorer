import { getFinishOptions } from '$lib/scs-api';

export const load = async ({ fetch }) => {
	const finishes = await getFinishOptions(fetch);
	return { finishes };
};
