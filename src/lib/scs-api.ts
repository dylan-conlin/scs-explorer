/**
 * SendCutSend Public API Client
 * 
 * Base URL: https://app.sendcutsend.com
 * API Version: 0.0.4
 * 
 * All endpoints are public and require no authentication.
 */

const BASE_URL = 'https://app.sendcutsend.com';

// ============================================
// TYPES
// ============================================

export interface Material {
	id: number;
	name: string;
	sku: string;
	thickness: string;
	category: string;
	subcategory: string | null;
	group: string; // "Metals", "Plastics", etc.
	form: string; // "sheet", "billet"
	fullname: string;
	out_of_stock: boolean;
	expedited_production_permitted: boolean;
	new_material: boolean;
	limited_material: boolean;
	ferrous_material?: boolean;
	priority?: number;
	width?: string;
	height?: string;
	marketing: {
		learn_more_url: string;
		example_image_url: string;
		category_description: string;
		group_description: string;
		name_description: string | null;
		post_message: string | null;
		post_message_url: string | null;
	};
	// Convenience duplicates of marketing fields
	learn_more_url: string;
	example_image_url: string;
	category_description: string;
	group_description: string;
	name_description: string | null;
	post_message: string | null;
	post_message_url: string | null;
	// Only included when include_datasheet=true
	datasheet?: DatasheetEntry[];
}

export interface DatasheetEntry {
	type: 'header' | 'label-text' | 'label-value' | string;
	field: string;
	value: string;
}

export interface Hardware {
	id: number;
	sku: string;
	category: string; // "Nut", "Stud", etc.
	subcategory: string; // "A286 Hardened SST", etc.
	out_of_stock: boolean;
	max_hw_diameter: string;
	min_cl_to_edge_distance: string;
	model_url: string; // .stl file URL
	preview_url: string;
	preview_url_full: string;
	preview_url_tech: string;
	descriptions: HardwareDescription[];
}

export interface HardwareDescription {
	field: string;
	value: string;
}

export interface FinishOption {
	id: number;
	value: string; // "clear", "gold", "blue", etc.
	finish_type: string; // "anodizing", "powder_coating", etc.
	color: string;
	code: string; // "Type II, Class II"
	example_image_url: string;
	swatch: {
		url: string;
		size: number;
		dark?: boolean; // If true, swatch is dark colored
	};
	public: boolean;
	deleted: boolean;
}

export interface AppVersion {
	version: string;
}

// API Response wrapper
interface ApiResponse<T> {
	data: T;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get all materials from the catalog
 * @param includeDatasheet - Include full datasheet specifications (default: false)
 * @param sku - Filter by specific material SKU
 */
export async function getMaterials(options?: {
	includeDatasheet?: boolean;
	sku?: string;
	page?: number;
	perPage?: number;
	fetch?: typeof globalThis.fetch;
}): Promise<Material[]> {
	const fetchFn = options?.fetch || globalThis.fetch;
	const params = new URLSearchParams();

	if (options?.includeDatasheet) {
		params.set('include_datasheet', 'true');
	}
	if (options?.sku) {
		params.set('sku', options.sku);
	}
	if (options?.page) {
		params.set('page', options.page.toString());
	}
	if (options?.perPage) {
		params.set('per_page', options.perPage.toString());
	}

	const url = `${BASE_URL}/materials${params.toString() ? '?' + params.toString() : ''}`;
	const response = await fetchFn(url);
	
	if (!response.ok) {
		throw new Error(`Failed to fetch materials: ${response.status} ${response.statusText}`);
	}

	const json: ApiResponse<Material[]> = await response.json();
	return json.data;
}

/**
 * Get a single material by SKU
 */
export async function getMaterialBySku(sku: string, includeDatasheet = true): Promise<Material | null> {
	const materials = await getMaterials({ sku, includeDatasheet });
	return materials[0] ?? null;
}

/**
 * Get all hardware items from the catalog
 */
export async function getHardware(options?: {
	page?: number;
	perPage?: number;
	fetch?: typeof globalThis.fetch;
}): Promise<Hardware[]> {
	const fetchFn = options?.fetch || globalThis.fetch;
	const params = new URLSearchParams();

	if (options?.page) {
		params.set('page', options.page.toString());
	}
	if (options?.perPage) {
		params.set('per_page', options.perPage.toString());
	}

	const url = `${BASE_URL}/hardware${params.toString() ? '?' + params.toString() : ''}`;
	const response = await fetchFn(url);
	
	if (!response.ok) {
		throw new Error(`Failed to fetch hardware: ${response.status} ${response.statusText}`);
	}

	const json: ApiResponse<Hardware[]> = await response.json();
	return json.data;
}

/**
 * Get all finish options
 */
export async function getFinishOptions(fetchFn: typeof globalThis.fetch = globalThis.fetch): Promise<FinishOption[]> {
	const response = await fetchFn(`${BASE_URL}/finish_options`);
	
	if (!response.ok) {
		throw new Error(`Failed to fetch finish options: ${response.status} ${response.statusText}`);
	}

	const json: ApiResponse<FinishOption[]> = await response.json();
	return json.data;
}

/**
 * Get current API version
 */
export async function getAppVersion(): Promise<string> {
	const response = await fetch(`${BASE_URL}/app_version`);
	
	if (!response.ok) {
		throw new Error(`Failed to fetch app version: ${response.status} ${response.statusText}`);
	}

	const json: ApiResponse<AppVersion> = await response.json();
	return json.data.version;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get unique material groups (e.g., "Metals", "Plastics")
 */
export function getMaterialGroups(materials: Material[]): string[] {
	return [...new Set(materials.map(m => m.group))].sort();
}

/**
 * Get unique material categories within a group
 */
export function getMaterialCategories(materials: Material[], group?: string): string[] {
	const filtered = group ? materials.filter(m => m.group === group) : materials;
	return [...new Set(filtered.map(m => m.category))].sort();
}

/**
 * Get unique thicknesses for a category
 */
export function getMaterialThicknesses(materials: Material[], category: string): string[] {
	return [...new Set(materials.filter(m => m.category === category).map(m => m.thickness))].sort();
}

/**
 * Get unique hardware categories
 */
export function getHardwareCategories(hardware: Hardware[]): string[] {
	return [...new Set(hardware.map(h => h.category))].sort();
}

/**
 * Get unique finish types
 */
export function getFinishTypes(finishes: FinishOption[]): string[] {
	return [...new Set(finishes.map(f => f.finish_type))].sort();
}

/**
 * Filter materials by various criteria
 */
export function filterMaterials(
	materials: Material[],
	filters: {
		group?: string;
		category?: string;
		thickness?: string;
		inStock?: boolean;
		search?: string;
	}
): Material[] {
	return materials.filter(m => {
		if (filters.group && m.group !== filters.group) return false;
		if (filters.category && m.category !== filters.category) return false;
		if (filters.thickness && m.thickness !== filters.thickness) return false;
		if (filters.inStock && m.out_of_stock) return false;
		if (filters.search) {
			const search = filters.search.toLowerCase();
			const searchable = `${m.name} ${m.sku} ${m.category} ${m.fullname}`.toLowerCase();
			if (!searchable.includes(search)) return false;
		}
		return true;
	});
}
