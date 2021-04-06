import { FmmFrameworkItem, FmmMapErrors, FmmMapValues, FmmMinimap, FmmStore, FmmStoreItem } from './fmm';

// =================================================================================================================================
//						F M M F R A M E W O R K I T E M B A S E
// =================================================================================================================================
export class FmmFrameworkItemBase implements FmmFrameworkItem {
	// =============================================================================================================================
	public constructor(protected readonly wrapperClass: string) {
		if (!wrapperClass) throw new Error('FmmFrameworkItemBase requires wrapperClass');
	}

	// =============================================================================================================================
	public destructor(): void {
		/**/
	}

	// =============================================================================================================================
	public getEnvelope(_: string, e: HTMLElement, label: HTMLElement): HTMLElement {
		let p = e.parentElement;
		while (p && p.tagName !== 'FORM' && !p.classList.contains(this.wrapperClass)) p = p.parentElement;
		if (p && p.tagName !== 'FORM') return p;
		if (!label) return undefined;
		p = label.parentElement;
		while (p && p.tagName !== 'FORM' && !p.classList.contains(this.wrapperClass)) p = p.parentElement;
		return p?.tagName !== 'FORM' ? p : undefined;
	}

	// =============================================================================================================================
	public getError(_: string, _e: HTMLElement, _n: HTMLElement, _v: boolean): string {
		return undefined;
	}

	// =============================================================================================================================
	public getLabel(_: string, envelope: HTMLElement): HTMLElement {
		return envelope.querySelector('LABEL') || envelope.querySelector('[aria-label]');
	}

	// =============================================================================================================================
	public getValue(_: string, _e: HTMLElement, _n: HTMLElement, _l: string): string {
		return undefined;
	}
}

// =================================================================================================================================
//						F M M M A P S T O R E
// =================================================================================================================================
export class FmmMapStore<TV extends FmmMapValues, TE extends FmmMapErrors> implements FmmStore {
	private readonly minimaps: Set<FmmMinimap> = new Set();

	// =============================================================================================================================
	public constructor(private values: TV, private errors?: TE) {
		this.errors = errors || ({} as TE);
		this.values = values || ({} as TV);
	}

	// =============================================================================================================================
	public destructor(): void {
		/**/
	}

	// =============================================================================================================================
	public createStoreItem(e: HTMLElement, _: () => FmmStoreItem): FmmStoreItem {
		const name = e.getAttribute('name');
		if (name in this.values) return new StoreItem(e, this, name);
		if (e.id in this.values) return new StoreItem(e, this, e.id);
		return undefined; // ignore everything else
	}

	// =============================================================================================================================
	public getError(key: string): string {
		const error = this.errors[key];
		if (Array.isArray(error)) return error.length ? String(error[0]) : undefined;
		return error ? String(error) : undefined;
	}

	// =============================================================================================================================
	public getValue(key: string): unknown {
		return this.values[key];
	}

	// =============================================================================================================================
	public notifyMinimap(minimap: FmmMinimap, on: boolean): void {
		if (on) this.minimaps.add(minimap);
		else this.minimaps.delete(minimap);
	}

	// =============================================================================================================================
	public update(values: TV, errors?: TE): void {
		this.errors = errors || ({} as TE);
		this.values = values || ({} as TV);
		const stale: Set<FmmMinimap> = new Set();
		this.minimaps.forEach(m => m.takeSnapshot() || stale.add(m));
		stale.forEach(m => this.minimaps.delete(m));
	}
}

// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================

// =================================================================================================================================
//						S T O R E I T E M
// =================================================================================================================================
class StoreItem<TV extends FmmMapValues, TE extends FmmMapErrors> implements FmmStoreItem {
	// =============================================================================================================================
	public constructor(private readonly e: HTMLElement, protected f: FmmMapStore<TV, TE>, protected readonly key: string) {}

	// =============================================================================================================================
	public destructor() {
		this.f = undefined;
	}

	// =============================================================================================================================
	public getError(_: boolean): string {
		return this.f.getError(this.key);
	}

	// =============================================================================================================================
	public getName(): string {
		return this.key;
	}

	// =============================================================================================================================
	public getValue() {
		return this.f.getValue(this.key);
	}

	// =============================================================================================================================
	public isDisabled() {
		return (this.e as HTMLInputElement).disabled;
	}
}
