import { FmmFramework, FmmFrameworkItem } from './fmm';

// =================================================================================================================================
//						F M M V U E T I F Y
// =================================================================================================================================
export const FmmVuetify: FmmFramework = {
	createFrameworkItem(_: string, e: HTMLElement): FmmFrameworkItem {
		return e.parentElement?.classList.contains('v-select__selections') ? new FrameworkItemSelect(e) : new FrameworkItem(e);
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
		const isRadio = e.tagName === 'INPUT' && (e as HTMLInputElement).type === 'radio';
		let tag = e.parentElement;
		const envelopeClass = isRadio ? 'v-radio' : 'v-input';
		while (tag && !tag.classList.contains(envelopeClass)) tag = tag.parentElement;
		if (!tag) {
			this.envelope = this.forValidation = e;
		} else {
			this.envelope = tag;
			const labels = tag.querySelectorAll('LABEL');
			if (labels.length === 1) this.label = labels[0] as HTMLElement;
			if (isRadio) {
				while (tag && !tag.classList.contains('v-input--radio-group')) tag = tag.parentElement;
			}
			this.forValidation = tag || this.envelope;
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
		return this.forValidation.querySelector('DIV.v-messages__message')?.textContent;
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
//						F R A M E W O R K I T E M S E L E C T
// =================================================================================================================================
class FrameworkItemSelect extends FrameworkItem {
	// =============================================================================================================================
	public getValue(_: string, e: HTMLElement, _n: HTMLElement, _l: string): string {
		return e.parentElement.textContent;
	}
}
