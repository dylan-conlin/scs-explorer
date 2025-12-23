import { getFinishOptions } from '$lib/scs-api';

export const load = async () => {
	const finishes = await getFinishOptions();
	return { finishes };
};
