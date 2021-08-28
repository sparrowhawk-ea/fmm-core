import { FmmForm, FmmFormElement, FmmMinimap, FmmStoreErrors, FmmStoreValues, FmmStore, FmmStoreItem } from './fmm';

// =================================================================================================================================
//						F M M S T O R E B A S E
// =================================================================================================================================
export abstract class FmmStoreBase {
	private readonly minimaps: Set<FmmMinimap> = new Set();

	// =============================================================================================================================
	public notifyMinimapOnUpdate(minimap: FmmMinimap, on: boolean): void {
		if (on) this.minimaps.add(minimap);
		else this.minimaps.delete(minimap);
	}

	// =============================================================================================================================
	protected notifyMinimaps(): void {
		const stale: Set<FmmMinimap> = new Set();
		this.minimaps.forEach(m => m.takeSnapshot() || stale.add(m));
		stale.forEach(m => this.minimaps.delete(m));
	}
}

// =================================================================================================================================
//						F M M S T O R E I M P L
// =================================================================================================================================
export class FmmStoreImpl<TV extends FmmStoreValues, TE extends FmmStoreErrors> extends FmmStoreBase implements FmmStore {
	// =============================================================================================================================
	public constructor(private values: TV, private errors?: TE) {
		super();
		this.errors = errors || ({} as TE);
		this.values = values || ({} as TV);
	}

	// =============================================================================================================================
	public createStoreItem(form: FmmForm, e: FmmFormElement): FmmStoreItem {
		for (const key of form.getStoreKeys(e))
			if (key && key in this.values) return new StoreItem(e, key);
		return undefined;
	}

	// =============================================================================================================================
	public getError(_: FmmForm, item: StoreItem, _hasValue: boolean): string {
		const error = this.errors[item.key];
		if (Array.isArray(error)) return error.length ? String(error[0]) : undefined;
		return error ? String(error) : undefined;
	}

	// =============================================================================================================================
	public getName(_: FmmForm, item: StoreItem): string {
		return item.key;
	}

	// =============================================================================================================================
	public getValue(_: FmmForm, item: StoreItem): unknown {
		return this.values[item.key];
	}

	// =============================================================================================================================
	public isDisabled(form: FmmForm, item: StoreItem): boolean {
		return form.isDisabled(item.e);
	}

	// =============================================================================================================================
	public update(values: TV, errors?: TE): void {
		this.errors = errors || ({} as TE);
		this.values = values || ({} as TV);
		super.notifyMinimaps();
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
class StoreItem implements FmmStoreItem {
	// =============================================================================================================================
	public constructor(public readonly e: FmmFormElement, public readonly key: string) { }

	// =============================================================================================================================
	public destructor(): void { /**/ }
}
