import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * OAuth callback handler
 * 
 * This route handles the callback from Supabase OAuth providers (Google, etc.)
 * It exchanges the code for a session and redirects to the home page.
 */
export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			throw redirect(303, next);
		}
	}

	// If something went wrong, redirect to error page or home
	throw redirect(303, '/auth/error');
};
