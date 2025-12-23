import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Logout handler
 *
 * This route handles user sign out by clearing the Supabase session
 * and redirecting to the home page.
 */
export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	await supabase.auth.signOut();
	throw redirect(303, '/');
};
