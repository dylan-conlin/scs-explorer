import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from './database.types';

/**
 * Create a Supabase client for browser-side usage
 */
export function createClient() {
	return createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Create a Supabase client for server-side usage (in +page.server.ts, +layout.server.ts, hooks)
 * 
 * @param fetch - The fetch function from the server context
 * @param cookies - Cookie handling for session management
 */
export function createServerSupabaseClient(
	fetch: typeof globalThis.fetch,
	cookies: {
		getAll: () => { name: string; value: string }[];
		setAll: (cookies: { name: string; value: string; options?: object }[]) => void;
	}
) {
	return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookies.setAll(cookiesToSet);
			}
		},
		global: {
			fetch
		}
	});
}

/**
 * Check if we're running in the browser
 */
export { isBrowser };
