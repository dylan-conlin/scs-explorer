<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { getFinishTypes, type FinishOption } from '$lib/scs-api';

	interface Props {
		data: {
			finishes: FinishOption[];
		};
	}

	let { data }: Props = $props();

	// Filter state
	let selectedType = $state<string>('');

	// Derived values
	let finishTypes = $derived(getFinishTypes(data.finishes));
	
	let filteredFinishes = $derived(
		data.finishes.filter(f => {
			if (!f.public || f.deleted) return false;
			if (selectedType && f.finish_type !== selectedType) return false;
			return true;
		})
	);
</script>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="border-b">
		<div class="container mx-auto px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Button href="/" variant="ghost" size="sm">← Back</Button>
				<h1 class="text-2xl font-bold">Finish Options</h1>
				<span class="text-sm text-muted-foreground">
					{filteredFinishes.length} options
				</span>
			</div>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		<!-- Filters -->
		<div class="mb-8 flex flex-wrap gap-4 items-center">
			<select
				bind:value={selectedType}
				class="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			>
				<option value="">All Types</option>
				{#each finishTypes as type}
					<option value={type}>{type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
				{/each}
			</select>

			{#if selectedType}
				<Button 
					variant="ghost" 
					size="sm"
					onclick={() => selectedType = ''}
				>
					Clear Filter
				</Button>
			{/if}
		</div>

		<!-- Finishes Grid -->
		<div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
			{#each filteredFinishes as finish (finish.id)}
				<Card class="overflow-hidden hover:shadow-lg transition-shadow">
					<!-- Color Swatch -->
					<div 
						class="aspect-square relative overflow-hidden"
						style:background-color={finish.swatch?.dark ? '#1a1a1a' : '#f5f5f5'}
					>
						{#if finish.swatch?.url}
							<img
								src={finish.swatch.url}
								alt={finish.color}
								class="object-cover w-full h-full"
								loading="lazy"
							/>
						{:else if finish.example_image_url}
							<img
								src={finish.example_image_url}
								alt={finish.color}
								class="object-cover w-full h-full"
								loading="lazy"
							/>
						{/if}
					</div>
					<CardHeader class="pb-2">
						<CardTitle class="text-base leading-tight">{finish.color}</CardTitle>
					</CardHeader>
					<CardContent class="pt-0">
						<div class="space-y-1 text-sm text-muted-foreground">
							<p class="capitalize">{finish.finish_type.replace('_', ' ')}</p>
							{#if finish.code}
								<p class="text-xs">{finish.code}</p>
							{/if}
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		{#if filteredFinishes.length === 0}
			<div class="text-center py-12">
				<p class="text-muted-foreground">No finishes match your filter.</p>
				<Button variant="outline" class="mt-4" onclick={() => selectedType = ''}>
					Clear Filter
				</Button>
			</div>
		{/if}
	</main>
</div>
