<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		data: {
			session: import('@supabase/supabase-js').Session | null;
		};
	}

	let { data }: Props = $props();
</script>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="border-b">
		<div class="container mx-auto px-4 py-4 flex items-center justify-between">
			<h1 class="text-2xl font-bold">
				<span class="text-[--color-scs-orange]">SCS</span> Explorer
			</h1>
			<nav class="flex items-center gap-4">
				{#if data.session}
					<span class="text-sm text-muted-foreground">{data.session.user.email}</span>
					<form method="POST" action="/logout">
						<Button variant="outline" size="sm">Sign Out</Button>
					</form>
				{:else}
					<a href="/login" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
					Sign In
				</a>
				{/if}
			</nav>
		</div>
	</header>

	<!-- Main Content -->
	<main class="container mx-auto px-4 py-8">
		<div class="text-center mb-12">
			<h2 class="text-4xl font-bold mb-4">Explore SendCutSend Products</h2>
			<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
				Browse materials, hardware, and finish options from the SendCutSend catalog.
				Save your favorites and compare specifications.
			</p>
		</div>

		<!-- Category Cards -->
		<div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
			<a href="/materials" class="block group">
				<Card class="h-full transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<span class="text-3xl">🔩</span>
							Materials
						</CardTitle>
						<CardDescription>
							146 materials including metals, plastics, and composites
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="text-sm text-muted-foreground">
							Aluminum, Steel, Titanium, Acrylic, HDPE, and more.
							View specifications, datasheets, and pricing.
						</p>
					</CardContent>
				</Card>
			</a>

			<a href="/hardware" class="block group">
				<Card class="h-full transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<span class="text-3xl">🔧</span>
							Hardware
						</CardTitle>
						<CardDescription>
							151 hardware items for assembly
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="text-sm text-muted-foreground">
							Nuts, studs, standoffs, and more.
							View 3D models and technical drawings.
						</p>
					</CardContent>
				</Card>
			</a>

			<a href="/finishes" class="block group">
				<Card class="h-full transition-shadow hover:shadow-lg">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<span class="text-3xl">🎨</span>
							Finishes
						</CardTitle>
						<CardDescription>
							24 finish options for your parts
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="text-sm text-muted-foreground">
							Anodizing, powder coating, and more.
							Browse colors and see examples.
						</p>
					</CardContent>
				</Card>
			</a>
		</div>

		<!-- API Info -->
		<div class="mt-12 text-center">
			<p class="text-sm text-muted-foreground">
				Data from the 
				<a href="https://app.sendcutsend.com" class="underline hover:text-foreground">
					SendCutSend Public API
				</a>
			</p>
		</div>
	</main>
</div>
