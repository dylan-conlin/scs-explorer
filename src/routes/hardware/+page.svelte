<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { getHardwareCategories, type Hardware, type Material } from '$lib/scs-api';

	interface Props {
		data: {
			hardware: Hardware[];
			materials: Material[];
		};
	}

	let { data }: Props = $props();

	// Filter state
	let selectedCategory = $state<string>('');
	let selectedMaterial = $state<string>('');
	let selectedThreadType = $state<string>(''); // 'metric' | 'imperial' | ''
	let searchQuery = $state('');
	let showInStockOnly = $state(false);

	// Derived values
	let categories = $derived(getHardwareCategories(data.hardware));

	// Get material types that support hardware installation
	let materialTypes = $derived.by(() => {
		const typeSet = new Set<string>();
		data.materials.forEach(m => {
			// Only include materials that have public hardware operation
			const supportsHardware = m.operations.some(op =>
				op.public && op.operation === 'hardware'
			);
			if (supportsHardware) {
				typeSet.add(m.name);
			}
		});
		return Array.from(typeSet).sort();
	});
	
	let filteredHardware = $derived(
		data.hardware.filter(h => {
			if (selectedCategory && h.category !== selectedCategory) return false;
			// Material filter: check if hardware is compatible with selected material
			if (selectedMaterial) {
				// Find all material IDs that match the selected material name
				const compatibleMaterialIds = data.materials
					.filter(m => m.name === selectedMaterial)
					.map(m => m.id);

				// Check if hardware's material_configurations includes any of these IDs
				const isCompatible = compatibleMaterialIds.some(id =>
					h.material_configurations.includes(id)
				);
				if (!isCompatible) return false;
			}
			if (selectedThreadType) {
				const threadType = getThreadType(h);
				if (threadType !== selectedThreadType) return false;
			}
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

	function getThreadType(hw: Hardware): 'metric' | 'imperial' | 'unknown' {
		const threadSize = getDescription(hw, 'Thread Size');
		if (!threadSize) return 'unknown';

		// Metric threads start with M (e.g., M2.5, M5, M10)
		if (threadSize.trim().toUpperCase().startsWith('M')) {
			return 'metric';
		}

		// Imperial threads typically use # or fractions (e.g., #6, 1/4", 1/2-13)
		return 'imperial';
	}
</script>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="border-b">
		<div class="container mx-auto px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">← Back</a>
				<h1 class="text-2xl font-bold">Hardware</h1>
				<span class="text-sm text-muted-foreground">
					{filteredHardware.length} of {data.hardware.length}
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

			<select
				bind:value={selectedMaterial}
				class="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			>
				<option value="">All Materials</option>
				{#each materialTypes as material}
					<option value={material}>{material}</option>
				{/each}
			</select>

			<select
				bind:value={selectedThreadType}
				class="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			>
				<option value="">All Thread Types</option>
				<option value="metric">Metric</option>
				<option value="imperial">Imperial</option>
			</select>

			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" bind:checked={showInStockOnly} class="rounded" />
				In Stock Only
			</label>

			{#if selectedCategory || selectedMaterial || selectedThreadType || searchQuery || showInStockOnly}
				<Button
					variant="ghost"
					size="sm"
					onclick={() => {
						selectedCategory = '';
						selectedMaterial = '';
						selectedThreadType = '';
						searchQuery = '';
						showInStockOnly = false;
					}}
				>
					Clear Filters
				</Button>
			{/if}
			</div>
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
					selectedMaterial = '';
					selectedThreadType = '';
					searchQuery = '';
					showInStockOnly = false;
				}}>
					Clear Filters
				</Button>
			</div>
		{/if}
	</main>
</div>
