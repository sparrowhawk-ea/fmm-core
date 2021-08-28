import {
	FmmForm, FmmFormElement, FmmFormLayoutHandler, FmmFramework, FmmFrameworkItem, FmmRect, FmmStore, FmmStoreItem
} from './fmm';
import { FmmStoreBase } from './fmm-store';

// =================================================================================================================================
//						F M M B O O T S T R A P 4
// =================================================================================================================================
export const FmmBootstrap4: FmmFramework = {
	createFrameworkItem(_: string, e: FmmFormElementHTML): FmmFrameworkItemHTML {
		return e.tagName === 'INPUT' && ['checkbox', 'radio'].includes((e as HTMLInputElement).type) ? G.B4_Check : G.B4_Other;
	}
};

// =================================================================================================================================
//						F M M F O R M E L E M E N T H T M L
// =================================================================================================================================
export interface FmmFormElementHTML extends FmmFormElement, HTMLElement { }

// =================================================================================================================================
//						F M M F O R M H T M L
// =================================================================================================================================
export class FmmFormHTML implements FmmForm {
	private static readonly CLIP = ['auto', 'hidden', 'scroll'];
	private readonly resizeObserver = new ResizeObserver(this.onFormResize.bind(this));
	private layoutHandler: FmmFormLayoutHandler;

	// =============================================================================================================================
	public constructor(private readonly form: HTMLFormElement, private readonly page?: HTMLElement) {
		this.page = page || form;
		this.resizeObserver.observe(form);
		this.updateLayoutOnScroll = this.updateLayoutOnScroll.bind(this);
		// eslint-disable-next-line @typescript-eslint/unbound-method
		page.addEventListener('scroll', this.updateLayoutOnScroll, true);
	}

	// =============================================================================================================================
	public clearLayoutHandler(): void {
		this.resizeObserver.disconnect();
		// eslint-disable-next-line @typescript-eslint/unbound-method
		this.page.removeEventListener('scroll', this.updateLayoutOnScroll, true);
		this.layoutHandler = undefined;
	}

	// =============================================================================================================================
	public clipsContentX(e: FmmFormElementHTML): boolean {
		const { overflow, overflowX } = e.style;
		return FmmFormHTML.CLIP.includes(overflow) || FmmFormHTML.CLIP.includes(overflowX);
	}

	// =============================================================================================================================
	public clipsContentY(e: FmmFormElementHTML): boolean {
		const { overflow, overflowY } = e.style;
		return FmmFormHTML.CLIP.includes(overflow) || FmmFormHTML.CLIP.includes(overflowY);
	}

	// =============================================================================================================================
	public getDisplayLabel(e: FmmFormElementHTML, label: FmmFormElementHTML): string {
		return label?.getAttribute('aria-label') || label?.textContent || e.getAttribute('aria-label') || e.id;
	}

	// =============================================================================================================================
	public getDisplayValue(e: FmmFormElementHTML, label: string, value: unknown): string {
		const tag = e.tagName;
		if (tag === 'INPUT') {
			const ie = e as HTMLInputElement;
			if (ie.type === 'checkbox' || ie.type === 'radio') return ie.checked ? label : undefined;
			return ie.type === 'password' ? '*****' : String(value);
		}
		if (tag === 'SELECT') {
			const values = Array.isArray(value) ? value : [value];
			if (!values.length) return String(value);
			const options = (e as HTMLSelectElement).options;
			if (typeof values[0] === 'number') return values.map((i: number) => options[i].text).join('\n');
			const sel = Array.from(options).filter(o => values.includes(o.value));
			return sel.map(o => o.text).join('\n');
		}
		return String(value);
	}

	// =============================================================================================================================
	public getElements(customElementIds: string[]): FmmFormElementHTML[] {
		const elements = Array.from(this.form.elements);
		if (customElementIds.length)
			elements.push(...Array.from(this.page.querySelectorAll('#' + customElementIds.join(',#'))));
		return elements as FmmFormElementHTML[];
	}

	// =============================================================================================================================
	public getLabelFor(e: FmmFormElementHTML): FmmFormElementHTML {
		let label = e.id ? this.page.querySelector('label[for=' + e.id + ']') : undefined;
		if (!label && e.parentElement?.tagName === 'LABEL') label = e.parentElement;
		if (!label && e.previousElementSibling?.tagName === 'LABEL') label = e.previousElementSibling;
		return label as FmmFormElementHTML;
	}

	// =============================================================================================================================
	public getParent(e: FmmFormElementHTML): FmmFormElementHTML {
		return e.parentElement;
	}

	// =============================================================================================================================
	public getPlaceholder(e: FmmFormElementHTML): string {
		return e.getAttribute('placeholder');
	}

	// =============================================================================================================================
	public getRect(e?: FmmFormElementHTML): Readonly<FmmRect> {
		return (e || this.page).getBoundingClientRect();
	}

	// =============================================================================================================================
	public getStoreKeys(e: FmmFormElementHTML): string[] {
		return [e.getAttribute('name'), e.id];
	}

	// =============================================================================================================================
	public isDisabled(e: FmmFormElementHTML): boolean {
		if (e.tagName !== 'TEXTAREA') return (e as HTMLInputElement).disabled;
		const t = e as HTMLTextAreaElement;
		return t.disabled || t.readOnly;
	}

	// =============================================================================================================================
	public isHidden(e: FmmFormElementHTML): boolean {
		return e.hidden;
	}

	// =============================================================================================================================
	public setLayoutHandler(handler: FmmFormLayoutHandler): void {
		this.layoutHandler = handler;
	}

	// =============================================================================================================================
	private onFormResize() {
		if (this.layoutHandler) this.layoutHandler.handleLayout(undefined);
	}

	// =============================================================================================================================
	private updateLayoutOnScroll(ev: Event) {
		if (ev.target instanceof HTMLElement && this.layoutHandler) this.layoutHandler.handleLayout(ev.target);
	}
}

// =================================================================================================================================
//						F M M F R A M E W O R K I T E M H T M L
// =================================================================================================================================
export class FmmFrameworkItemHTML implements FmmFrameworkItem {
	// =============================================================================================================================
	public constructor(protected readonly wrapperClass: string) {
		if (!wrapperClass) throw new Error('FmmFrameworkItemBase requires wrapperClass');
	}

	// =============================================================================================================================
	public destructor(): void { /**/ }

	// =============================================================================================================================
	public getEnvelope(_: string, e: FmmFormElementHTML, label: FmmFormElementHTML): FmmFormElementHTML {
		let p = e.parentElement;
		while (p && p.tagName !== 'FORM' && !p.classList.contains(this.wrapperClass)) p = p.parentElement;
		if (p && p.tagName !== 'FORM') return p;
		if (!label) return undefined;
		p = label.parentElement;
		while (p && p.tagName !== 'FORM' && !p.classList.contains(this.wrapperClass)) p = p.parentElement;
		return p?.tagName !== 'FORM' ? p : undefined;
	}

	// =============================================================================================================================
	public getError(_: string, _e: FmmFormElementHTML, _n: FmmFormElementHTML, _v: boolean): string {
		return undefined;
	}

	// =============================================================================================================================
	public getLabel(_: string, envelope: FmmFormElementHTML): FmmFormElementHTML {
		return envelope.querySelector('LABEL') || envelope.querySelector('[aria-label]');
	}

	// =============================================================================================================================
	public getValue(_: string, _e: FmmFormElementHTML, _n: FmmFormElementHTML, _l: string): string {
		return undefined;
	}
}

// =================================================================================================================================
//						F M M S T O R E H T M L
// =================================================================================================================================
export class FmmStoreHTML extends FmmStoreBase implements FmmStore {
	private static readonly INPUTTYPES = [
		'checkbox',
		'color',
		'date',
		'datetime',
		'datetime-local',
		'email',
		'month',
		'number',
		'password',
		'radio',
		'range',
		'search',
		'tel',
		'text',
		'time',
		'url',
		'week'
	];
	private readonly listener = this.notifyMinimaps.bind(this);

	// =============================================================================================================================
	public createStoreItem(_: FmmForm, e: FmmFormElementHTML): FmmStoreItem {
		const tag = e.tagName;
		if (tag === 'INPUT') {
			const ie = e as HTMLInputElement;
			return FmmStoreHTML.INPUTTYPES.includes(ie.type) ? new StoreItemInput(ie, this.listener) : undefined;
		}
		if (tag === 'SELECT') return new StoreItemSelect(e as HTMLSelectElement, this.listener);
		if (tag === 'TEXTAREA') return new StoreItemTextArea(e as HTMLTextAreaElement, this.listener);
		return undefined;
	}

	// =============================================================================================================================
	public getError(_: FmmForm, i: StoreItem, _hasValue: boolean): string {
		return i.fe.validationMessage || (i.fe.required && !i.fe.value && 'Required') || undefined;
	}

	// =============================================================================================================================
	public getName(_: FmmForm, i: StoreItem): string {
		return i.fe.name;
	}

	// =============================================================================================================================
	public getValue(_: FmmForm, i: StoreItem): unknown {
		return i.getValue();
	}

	// =============================================================================================================================
	public isDisabled(form: FmmForm, i: StoreItem): boolean {
		return form.isDisabled(i.fe);
	}
}

// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================

// =================================================================================================================================
//						F R A M E W O R K I T E M B 4
// =================================================================================================================================
class FrameworkItemB4 extends FmmFrameworkItemHTML {
	// =============================================================================================================================
	public constructor(wrapperClass: string) {
		super(wrapperClass);
	}

	// =============================================================================================================================
	public getError(_: string, e: FmmFormElementHTML, _n: FmmFormElementHTML, _v: boolean): string {
		if (!e.classList.contains('is-invalid') /* && !e.matches(':invalid')*/) return undefined;
		for (let s = e.nextElementSibling; s && s !== e; s = s.nextElementSibling) {
			if (s.classList.contains('invalid-feedback')) return s.textContent;
		}
		return undefined;
	}
}

// =================================================================================================================================
//						G
// =================================================================================================================================
const G = {
	B4_Check: new FrameworkItemB4('form-check'),
	B4_Other: new FrameworkItemB4('form-group')
};

// =================================================================================================================================
//						S T O R E I T E M
// =================================================================================================================================
class StoreItem implements FmmStoreItem {
	// =============================================================================================================================
	protected constructor(
		public readonly fe: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
		private readonly event: string,
		private readonly listener: EventListener
	) {
		fe.addEventListener(event, listener);
	}

	// =============================================================================================================================
	public destructor() {
		this.fe.removeEventListener(this.event, this.listener);
	}

	// =============================================================================================================================
	public getValue(): unknown {
		return this.fe.value || undefined;
	}

	// =============================================================================================================================
	public isDisabled() {
		return this.fe.disabled;
	}
}

// =================================================================================================================================
//						S T O R E I T E M I N P U T
// =================================================================================================================================
class StoreItemInput extends StoreItem {
	// =============================================================================================================================
	public constructor(e: HTMLInputElement, listener: EventListener) {
		super(e, 'input', listener);
	}
}

// =================================================================================================================================
//						S T O R E I T E M S E L E C T
// =================================================================================================================================
class StoreItemSelect extends StoreItem {
	private readonly isMultiple: boolean;

	// =============================================================================================================================
	public constructor(private readonly e: HTMLSelectElement, listener: EventListener) {
		super(e, 'change', listener);
		this.isMultiple = e.multiple;
	}

	// =============================================================================================================================
	public getValue() {
		const index = this.e.selectedIndex;
		if (index < 0) return undefined;
		if (!this.isMultiple) return [index];
		const indexes: number[] = [];
		const options = this.e.options;
		for (let i = options.length; --i >= index;) if (options[i].selected) indexes.push(i);
		return indexes.reverse();
	}
}

// =================================================================================================================================
//						S T O R E I T E M T E X T A R E A
// =================================================================================================================================
class StoreItemTextArea extends StoreItem {
	// =============================================================================================================================
	public constructor(private readonly e: HTMLTextAreaElement, listener: EventListener) {
		super(e, 'input', listener);
	}
}
