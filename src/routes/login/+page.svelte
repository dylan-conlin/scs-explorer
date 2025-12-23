<script lang="ts">
	import { createClient } from '$lib/supabase';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let message = $state<string | null>(null);

	const supabase = createClient();

	async function signInWithEmail() {
		loading = true;
		error = null;

		const { error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (signInError) {
			error = signInError.message;
		} else {
			window.location.href = '/';
		}

		loading = false;
	}

	async function signUpWithEmail() {
		loading = true;
		error = null;

		const { error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/auth/callback`
			}
		});

		if (signUpError) {
			error = signUpError.message;
		} else {
			message = 'Check your email for the confirmation link!';
		}

		loading = false;
	}

	async function signInWithGoogle() {
		loading = true;
		error = null;

		const { error: oauthError } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});

		if (oauthError) {
			error = oauthError.message;
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<Card class="w-full max-w-md">
		<CardHeader class="text-center">
			<CardTitle class="text-2xl">Welcome to SCS Explorer</CardTitle>
			<CardDescription>Sign in to save favorites and access your data</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<!-- Google OAuth -->
				<Button 
					variant="outline" 
					class="w-full" 
					onclick={signInWithGoogle}
					disabled={loading}
				>
					<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Continue with Google
				</Button>

				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t"></span>
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-card px-2 text-muted-foreground">Or continue with email</span>
					</div>
				</div>

				<!-- Email/Password Form -->
				<form class="space-y-4" onsubmit={(e) => { e.preventDefault(); signInWithEmail(); }}>
					<div>
						<label for="email" class="block text-sm font-medium mb-1">Email</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="you@example.com"
							class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
							required
						/>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium mb-1">Password</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							placeholder="Your password"
							class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
							required
						/>
					</div>

					{#if error}
						<p class="text-sm text-destructive">{error}</p>
					{/if}

					{#if message}
						<p class="text-sm text-green-600">{message}</p>
					{/if}

					<div class="flex gap-2">
						<Button type="submit" class="flex-1" disabled={loading}>
							{loading ? 'Loading...' : 'Sign In'}
						</Button>
						<Button 
							type="button" 
							variant="outline" 
							class="flex-1" 
							onclick={signUpWithEmail}
							disabled={loading}
						>
							Sign Up
						</Button>
					</div>
				</form>
			</div>
		</CardContent>
	</Card>
</div>
