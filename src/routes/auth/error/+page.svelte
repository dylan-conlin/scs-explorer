<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="text-center">
		<h1 class="text-2xl font-bold text-destructive mb-4">Authentication Error</h1>
		<p class="text-muted-foreground mb-6">Something went wrong during sign in. Please try again.</p>
		<Button href="/login">Back to Login</Button>
	</div>
</div>
