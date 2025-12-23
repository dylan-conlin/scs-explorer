import { getHardware } from '$lib/scs-api';

export const load = async () => {
	const hardware = await getHardware();
	return { hardware };
};
