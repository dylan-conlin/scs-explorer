import { createServerSupabaseClient } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a Supabase client for this request
	event.locals.supabase = createServerSupabaseClient(event.fetch, {
		getAll: () => event.cookies.getAll(),
		setAll: (cookies) => {
			cookies.forEach(({ name, value, options }) => {
				event.cookies.set(name, value, { path: '/', ...options });
			});
		}
	});

	// Get the session (will refresh if needed)
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
