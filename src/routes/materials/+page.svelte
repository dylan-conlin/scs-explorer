<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { filterMaterials, getMaterialGroups, getMaterialCategories, type Material } from '$lib/scs-api';

	interface Props {
		data: {
			materials: Material[];
		};
	}

	let { data }: Props = $props();

	// Filter state
	let selectedGroup = $state<string>('');
	let selectedCategory = $state<string>('');
	let searchQuery = $state('');
	let showInStockOnly = $state(false);

	// Derived values
	let groups = $derived(getMaterialGroups(data.materials));
	let categories = $derived(getMaterialCategories(data.materials, selectedGroup || undefined));
	
	let filteredMaterials = $derived(
		filterMaterials(data.materials, {
			group: selectedGroup || undefined,
			category: selectedCategory || undefined,
			search: searchQuery || undefined,
			inStock: showInStockOnly || undefined
		})
	);
</script>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="border-b">
		<div class="container mx-auto px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">← Back</a>
				<h1 class="text-2xl font-bold">Materials</h1>
				<span class="text-sm text-muted-foreground">
					{filteredMaterials.length} of {data.materials.length}
				</span>
			</div>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		<!-- Filters -->
		<div class="sticky top-0 z-10 bg-background pb-4 mb-4 border-b">
			<div class="flex flex-wrap gap-4 items-center pt-4">
			<input
				type="text"
				placeholder="Search materials..."
				bind:value={searchQuery}
				class="rounded-md border border-input bg-background px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-ring"
			/>

			<select
				bind:value={selectedGroup}
				class="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			>
				<option value="">All Groups</option>
				{#each groups as group}
					<option value={group}>{group}</option>
				{/each}
			</select>

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

			{#if selectedGroup || selectedCategory || searchQuery || showInStockOnly}
				<Button 
					variant="ghost" 
					size="sm"
					onclick={() => {
						selectedGroup = '';
						selectedCategory = '';
						searchQuery = '';
						showInStockOnly = false;
					}}
				>
					Clear Filters
				</Button>
			{/if}
			</div>
		</div>

		<!-- Materials Grid -->
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each filteredMaterials as material (material.id)}
				<Card class="overflow-hidden hover:shadow-lg transition-shadow">
					{#if material.example_image_url}
						<div class="aspect-square relative overflow-hidden bg-muted">
							<img
								src={material.example_image_url}
								alt={material.name}
								class="object-cover w-full h-full"
								loading="lazy"
							/>
							{#if material.out_of_stock}
								<span class="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
									Out of Stock
								</span>
							{/if}
							{#if material.new_material}
								<span class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
									New
								</span>
							{/if}
						</div>
					{/if}
					<CardHeader class="pb-2">
						<CardTitle class="text-base leading-tight">{material.fullname}</CardTitle>
					</CardHeader>
					<CardContent class="pt-0">
						<div class="space-y-1 text-sm text-muted-foreground">
							<p><span class="font-medium">SKU:</span> {material.sku}</p>
							<p><span class="font-medium">Category:</span> {material.category}</p>
							<p><span class="font-medium">Group:</span> {material.group}</p>
							{#if material.category_description}
								<p class="text-xs italic">{material.category_description}</p>
							{/if}
						</div>
						{#if material.learn_more_url}
							<Button href={material.learn_more_url} variant="link" size="sm" class="mt-2 px-0" target="_blank">
								Learn More →
							</Button>
						{/if}
					</CardContent>
				</Card>
			{/each}
		</div>

		{#if filteredMaterials.length === 0}
			<div class="text-center py-12">
				<p class="text-muted-foreground">No materials match your filters.</p>
				<Button variant="outline" class="mt-4" onclick={() => {
					selectedGroup = '';
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
