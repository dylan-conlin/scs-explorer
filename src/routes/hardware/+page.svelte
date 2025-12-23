<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { getHardwareCategories, type Hardware } from '$lib/scs-api';

	interface Props {
		data: {
			hardware: Hardware[];
		};
	}

	let { data }: Props = $props();

	// Filter state
	let selectedCategory = $state<string>('');
	let searchQuery = $state('');
	let showInStockOnly = $state(false);

	// Derived values
	let categories = $derived(getHardwareCategories(data.hardware));
	
	let filteredHardware = $derived(
		data.hardware.filter(h => {
			if (selectedCategory && h.category !== selectedCategory) return false;
			if (showInStockOnly && h.out_of_stock) return false;
			if (searchQuery) {
				const search = searchQuery.toLowerCase();
				const searchable = `${h.sku} ${h.category} ${h.subcategory}`.toLowerCase();
				if (!searchable.includes(search)) return false;
			}
			return true;
		})
	);

	function getDescription(hw: Hardware, field: string): string | null {
		return hw.descriptions.find(d => d.field === field)?.value ?? null;
	}
</script>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="border-b">
		<div class="container mx-auto px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Button href="/" variant="ghost" size="sm">← Back</Button>
				<h1 class="text-2xl font-bold">Hardware</h1>
				<span class="text-sm text-muted-foreground">
					{filteredHardware.length} of {data.hardware.length}
				</span>
			</div>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		<!-- Filters -->
		<div class="mb-8 flex flex-wrap gap-4 items-center">
			<input
				type="text"
				placeholder="Search hardware..."
				bind:value={searchQuery}
				class="rounded-md border border-input bg-background px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-ring"
			/>

			<select
				bind:value={selectedCategory}
				class="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			>
				<option value="">All Categories</option>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>

			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" bind:checked={showInStockOnly} class="rounded" />
				In Stock Only
			</label>

			{#if selectedCategory || searchQuery || showInStockOnly}
				<Button 
					variant="ghost" 
					size="sm"
					onclick={() => {
						selectedCategory = '';
						searchQuery = '';
						showInStockOnly = false;
					}}
				>
					Clear Filters
				</Button>
			{/if}
		</div>

		<!-- Hardware Grid -->
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each filteredHardware as hw (hw.id)}
				<Card class="overflow-hidden hover:shadow-lg transition-shadow">
					{#if hw.preview_url}
						<div class="aspect-square relative overflow-hidden bg-muted">
							<img
								src={hw.preview_url}
								alt={hw.sku}
								class="object-contain w-full h-full p-4"
								loading="lazy"
							/>
							{#if hw.out_of_stock}
								<span class="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
									Out of Stock
								</span>
							{/if}
						</div>
					{/if}
					<CardHeader class="pb-2">
						<CardTitle class="text-base leading-tight">{hw.sku}</CardTitle>
					</CardHeader>
					<CardContent class="pt-0">
						<div class="space-y-1 text-sm text-muted-foreground">
							<p><span class="font-medium">Category:</span> {hw.category}</p>
							<p><span class="font-medium">Type:</span> {hw.subcategory}</p>
							{#if getDescription(hw, 'Thread Size')}
								<p><span class="font-medium">Thread:</span> {getDescription(hw, 'Thread Size')}</p>
							{/if}
						</div>
						<div class="flex gap-2 mt-3">
							{#if hw.preview_url_tech}
								<Button href={hw.preview_url_tech} variant="outline" size="sm" target="_blank">
									Tech Drawing
								</Button>
							{/if}
							{#if hw.model_url}
								<Button href={hw.model_url} variant="outline" size="sm" target="_blank">
									3D Model
								</Button>
							{/if}
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		{#if filteredHardware.length === 0}
			<div class="text-center py-12">
				<p class="text-muted-foreground">No hardware matches your filters.</p>
				<Button variant="outline" class="mt-4" onclick={() => {
					selectedCategory = '';
					searchQuery = '';
					showInStockOnly = false;
				}}>
					Clear Filters
				</Button>
			</div>
		{/if}
	</main>
</div>
