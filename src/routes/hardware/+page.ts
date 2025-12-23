import { getHardware } from '$lib/scs-api';

export const load = async ({ fetch }) => {
	const hardware = await getHardware({ fetch });
	return { hardware };
};
