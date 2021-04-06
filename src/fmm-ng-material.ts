import { FmmFramework, FmmFrameworkItem } from './fmm';

// =================================================================================================================================
//						F M M N G M A T E R I A L
// =================================================================================================================================
export const FmmNgMaterial: FmmFramework = {
	createFrameworkItem(_: string, e: HTMLElement): FmmFrameworkItem {
		const eTag = e.tagName;
		if (eTag === 'INPUT' && e.classList.contains('mat-autocomplete-trigger')) return new FrameworkItemAutoComplete(e);
		return eTag === 'MAT-SELECT' ? new FrameworkItemSelect(e) : new FrameworkItem(e);
	}
};

// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================

// =================================================================================================================================
//						F R A M E W O R K I T E M
// =================================================================================================================================
class FrameworkItem implements FmmFrameworkItem {
	private readonly envelope: HTMLElement;
	private readonly forValidation: HTMLElement;
	private readonly label: HTMLElement;

	// =============================================================================================================================
	public constructor(e: HTMLElement) {
		let field = e.parentElement;
		while (field && field.tagName !== 'MAT-FORM-FIELD') field = field.parentElement;
		let tag = e;
		while (tag && !tag.tagName.startsWith('MAT-')) tag = tag.parentElement;
		if (!field) {
			this.envelope = this.forValidation = tag || e;
		} else {
			this.forValidation = field;
			this.envelope = !tag || field.querySelectorAll(tag.tagName).length < 2 ? field : tag || e;
			const labels = field.querySelectorAll('LABEL');
			if (labels.length === 1) this.label = labels[0] as HTMLElement;
		}
	}

	// =============================================================================================================================
	public destructor() {
		/**/
	}

	// =============================================================================================================================
	public getEnvelope(_: string, _e: HTMLElement, _l: HTMLElement) {
		return this.envelope;
	}

	// =============================================================================================================================
	public getError(_: string, _e: HTMLElement, _n: HTMLElement, _v: boolean) {
		return this.forValidation.querySelector('MAT-ERROR')?.textContent;
	}

	// =============================================================================================================================
	public getLabel(_: string, _e: HTMLElement) {
		return this.label;
	}

	// =============================================================================================================================
	public getValue(_: string, _e: HTMLElement, _n: HTMLElement, _l: string): string {
		return undefined;
	}
}

// =================================================================================================================================
//						F R A M E W O R K I T E M A U T O C O M P L E T E
// =================================================================================================================================
class FrameworkItemAutoComplete extends FrameworkItem {
	// =============================================================================================================================
	public getValue(_: string, e: HTMLElement, _n: HTMLElement, _l: string) {
		return (e as HTMLInputElement).value;
	}
}

// =================================================================================================================================
//						F R A M E W O R K I T E M S E L E C T
// =================================================================================================================================
class FrameworkItemSelect extends FrameworkItem {
	// =============================================================================================================================
	public getValue(_: string, e: HTMLElement, _n: HTMLElement, _l: string) {
		return e.querySelector('.mat-select-value-text')?.textContent;
	}
}
