import {
	FmmElementFactory,
	FmmFramework,
	FmmFrameworkItem,
	FmmMapString,
	FmmMapStrings,
	FmmMinimap,
	FmmMinimapCreateParam,
	FmmMinimapSnapshot,
	FmmOnUpdate,
	FmmPanel,
	FmmSnapshot,
	FmmStore,
	FmmStoreItem,
	FmmWidget,
	FmmWidgetFactory
} from './fmm';

// =================================================================================================================================
//						F M M
// =================================================================================================================================
export class Fmm {
	// =============================================================================================================================
	public static readonly CLASS = Object.freeze({
		Detached: 'fmm-detached',
		DetailPopup: 'fmm-detail',
		Disabled: 'fmm-disabled',
		Error: 'fmm-error',
		Fieldset: 'fmm-fieldset',
		Header: 'fmm-header',
		Invalid: 'fmm-invalid',
		Legend: 'fmm-legend',
		MinimapFrame: 'fmm-frame',
		MinimapPopup: 'fmm-popup',
		Optional: 'fmm-optional',
		Pushpin: 'fmm-pushpin',
		Required: 'fmm-required',
		Title: 'fmm-title',
		Valid: 'fmm-valid',
		Value: 'fmm-value'
	});

	// =============================================================================================================================
	public static readonly CSS = `
	circle.fmm-pushpin {
		fill: blue;
	}
	div.fmm-detail,
	div.fmm-popup {
		background-color: darkgray;
		border: 1px solid black;
		box-shadow: 5px 5px lightgray;
		padding-top: 10px;
		z-index: 1;
	}
	div.fmm-disabled {
		background-color: darkgray;
	}
	div.fmm-disabled,
	div.fmm-invalid,
	div.fmm-optional,
	div.fmm-required,
	div.fmm-valid {
		border: 1px solid transparent;
	}
	div.fmm-frame {
		background-color: white;
	}
	div.fmm-header {
		border-bottom: 5px groove;
		margin: 0;
	}
	div.fmm-invalid {
		background-color: red;
	}
	div.fmm-optional {
		border-color: black;
	}
	div.fmm-required {
		border-color: red;
	}
	div.fmm-valid {
		background-color: green;
	}
	fieldset.fmm-fieldset {
		background-color: white;
		border-top: 5px groove;
		min-width: 0;
		padding: 5px 10px;
	}
	fieldset.fmm-fieldset div.fmm-disabled,
	fieldset.fmm-fieldset div.fmm-invalid,
	fieldset.fmm-fieldset div.fmm-optional,
	fieldset.fmm-fieldset div.fmm-required,
	fieldset.fmm-fieldset div.fmm-valid {
		border-width: 2px;
	}
	label.fmm-title {
		font-size: smaller;
		padding: 2px;
	}
	legend.fmm-legend {
		background-color: white;
		margin: 5px;
		max-width: 100%;
		padding-right: 5px;
	}
	textarea.fmm-value {
		height: 3em;
		width: 100%;
	}
	div.fmm-detached.fmm-popup,
	div.fmm-detached div.fmm-detail {
		background-color: lightgray;
	}
	div.fmm-detached.fmm-frame,
	div.fmm-detached div.fmm-frame,
	div.fmm-detached fieldset.fmm-fieldset,
	iv.fmm-detached legend.fmm-legend {
		background-color: lightgray !important;
	}
	`;

	// =============================================================================================================================
	public static readonly STATUS = Object.freeze({
		Disabled: 'fmm-disabled',
		Invalid: 'fmm-invalid',
		Optional: 'fmm-optional',
		Required: 'fmm-required',
		Valid: 'fmm-valid'
	});

	// =============================================================================================================================
	public static createPanel(
		ef: FmmElementFactory,
		parent: HTMLElement,
		detailParent?: HTMLElement,
		vertical?: boolean
	): FmmPanel {
		const err = 'FmmPanel not created: invalid ';
		if (!(parent instanceof HTMLElement)) throw new Error(err + 'parent');
		if (detailParent && !(detailParent instanceof HTMLElement)) throw new Error(err + 'detailParent');
		return new Panel(ef, parent, detailParent, vertical);
	}

	// =============================================================================================================================
	public static trim(s: string): string {
		return s?.trim().replace(/\u200B/g, '');
	}
}

// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================

// =================================================================================================================================
//						A N C E S T O R S M A P
// =================================================================================================================================
type AncestorsMap = WeakMap<HTMLElement, ClipContext>;

// =================================================================================================================================
//						C L I P C O N T E X T
// =================================================================================================================================
class ClipContext {
	private static readonly CLIP = ['auto', 'hidden', 'scroll'];
	private readonly clipX: boolean;
	private readonly clipY: boolean;
	private readonly rect: DOMRectReadOnly;

	// =============================================================================================================================
	public constructor(e: HTMLElement, private readonly parent: ClipContext) {
		const { overflow, overflowX, overflowY } = e.style;
		this.clipX = ClipContext.CLIP.includes(overflow) || ClipContext.CLIP.includes(overflowX);
		this.clipY = ClipContext.CLIP.includes(overflow) || ClipContext.CLIP.includes(overflowY);
		this.rect = parent?.clipRect(e.getBoundingClientRect()) || e.getBoundingClientRect();
	}

	// =============================================================================================================================
	public clipRect(rect: DOMRectReadOnly): DOMRectReadOnly {
		const left = Math.max(rect.left, this.rect.left);
		const top = Math.max(rect.top, this.rect.top);
		const width = Math.max(0, (this.clipX ? Math.min(rect.right, this.rect.right) : rect.right) - left);
		const height = Math.max(0, (this.clipY ? Math.min(rect.bottom, this.rect.bottom) : rect.bottom) - top);
		const clipped = new DOMRectReadOnly(left, top, width, height);
		return width && height && this.parent ? this.parent.clipRect(clipped) : clipped;
	}
}

// =================================================================================================================================
//						D E B O U N C E R
// =================================================================================================================================
class Debouncer {
	private readonly _doTask = this.doTask.bind(this);
	private notBeforeMsec?: number;
	private timer?: number;

	// =============================================================================================================================
	public constructor(private task: () => void, private readonly debounceMsec: number) {}

	// =============================================================================================================================
	public destructor() {
		if (!this.task) return;
		if (this.timer) window.clearTimeout(this.timer);
		this.timer = undefined;
		this.task = undefined;
	}

	// =============================================================================================================================
	public cancel() {
		if (!this.timer) return false;
		window.clearTimeout(this.timer);
		this.timer = undefined;
		return true;
	}

	// =============================================================================================================================
	public doNow() {
		if (!this.task) return;
		this.cancel();
		this.task();
	}

	// =============================================================================================================================
	public schedule() {
		if (!this.task) return;
		this.notBeforeMsec = Date.now() + this.debounceMsec;
		if (!this.timer) this.timer = window.setTimeout(this._doTask, this.debounceMsec);
	}

	// =============================================================================================================================
	private doTask() {
		const tooEarlyMsec = this.notBeforeMsec - Date.now();
		if (tooEarlyMsec > 0) {
			this.timer = window.setTimeout(this._doTask, tooEarlyMsec);
		} else {
			this.timer = undefined;
			this.task();
		}
	}
}

// =================================================================================================================================
//						D E T A I L
// =================================================================================================================================
class Detail {
	public readonly e: HTMLElement;
	private readonly error: HTMLElement;
	private readonly label: HTMLElement;
	private readonly status: HTMLElement;
	private readonly value: HTMLTextAreaElement;
	private data = Snapshot.NULLDATA;
	private minimapId: number;
	private values: string[] = [];

	// =============================================================================================================================
	public constructor(ef: FmmElementFactory, parent: HTMLElement) {
		const fieldset = (this.e = ef.createElement('FIELDSET'));
		fieldset.className = Fmm.CLASS.Fieldset;
		const legend = G.ELLIPSIS(ef.createElement('LEGEND'));
		legend.className = Fmm.CLASS.Legend;
		this.status = legend.appendChild(ef.createElement('DIV'));
		this.status.style.display = 'inline-block';
		this.status.style.margin = '3px 6px 0 3px';
		this.status.style.height = '0.7em';
		this.status.style.width = '1em';
		this.label = legend.appendChild(ef.createElement('SPAN'));
		this.label.textContent = G.NBSP;
		fieldset.appendChild(legend);
		this.value = fieldset.appendChild(ef.createElement('TEXTAREA') as HTMLTextAreaElement);
		this.value.className = Fmm.CLASS.Value;
		this.value.readOnly = true;
		this.error = G.ELLIPSIS(fieldset.appendChild(ef.createElement('DIV')));
		this.error.className = Fmm.CLASS.Error;
		this.error.textContent = G.NBSP;
		if (parent) parent.appendChild(fieldset);
	}

	// =============================================================================================================================
	public destructor() {
		if (this.e.parentElement) this.e.parentElement.removeChild(this.e);
	}

	// =============================================================================================================================
	public clear(onlyIfShowingThisData: FmmSnapshot) {
		if (onlyIfShowingThisData && onlyIfShowingThisData !== this.data) return;
		this.error.textContent = this.label.textContent = G.NBSP;
		this.status.className = this.value.placeholder = this.value.value = '';
		this.data = Snapshot.NULLDATA;
		this.values = [];
	}

	// =============================================================================================================================
	public refreshDisplay(minimapId: number) {
		if (minimapId !== this.minimapId) return;
		const labelPrefix = this.data.aggregateLabel?.concat(': ') || '';
		this.error.textContent = this.error.title = this.data.error || G.NBSP;
		this.label.textContent = this.label.title = labelPrefix + this.data.label || G.NBSP;
		this.status.className = this.data.status;
		this.value.placeholder = this.data.placeholder || '';
		this.value.value = this.values?.join('\n');
	}

	// =============================================================================================================================
	public setDisplay(minimapId: number, newData: FmmSnapshot, values: string[]) {
		this.values = values || [];
		this.data = newData || Snapshot.NULLDATA;
		this.refreshDisplay((this.minimapId = minimapId));
	}
}

// =================================================================================================================================
//						F O R M S T O R E I T E M
// =================================================================================================================================
class FormStoreItem {
	private static readonly DEFAULTFRAMEWORK: FmmFrameworkItem = {
		destructor: (): void => undefined,
		getEnvelope: (_: string, _e: HTMLElement, _l: HTMLLabelElement) => undefined,
		getError: (_: string, _e: HTMLElement, _n: HTMLElement, _v: boolean): string => undefined,
		getLabel: (_: string, _e: HTMLElement): HTMLElement => undefined,
		getValue: (_: string, _e: HTMLElement, _n: HTMLElement, _l: string): string => undefined
	};
	private static readonly DEFAULTWIDGET: FmmWidget = {
		destructor: (): void => undefined,
		getDisplayValue: (_: string, e: HTMLElement, label: string, value: unknown): string => {
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
	};
	private static readonly NAMEPREFIX = '$Fmm';
	private readonly dynamicLabel: boolean;
	private readonly envelope: HTMLElement;
	private readonly framework: FmmFrameworkItem;
	private readonly label: HTMLElement;
	private readonly snapshot: Snapshot;
	private readonly widget: FmmWidget;

	// =============================================================================================================================
	public constructor(public readonly e: HTMLElement, private readonly store: FmmStoreItem, p: UpdatesParam) {
		let label: HTMLElement = e.id ? p.page.querySelector('label[for=' + e.id + ']') : undefined;
		if (!label && e.parentElement?.tagName === 'LABEL') label = e.parentElement;
		if (!label && e.previousElementSibling?.tagName === 'LABEL') label = e.previousElementSibling as HTMLElement;
		const name = store.getName() || FormStoreItem.NAMEPREFIX + String(p.nameCounter++);
		if (!(name in p.values)) p.values[name] = [];
		let widget: FmmWidget;
		this.widget = p.widgetFactories?.find(f => (widget = f.createWidget(name, e))) ? widget : FormStoreItem.DEFAULTWIDGET;
		this.dynamicLabel = p.dynamicLabels.includes(name);
		this.framework = p.framework?.createFrameworkItem(name, e) || FormStoreItem.DEFAULTFRAMEWORK;
		this.envelope = this.framework.getEnvelope(name, e, label) || this.getCommonAncestor(e, label);
		this.label = label || this.framework.getLabel(name, this.envelope);
		this.snapshot = new Snapshot(p.aggregateLabels[name], name, p.ef, p.snapshotsPanel, p.snapshotUpcall);
		this.destructor = () => {
			this.framework.destructor();
			store.destructor();
			this.widget.destructor();
		};
	}

	// =============================================================================================================================
	public destructor() {
		// function body overwritten in constructor
	}

	// =============================================================================================================================
	public layoutSnapshot(p: UpdatesParam, pageRect: DOMRectReadOnly, scale: number) {
		const parent = this.envelope.parentElement;
		const clipContext = p.ancestors.get(parent) || this.getClipContext(parent, p.ancestors);
		const rect = clipContext.clipRect(this.envelope.getBoundingClientRect());
		if (!rect.width || !rect.height) return this.snapshot.setRect(undefined, p.snapshotUpcall);
		const left = Math.floor((rect.left - pageRect.left) * scale);
		const top = Math.floor((rect.top - pageRect.top) * scale);
		const height = Math.max(2, Math.floor(rect.height * scale));
		const width = Math.max(2, Math.floor(rect.width * scale));
		return this.snapshot.setRect(new DOMRectReadOnly(left, top, width, height), p.snapshotUpcall);
	}

	// =============================================================================================================================
	public removeIfDetached() {
		if (this.envelope.parentElement && this.envelope.contains(this.e)) return false;
		this.snapshot.destructor();
		this.destructor();
		return true;
	}

	// =============================================================================================================================
	public takeSnapshot(values: FmmMapStrings): FmmSnapshot {
		const data = this.snapshot.data;
		const name = data.name;
		if (data.label === undefined || this.dynamicLabel) {
			const label = this.label?.getAttribute('aria-label') || this.label?.textContent || this.e.getAttribute('aria-label');
			data.label = Fmm.trim(label || this.e.id || name);
			data.placeholder = Fmm.trim(this.e.getAttribute('placeholder'));
		}
		let displayValue = Fmm.trim(this.framework.getValue(name, this.e, this.envelope, data.label));
		if (!displayValue) {
			const rawValue = this.store.getValue();
			if (rawValue) displayValue = Fmm.trim(this.widget.getDisplayValue(name, this.e, data.label, rawValue));
		}
		const hasValue = !!displayValue;
		if (hasValue) values[name].push(displayValue);
		data.error = Fmm.trim(this.framework.getError(name, this.e, this.envelope, hasValue) || this.store.getError(hasValue));
		let status: string;
		if (this.store.isDisabled()) {
			status = Fmm.STATUS.Disabled;
		} else if (hasValue) {
			status = data.error ? Fmm.STATUS.Invalid : Fmm.STATUS.Valid;
		} else {
			status = data.error ? Fmm.STATUS.Required : Fmm.STATUS.Optional;
		}
		if (status !== data.status) this.snapshot.setStatus((data.status = status));
		return data;
	}

	// =============================================================================================================================
	private getClipContext(e: HTMLElement, ancestors: AncestorsMap): ClipContext {
		const parent = e.parentElement;
		const parentContext = parent ? ancestors.get(parent) || this.getClipContext(parent, ancestors) : undefined;
		const clipContext = new ClipContext(e, parentContext);
		ancestors.set(e, clipContext);
		return clipContext;
	}

	// =============================================================================================================================
	private getCommonAncestor(e: HTMLElement, label: HTMLElement): HTMLElement {
		if (!label) return e;
		let parent = e.parentElement;
		while (parent && !parent.contains(label)) parent = parent.parentElement;
		return parent || e;
	}
}

// =================================================================================================================================
//						F O R M S T O R E I T E M S
// =================================================================================================================================
class FormStoreItems {
	private readonly list: FormStoreItem[] = [];
	private ignore = new WeakSet<HTMLElement>();

	// =============================================================================================================================
	public destructor() {
		this.ignore = new WeakSet();
		this.list.splice(0).forEach(fw => fw.destructor());
	}

	// =============================================================================================================================
	public compose(p: UpdatesParam) {
		const prev = this.list.splice(0);
		prev.forEach(fw => fw.removeIfDetached() || this.list.push(fw));
		const processed = new WeakSet<HTMLElement>();
		this.list.forEach(fw => processed.add(fw.e));
		Array.from(p.form.elements).forEach(e => this.createFormStoreItem(e as HTMLElement, p, processed));
		if (!p.customWidgetIds.length) return;
		const custom = p.page.querySelectorAll('#' + p.customWidgetIds.join(',#'));
		custom.forEach(e => this.createFormStoreItem(e as HTMLElement, p, processed));
	}

	// =============================================================================================================================
	public layoutSnapshots(p: UpdatesParam, pageRect: DOMRectReadOnly, scale: number) {
		p.ancestors = new WeakMap<HTMLElement, ClipContext>();
		this.list.forEach(fw => fw.layoutSnapshot(p, pageRect, scale));
	}

	// =============================================================================================================================
	public takeSnapshot(values: FmmMapStrings) {
		// we need to preserve the values string[] reference, since it may be cached in Detail with the currently displayed Snapshot
		Object.keys(values).forEach(name => values[name].splice(0));
		const snapshots = this.list.map(fw => fw.takeSnapshot(values));
		Object.values(values).forEach(v => v.sort());
		return snapshots;
	}

	// =============================================================================================================================
	private createFormStoreItem(e: HTMLElement, p: UpdatesParam, processed: WeakSet<HTMLElement>) {
		if (processed.has(e) || this.ignore.has(e)) return undefined;
		if (e.hidden) return this.ignore.add(e);
		const store = p.store.createStoreItem(e, () => StoreItem.NEW(e, p.storeListener));
		if (store) this.list.push(new FormStoreItem(e, store, p));
		return processed.add(e);
	}
}

// =================================================================================================================================
//						G
// =================================================================================================================================
const G: {
	ELLIPSIS: (_: HTMLElement) => HTMLElement;
	NBSP: string;
} = {
	ELLIPSIS: (e: HTMLElement) => {
		e.style.overflow = 'hidden';
		e.style.textOverflow = 'ellipsis';
		e.style.whiteSpace = 'nowrap';
		return e;
	},
	NBSP: '\u00a0'
};

// =================================================================================================================================
//						M I N I M A P
// =================================================================================================================================
class Minimap implements FmmStore {
	private static readonly POSITIONS = ['absolute', 'fixed', 'relative', 'sticky'];
	private static idCounter = 0;
	private readonly data: FmmSnapshot;
	private readonly minimapId: number;
	private readonly summary: string[] = [];
	private readonly values: FmmMapStrings = {};
	private readonly verbosity: number;
	private d: {
		readonly doUpdates: Debouncer;
		readonly onUpdate: FmmOnUpdate;
		readonly resizeObserver: ResizeObserver;
		readonly stores: FormStoreItems;
		readonly updatesParam: UpdatesParam;
	};
	private detail: Detail;
	private detailPopup: Popup;
	private dragData = '';
	private frame: HTMLElement;
	private onUpdateBeingCalled = false;
	private pendingCompose = false;
	private pendingLayout = false;
	private pendingSnapshot = false;
	private pin: PushPin;
	private snapshotsPanel: SnapshotsPanel;
	private status: HTMLElement;

	// =============================================================================================================================
	public constructor(p: Readonly<FmmMinimapCreateParam>, public panel: Panel) {
		this.data = { ...Snapshot.NULLDATA, label: p.title };
		this.minimapId = Minimap.idCounter++;
		this.verbosity = p.verbosity;
		let showingSnapshot: FmmSnapshot;
		const ef = panel.ef;
		const frame = (this.frame = ef.createElement('DIV'));
		frame.className = Fmm.CLASS.MinimapFrame;
		frame.draggable = true;
		frame.ondragstart = ev => ev.dataTransfer.setData('text/plain', this.dragData);
		frame.style.cursor = 'grab';
		frame.style.position = 'relative';
		const header = frame.appendChild(ef.createElement('DIV'));
		header.className = Fmm.CLASS.Header;
		header.style.overflow = 'hidden';
		header.onmouseenter = (ev: MouseEvent) => {
			ev.stopPropagation();
			if (this.pin.isPinned) return;
			showingSnapshot = undefined;
			this.detail.setDisplay(this.minimapId, this.data, this.summary);
		};
		this.status = ef.createElement('DIV');
		const statusStyle = this.status.style;
		const title = G.ELLIPSIS(ef.createElement('LABEL'));
		title.className = Fmm.CLASS.Title;
		title.textContent = title.title = p.title;
		this.detail = p.usePanelDetail ? panel.detail : new Detail(ef, undefined);
		if (!p.usePanelDetail)
			this.detailPopup = new Popup(ef, Fmm.CLASS.DetailPopup, this.detail.e, p.anchor ? this.frame : panel.popupParent);
		this.snapshotsPanel = new SnapshotsPanel(ef, frame);
		this.pin = new PushPin(ef, frame);
		let popup: Popup;
		if (p.anchor) {
			panel.add(this, undefined);
			header.appendChild(title);
			statusStyle.position = 'absolute';
			statusStyle.top = statusStyle.bottom = statusStyle.left = statusStyle.right = '0';
			if (!Minimap.POSITIONS.includes(p.anchor.style.position)) p.anchor.style.position = 'relative';
			p.anchor.appendChild(this.status);
			popup = new Popup(ef, Fmm.CLASS.MinimapPopup, this.frame, this.status);
			let prev = this.status.previousElementSibling;
			while (prev && !prev.className.includes('fmm-')) prev = prev.previousElementSibling;
			if (prev) p.anchor.removeChild(prev);
			new MutationObserver((_: MutationRecord[], observer: MutationObserver) => {
				if (!this.status || this.status.parentElement === p.anchor) return;
				observer.disconnect();
				this.destructor();
				popup.destructor();
			}).observe(p.anchor, { childList: true });
		} else {
			panel.add(this, frame);
			header.style.whiteSpace = 'nowrap';
			header.appendChild(this.status);
			statusStyle.display = 'inline-block';
			statusStyle.margin = '1px 2px 0 1px';
			statusStyle.height = '0.5em';
			statusStyle.width = '0.8em';
			header.appendChild(title);
		}
		this.d = {
			doUpdates: new Debouncer(() => this.doPendingUpdates(), p.debounceMsec || 200),
			// eslint-disable-next-line @typescript-eslint/unbound-method
			onUpdate: p.onUpdate || Minimap.ONUPDATE,
			resizeObserver: new ResizeObserver(() => {
				this.pendingLayout = true;
				this.d.doUpdates.schedule();
			}),
			updatesParam: {
				aggregateLabels: p.aggregateLabels || {},
				ancestors: new WeakMap(),
				customWidgetIds: [] as string[],
				dynamicLabels: p.dynamicLabels || ([] as string[]),
				ef,
				form: p.form,
				framework: p.framework,
				nameCounter: 1,
				page: p.page || p.form,
				popup,
				snapshotsPanel: this.snapshotsPanel,
				snapshotUpcall: {
					showDetail: (d: FmmSnapshot) =>
						this.pin.isPinned || this.detail.setDisplay(this.minimapId, (showingSnapshot = d), this.values[d.name]),
					snapshotHidden: (e: HTMLElement, d: FmmSnapshot) => {
						if (showingSnapshot === d) showingSnapshot = undefined;
						this.detail.clear(d);
						this.pin.trackOff(e, frame);
					}
				},
				store: p.store || this,
				storeListener: () => this.takeSnapshot(),
				useWidthToScale: p.useWidthToScale,
				values: this.values,
				widgetFactories: p.widgetFactories
			},
			stores: new FormStoreItems()
		};
		const showPopups = () => {
			if (this.d) this.d.doUpdates.doNow();
			if (popup) popup.show(true);
			if (this.detailPopup) this.detailPopup.show(false);
			else this.panel.showDetailPopup();
		};
		this.status.onmouseover = (ev: MouseEvent) => {
			ev.stopPropagation();
			if (p.anchor && !popup?.isShowing) showPopups();
		};
		frame.onmouseenter = (ev: MouseEvent) => {
			if (showingSnapshot) this.detail.setDisplay(this.minimapId, showingSnapshot, this.values[showingSnapshot.name]);
			if (!this.pin.isPinned) this.pin.trackOn(this.snapshotsPanel, ev);
			if (!p.anchor) showPopups();
		};
		frame.onmouseleave = () => {
			if (this.pin.isPinned) return;
			this.pin.trackOff(undefined, frame);
			if (this.detailPopup) this.detailPopup.hide();
			else this.panel.hideDetailPopup();
			if (popup) popup.hide();
		};
		this.updateLayoutOnScroll = this.updateLayoutOnScroll.bind(this);
		this.d.resizeObserver.observe(p.form);
		// eslint-disable-next-line @typescript-eslint/unbound-method
		this.d.updatesParam.page.addEventListener('scroll', this.updateLayoutOnScroll, true);
		this.d.updatesParam.store.notifyMinimap(this, true);
	}

	// =============================================================================================================================
	private static ONUPDATE(_: FmmMinimapSnapshot) {
		/**/
	}

	// =============================================================================================================================
	public destructor() {
		this.detach();
		if (!this.status?.parentElement) return; // called recursively by MutationObserver
		this.status.parentElement.removeChild(this.status); // may trigger MutationObserver
		this.snapshotsPanel.destructor(); // snapshot destructors call detail
		this.snapshotsPanel = undefined;
		if (this.detail !== this.panel.detail) this.detail.destructor();
		this.detail = undefined;
		if (this.detailPopup) this.detailPopup.destructor();
		this.detailPopup = undefined;
		this.frame.onmouseenter = this.frame.onmouseleave = undefined;
		this.panel.remove(this, this.frame);
		this.frame = undefined;
		this.panel = undefined;
		this.pin.destructor();
		this.pin = undefined;
		this.status = undefined;
	}

	// =============================================================================================================================
	public compose(customWidgetIds: string[]) {
		if (!this.d) return;
		this.d.updatesParam.customWidgetIds = customWidgetIds || [];
		this.updateComposition();
	}

	// =============================================================================================================================
	public createStoreItem(_: HTMLElement, createDefaultStoreItem: () => FmmStoreItem) {
		return createDefaultStoreItem();
	}

	// =============================================================================================================================
	public detach() {
		if (!this.d) return;
		this.d.doUpdates.destructor();
		this.d.resizeObserver.disconnect();
		this.pendingCompose = this.pendingLayout = false;
		this.pendingSnapshot = true;
		this.doPendingUpdates();
		if (this.d.updatesParam.popup) this.frame.parentElement.className += ' ' + Fmm.CLASS.Detached;
		else this.frame.className += ' ' + Fmm.CLASS.Detached;
		// eslint-disable-next-line @typescript-eslint/unbound-method
		this.d.updatesParam.page.removeEventListener('scroll', this.updateLayoutOnScroll, true);
		this.d.updatesParam.store.notifyMinimap(this, false);
		this.d.stores.destructor();
		this.d = undefined;
	}

	// =============================================================================================================================
	public isDetached() {
		return this.d === undefined;
	}

	// =============================================================================================================================
	public isPinnedToPanelDetail() {
		return this.pin.isPinned && this.detail === this.panel.detail;
	}

	// =============================================================================================================================
	public notifyMinimap(_: Minimap, _on: boolean) {
		/**/
	}

	// =============================================================================================================================
	public takeSnapshot() {
		if (!this.d) return false;
		this.pendingSnapshot = true;
		this.d.doUpdates.schedule();
		return true;
	}

	// =============================================================================================================================
	protected doPendingUpdates() {
		if (!this.d) return;
		const tStart = this.verbosity ? Date.now() : 0;
		if (this.pendingCompose) this.d.stores.compose(this.d.updatesParam);
		const tCompose = this.verbosity ? Date.now() : 0;
		if (this.pendingLayout) {
			const pageRect = this.d.updatesParam.page.getBoundingClientRect();
			if (pageRect.height && pageRect.width) {
				const scale = this.snapshotsPanel.computeScale(pageRect, this.d.updatesParam);
				this.snapshotsPanel.show(false);
				this.d.stores.layoutSnapshots(this.d.updatesParam, pageRect, scale);
				this.snapshotsPanel.show(true);
			}
		}
		const tLayout = this.verbosity ? Date.now() : 0;
		let tUpdate = tLayout;
		const data = this.data;
		if (this.pendingSnapshot) {
			const snapshots = this.d.stores.takeSnapshot(this.values);
			this.status.className = data.status = this.snapshotsPanel.computeStatus();
			const summary: Record<string, string> = {};
			if (data.status !== Fmm.STATUS.Disabled)
				snapshots.filter(s => s.error && s.status === data.status)
					.forEach(s => summary[s.aggregateLabel || s.label] = s.error);
			const summaryKeys = Object.keys(summary).sort();
			this.summary.splice(0, this.summary.length, ...summaryKeys.map(key => key + ': ' + summary[key]));
			const minimapSnapshot: FmmMinimapSnapshot = { snapshots, status: data.status, title: data.label, values: this.values };
			this.detail.refreshDisplay(this.minimapId);
			this.dragData = JSON.stringify(minimapSnapshot);
			if (this.verbosity) tUpdate = Date.now();
			if (!this.onUpdateBeingCalled) {
				this.onUpdateBeingCalled = true;
				this.d.onUpdate(minimapSnapshot);
				this.onUpdateBeingCalled = false;
			}
		}
		if (this.verbosity) {
			const lCompose = this.pendingCompose ? ' Compose(ms)=' + String(tCompose - tStart) : '';
			const lLayout = this.pendingLayout ? ' Layout(ms)=' + String(tLayout - tCompose) : '';
			const lSnapshot = this.pendingSnapshot ? ' Snapshot(ms)=' + String(tUpdate - tLayout) : '';
			if (lCompose || lLayout || lSnapshot) console.log('FormMinimap[' + data.label + ']' + lCompose + lLayout + lSnapshot);
		}
		this.pendingCompose = this.pendingLayout = this.pendingSnapshot = false;
	}

	// =============================================================================================================================
	private updateComposition() {
		this.pendingCompose = this.pendingLayout = true;
		this.takeSnapshot();
	}

	// =============================================================================================================================
	private updateLayoutOnScroll(ev: Event) {
		if (ev.target instanceof HTMLElement && this.d.updatesParam.ancestors.has(ev.target)) {
			this.pendingLayout = true;
			this.d.doUpdates.schedule();
		}
	}
}

// =================================================================================================================================
//						P A N E L
// =================================================================================================================================
class Panel implements FmmPanel {
	private static readonly EF: FmmElementFactory = {
		createElement: (t: string) => document.createElement(t),
		createElementNS: (n: string, q: string) => document.createElementNS(n, q)
	};
	public readonly detail: Detail;
	public readonly popupParent: HTMLElement;
	private readonly detailPopup: Popup;
	private readonly div: HTMLElement;
	private readonly minimaps: Minimap[] = [];

	// =============================================================================================================================
	public constructor(
		public readonly ef: FmmElementFactory,
		parent: HTMLElement,
		detailParent: HTMLElement,
		private readonly vertical: boolean
	) {
		this.ef = ef || Panel.EF;
		this.detail = new Detail(this.ef, detailParent);
		this.popupParent = parent.appendChild(this.ef.createElement('DIV'));
		const popupParentStyle = this.popupParent.style;
		popupParentStyle.position = 'relative'; // so popup child can use position:absolute
		if (!detailParent) this.detailPopup = new Popup(this.ef, Fmm.CLASS.DetailPopup, this.detail.e, this.popupParent);
		this.div = parent.appendChild(this.ef.createElement('DIV'));
		const divStyle = this.div.style;
		divStyle.height = divStyle.width = '100%';
		divStyle.overflowX = vertical ? 'hidden' : 'scroll';
		divStyle.overflowY = vertical ? 'scroll' : 'hidden';
		divStyle.whiteSpace = vertical ? 'none' : 'nowrap';
	}

	// =============================================================================================================================
	public destructor() {
		if (this.detail) this.detail.destructor();
		if (this.detailPopup) this.detailPopup.destructor();
		this.minimaps.splice(0).forEach(m => m.destructor());
	}

	// =============================================================================================================================
	public add(minimap: Minimap, frame: HTMLElement) {
		if (frame) {
			this.div.appendChild(frame);
			frame.style.height = frame.style.width = '100%';
			frame.style.display = this.vertical ? 'block' : 'inline-block';
			frame.scrollIntoView();
		}
		this.minimaps.push(minimap);
	}

	// =============================================================================================================================
	public createMinimap(p: Readonly<FmmMinimapCreateParam>): FmmMinimap {
		const err = 'FmmMinimap <' + p.title + '> not created: invalid ';
		if (p.anchor && !(p.anchor instanceof HTMLElement)) throw new Error(err + 'anchor');
		if (!(p.form instanceof HTMLFormElement)) throw new Error(err + 'form');
		if (p.page && !(p.page instanceof HTMLElement)) throw new Error(err + 'page');
		return new Minimap(p, this);
	}

	// =============================================================================================================================
	public destroyDetached() {
		this.minimaps.filter(m => m.isDetached()).forEach(m => m.destructor());
	}

	// =============================================================================================================================
	public hideDetailPopup() {
		if (this.detailPopup && !this.minimaps.find(m => m.isPinnedToPanelDetail())) this.detailPopup.hide();
	}

	// =============================================================================================================================
	public remove(minimap: Minimap, frame: HTMLElement) {
		frame.parentElement.removeChild(frame);
		const index = this.minimaps.findIndex(m => m === minimap);
		if (index >= 0) this.minimaps.splice(index, 1);
	}

	// =============================================================================================================================
	public showDetailPopup() {
		if (this.detailPopup) this.detailPopup.show(false);
	}
}

// =================================================================================================================================
//						P O P U P
// =================================================================================================================================
class Popup {
	private readonly div: HTMLElement;

	// =============================================================================================================================
	public constructor(ef: FmmElementFactory, className: string, content: HTMLElement, parent: HTMLElement) {
		this.div = parent.appendChild(ef.createElement('DIV'));
		this.div.className = className;
		this.div.style.display = 'none';
		this.div.style.position = 'absolute';
		this.div.appendChild(content);
		parent.style.overflow = 'visible'; // to show Popup outside parent
		content.style.display = 'block';
		content.style.position = 'relative';
	}

	// =============================================================================================================================
	public destructor() {
		if (this.div.parentElement) this.div.parentElement.removeChild(this.div);
	}

	// =============================================================================================================================
	public get isShowing() {
		return this.div.style.display !== 'none';
	}

	// =============================================================================================================================
	public getElementSize(e: HTMLElement) {
		const style = this.div.style;
		if (style.display !== 'none') {
			const rect = this.div.getBoundingClientRect();
			const eRect = e.getBoundingClientRect();
			return [rect.height - (eRect.top - rect.top), rect.width - (eRect.left - rect.left)];
		}
		style.visibility = 'hidden';
		style.display = 'block';
		const rect1 = this.div.getBoundingClientRect();
		const eRect1 = e.getBoundingClientRect();
		style.display = 'none';
		style.visibility = 'visible';
		return [rect1.height - (eRect1.top - rect1.top), rect1.width - (eRect1.left - rect1.left)];
	}

	// =============================================================================================================================
	public hide() {
		this.div.style.display = 'none';
	}

	// =============================================================================================================================
	public show(anchoredAtParentCenter: boolean) {
		const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		const style = this.div.style;
		if (style.display !== 'none') return;
		style.left = style.bottom = 'auto';
		style.right = anchoredAtParentCenter ? '50%' : '105%';
		style.top = anchoredAtParentCenter ? '50%' : '0';
		style.visibility = 'hidden';
		style.display = 'block';
		const rect = this.div.getBoundingClientRect();
		if (rect.left < 0) {
			style.left = anchoredAtParentCenter ? '50%' : '105%';
			style.right = 'auto';
			const rectL = this.div.getBoundingClientRect();
			if (vw - rectL.left - rectL.width < rect.left) {
				style.left = 'auto';
				style.right = anchoredAtParentCenter ? '50%' : '105%';
			}
		}
		if (rect.bottom > vh) {
			style.bottom = anchoredAtParentCenter ? '50%' : '0';
			style.top = 'auto';
			const rectB = this.div.getBoundingClientRect();
			if (rectB.top + rectB.height - vh > rect.bottom) {
				style.bottom = 'auto';
				style.top = anchoredAtParentCenter ? '50%' : '0';
			}
		}
		style.visibility = 'visible';
	}
}

// =================================================================================================================================
//						P U S H P I N
// =================================================================================================================================
class PushPin {
	private readonly SIZE = 24;
	private readonly svg: SVGSVGElement;
	private parentCursor: string;
	private pinned = false;

	// =============================================================================================================================
	public constructor(ef: FmmElementFactory, parent: HTMLElement) {
		const uri = 'http://www.w3.org/2000/svg';
		const svg = parent.appendChild(ef.createElementNS(uri, 'svg')) as SVGSVGElement;
		this.svg = svg;
		parent.style.overflow = 'visible'; // to show parts of PushPin outside parent
		svg.setAttribute('height', String(this.SIZE));
		svg.setAttribute('width', String(this.SIZE));
		const radius = this.SIZE / 4;
		const circle = svg.appendChild(ef.createElementNS(uri, 'circle')) as SVGCircleElement;
		circle.setAttribute('class', Fmm.CLASS.Pushpin);
		circle.setAttribute('cx', String(this.SIZE - radius));
		circle.setAttribute('cy', String(radius));
		circle.setAttribute('r', String(radius));
		const polygon = svg.appendChild(ef.createElementNS(uri, 'polygon')) as SVGPolygonElement;
		[
			[this.SIZE / 2 + 1, Math.ceil(radius * 1.5)],
			[0, this.SIZE],
			[Math.ceil(this.SIZE * 0.6), radius * 2 - 1]
		].forEach(([x, y]) => {
			const point = this.svg.createSVGPoint();
			point.x = x;
			point.y = y;
			polygon.points.appendItem(point);
		});
		polygon.setAttribute('style', 'fill:black');
		svg.style.display = 'none';
		svg.style.position = 'absolute';
	}

	// =============================================================================================================================
	public destructor() {
		this.trackOff(undefined, undefined);
	}

	// =============================================================================================================================
	public get isPinned() {
		return this.pinned;
	}

	// =============================================================================================================================
	public trackOff(onlyIfParentedByE: Element, frame: HTMLElement) {
		const parent = this.svg.parentNode as HTMLElement;
		if (onlyIfParentedByE && onlyIfParentedByE !== parent) return;
		this.pinned = false;
		this.svg.style.display = 'none';
		parent.onclick = parent.onmousemove = undefined;
		parent.style.cursor = this.parentCursor;
		if (frame) frame.appendChild(this.svg);
		else parent.removeChild(this.svg);
	}

	// =============================================================================================================================
	public trackOn(snapshots: SnapshotsPanel, mev: MouseEvent) {
		const parent = this.svg.parentNode as HTMLElement;
		const rect = parent.getBoundingClientRect();
		parent.appendChild(this.svg);
		this.parentCursor = parent.style.cursor || 'default';
		this.svg.style.zIndex = String(+parent.style.zIndex + 1);
		parent.onclick = (ev: MouseEvent) => {
			if (this.pinned) {
				this.pinned = false;
				parent.style.cursor = 'none';
				parent.appendChild(this.svg);
				this.move(ev, rect);
			} else {
				this.pinned = true;
				parent.style.cursor = this.parentCursor;
				// position percentagewise to cater for any framework changes while pinned
				if (snapshots.reparentPushPinToSnapshot(this.svg, ev)) return;
				const left = Math.max(1, ((ev.clientX - rect.left) * 100) / rect.width);
				this.svg.style.left = String(left) + '%';
				const bottom = Math.min(95, ((rect.top + rect.height - ev.clientY) * 100) / rect.height);
				this.svg.style.bottom = String(bottom) + '%';
			}
		};
		parent.onmousemove = (ev: MouseEvent) => this.move(ev, rect);
		this.move(mev, rect);
		parent.style.cursor = 'none';
		this.svg.style.display = 'block';
	}

	// =============================================================================================================================
	private move(ev: MouseEvent, rect: DOMRect) {
		if (this.pinned) return;
		const left = ev.clientX - rect.left;
		const bottom = rect.top + rect.height - ev.clientY;
		this.svg.style.left = String(Math.min(rect.width, Math.max(left, 0))) + 'px';
		this.svg.style.bottom = String(Math.min(rect.height, Math.max(bottom, 0))) + 'px';
	}
}

// =================================================================================================================================
//						S N A P S H O T
// =================================================================================================================================
class Snapshot {
	public static readonly NULLDATA: FmmSnapshot = {
		aggregateLabel: undefined,
		error: undefined,
		label: undefined,
		name: undefined,
		placeholder: undefined,
		status: undefined
	};
	public readonly data: FmmSnapshot;
	private readonly div: HTMLElement;
	private rect: DOMRectReadOnly;

	// =============================================================================================================================
	public constructor(aggregateLabel: string, name: string, ef: FmmElementFactory, panel: SnapshotsPanel, upcall: SnapshotUpcall) {
		this.data = { ...Snapshot.NULLDATA, aggregateLabel, name };
		this.div = ef.createElement('DIV');
		this.div.style.position = 'absolute';
		this.div.onmouseover = (ev: MouseEvent) => {
			ev.stopPropagation();
			upcall.showDetail(this.data);
		};
		panel.addSnapshot(this, this.div);
		this.destructor = () => {
			this.div.onmouseover = undefined;
			panel.removeSnapshot(this, this.div);
			upcall.snapshotHidden(this.div, this.data);
		};
	}

	// =============================================================================================================================
	public destructor() {
		// function body overwritten in constructor
	}

	// =============================================================================================================================
	public reparentPushPin(svg: SVGSVGElement, x: number, y: number) {
		const rect = this.rect;
		if (!rect || x < rect.left || x > rect.left + rect.width) return false;
		if (y < rect.top || y > rect.top + rect.height) return false;
		this.div.appendChild(svg);
		svg.style.left = String(((x - rect.left) * 100) / rect.width) + '%';
		svg.style.bottom = String(((rect.top + rect.height - y) * 100) / rect.height) + '%';
		return true;
	}

	// =============================================================================================================================
	public setRect(rect: DOMRectReadOnly, upcall: SnapshotUpcall) {
		if (
			this.rect &&
			rect &&
			this.rect.left === rect.left &&
			this.rect.top === rect.top &&
			this.rect.right === rect.right &&
			this.rect.bottom === rect.bottom
		)
			return undefined;
		this.rect = rect;
		const style = this.div.style;
		if (!rect) {
			upcall.snapshotHidden(this.div, this.data);
			return (style.display = 'none');
		}
		style.left = String(rect.left) + 'px';
		style.top = String(rect.top) + 'px';
		style.height = String(rect.height) + 'px';
		style.width = String(rect.width) + 'px';
		return (style.display = 'block');
	}

	// =============================================================================================================================
	public setStatus(status: string) {
		this.div.className = status;
	}
}

// =================================================================================================================================
//						S N A P S H O T S P A N E L
// =================================================================================================================================
class SnapshotsPanel {
	private readonly div: HTMLElement;
	private readonly list: Snapshot[] = [];

	// =============================================================================================================================
	public constructor(ef: FmmElementFactory, parent: Element) {
		this.div = parent.appendChild(ef.createElement('DIV'));
		this.div.style.position = 'relative';
	}

	// =============================================================================================================================
	public destructor() {
		if (this.div.parentElement) this.div.parentElement.removeChild(this.div);
		this.list.splice(0).forEach(snapshot => snapshot.destructor());
	}

	// =============================================================================================================================
	public addSnapshot(snapshot: Snapshot, snapshotDiv: Element) {
		this.list.push(snapshot);
		this.div.appendChild(snapshotDiv);
	}

	// =============================================================================================================================
	public computeScale(pageRect: DOMRectReadOnly, p: UpdatesParam) {
		const [height, width] = p.popup?.getElementSize(this.div) || this.getSize();
		const hscale = height / pageRect.height;
		const wscale = width / pageRect.width;
		const pstyle = this.div.parentElement.style;
		const style = this.div.style;
		if (p.useWidthToScale) {
			const heightpx = String(Math.round(pageRect.height * wscale)) + 'px';
			pstyle.width = style.width = String(width) + 'px';
			style.height = heightpx; // may be vetoed by CSS
			if (style.height === heightpx) return wscale;
		} else {
			const widthpx = String(Math.round(pageRect.width * hscale)) + 'px';
			style.height = String(height) + 'px';
			pstyle.width = style.width = widthpx; // may be vetoed by CSS
			if (pstyle.width === widthpx && style.width === widthpx) return hscale;
		}
		// aspect ratio got vetoed by CSS; do the best we can under the circumstances
		const scale = Math.min(hscale, wscale);
		style.height = String(Math.round(pageRect.height * scale)) + 'px';
		pstyle.width = style.width = String(Math.round(pageRect.width * scale)) + 'px';
		return scale;
	}

	// =============================================================================================================================
	public computeStatus() {
		let allDisabled = Fmm.STATUS.Disabled;
		let anyRequired: string;
		let anyValid: string;
		const snapshots = this.list;
		for (let i = snapshots.length; --i >= 0; ) {
			const status = snapshots[i].data.status;
			if (status === Fmm.STATUS.Invalid) return Fmm.STATUS.Invalid;
			if (status !== Fmm.STATUS.Disabled) allDisabled = undefined;
			if (status === Fmm.STATUS.Required) anyRequired = Fmm.STATUS.Required;
			if (status === Fmm.STATUS.Valid) anyValid = Fmm.STATUS.Valid;
		}
		return anyRequired || allDisabled || anyValid || Fmm.STATUS.Optional;
	}

	// =============================================================================================================================
	public removeSnapshot(snapshot: Snapshot, snapshotDiv: Element) {
		const ix = this.list.findIndex(s => s === snapshot);
		if (ix < 0) return;
		this.list.splice(ix, 1);
		this.div.removeChild(snapshotDiv);
	}

	// =============================================================================================================================
	public reparentPushPinToSnapshot(svg: SVGSVGElement, ev: MouseEvent) {
		const rect = this.div.getBoundingClientRect();
		const x = ev.clientX - rect.left;
		const y = ev.clientY - rect.top;
		return !!this.list.find(snapshot => snapshot.reparentPushPin(svg, x, y));
	}

	// =============================================================================================================================
	public show(on: boolean) {
		this.div.style.display = on ? 'block' : 'none';
	}

	// =============================================================================================================================
	private getSize() {
		const pRect = this.div.parentElement.getBoundingClientRect();
		const rect = this.div.getBoundingClientRect();
		return [pRect.height - (rect.top - pRect.top), pRect.width - (rect.left - pRect.left)];
	}
}

// =================================================================================================================================
//						S N A P S H O T U P C A L L
// =================================================================================================================================
interface SnapshotUpcall {
	showDetail(data: FmmSnapshot): void;
	snapshotHidden(element: HTMLElement, data: FmmSnapshot): void;
}

// =================================================================================================================================
//						S T O R E I T E M
// =================================================================================================================================
class StoreItem implements FmmStoreItem {
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

	// =============================================================================================================================
	protected constructor(
		private readonly fe: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
		event: string,
		listener: EventListener
	) {
		fe.addEventListener(event, listener);
		this.destructor = () => fe.removeEventListener(event, listener);
	}

	// =============================================================================================================================
	public static NEW(e: HTMLElement, listener: EventListener): FmmStoreItem {
		const tag = e.tagName;
		if (tag === 'INPUT') {
			const ie = e as HTMLInputElement;
			return StoreItem.INPUTTYPES.includes(ie.type) ? new StoreItemInput(ie, listener) : undefined;
		}
		if (tag === 'SELECT') return new StoreItemSelect(e as HTMLSelectElement, listener);
		if (tag === 'TEXTAREA') return new StoreItemTextArea(e as HTMLTextAreaElement, listener);
		return undefined;
	}

	// =============================================================================================================================
	public destructor() {
		// function body overwritten in constructor
	}

	// =============================================================================================================================
	public getError(_: boolean): string {
		return this.fe.validationMessage || (this.fe.required && !this.fe.value && 'Required') || undefined;
	}

	// =============================================================================================================================
	public getName() {
		return this.fe.name;
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
		for (let i = options.length; --i >= index; ) if (options[i].selected) indexes.push(i);
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

	// =============================================================================================================================
	public isDisabled() {
		return this.e.disabled || this.e.readOnly;
	}
}

// =================================================================================================================================
//						U P D A T E S P A R A M
// =================================================================================================================================
interface UpdatesParam {
	readonly aggregateLabels: FmmMapString;
	readonly dynamicLabels: string[];
	readonly ef: FmmElementFactory;
	readonly form: HTMLFormElement;
	readonly framework: FmmFramework;
	readonly page: Element;
	readonly popup: Popup;
	readonly snapshotsPanel: SnapshotsPanel;
	readonly snapshotUpcall: SnapshotUpcall;
	readonly store: FmmStore;
	readonly storeListener: EventListener;
	readonly useWidthToScale: boolean;
	readonly values: FmmMapStrings;
	readonly widgetFactories: FmmWidgetFactory[];
	ancestors: AncestorsMap;
	customWidgetIds: string[];
	nameCounter: number;
}
