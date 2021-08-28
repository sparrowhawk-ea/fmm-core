import {
	FmmElementFactory, FmmForm, FmmFormElement, FmmFormLayoutHandler, FmmFramework, FmmFrameworkItem, FmmMapString, FmmMinimap,
	FmmMinimapCreateParam, FmmOnUpdate, FmmPanel, FmmRect, FmmSnapshot, FmmSnapshots, FmmStatus, FmmStore, FmmStoreItem
} from './fmm';
import { FmmStoreHTML } from './fmm-html';

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
	public static readonly STATUS_CLASS: Record<FmmStatus, string> = Object.freeze({
		Disabled: 'fmm-disabled',
		Invalid: 'fmm-invalid',
		Optional: 'fmm-optional',
		Required: 'fmm-required',
		Valid: 'fmm-valid'
	});

	// =============================================================================================================================
	public static createMinimap(
		p: Readonly<FmmMinimapCreateParam>,
		parent?: HTMLDivElement,
		ef?: FmmElementFactory
	): FmmMinimap {
		const err = 'FmmMinimap not created: invalid ';
		if (parent) {
			const panel = new Panel(ef, parent, undefined, true);
			return panel.createMinimap({ ...p, anchor: undefined, usePanelDetail: true });
		} else {
			if (!p.anchor) throw new Error(err + 'anchor');
			const panel = new Panel(ef, undefined, undefined, false);
			return panel.createMinimap({ ...p, usePanelDetail: false });
		}
	}

	// =============================================================================================================================
	public static createPanel(
		parent: HTMLDivElement,
		detailParent?: HTMLDivElement,
		vertical?: boolean,
		ef?: FmmElementFactory
	): FmmPanel {
		const err = 'FmmPanel not created: invalid ';
		if (!parent) throw new Error(err + 'parent');
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
//						A G G R E G A T E V A L U E S
// =================================================================================================================================
interface AggregateValues {
	[k: string]: string[];
}

// =================================================================================================================================
//						C L I P C O N T E X T
// =================================================================================================================================
class ClipContext {
	private readonly clip: Readonly<FmmRect>;
	private readonly clipX: boolean;
	private readonly clipY: boolean;

	// =============================================================================================================================
	public constructor(form: FmmForm, e: FmmFormElement, private readonly parent: ClipContext) {
		this.clip = parent?.clipRect(form.getRect(e)) || form.getRect(e);
		this.clipX = form.clipsContentX(e);
		this.clipY = form.clipsContentY(e);
	}

	// =============================================================================================================================
	public clipRect(rect: FmmRect): Readonly<FmmRect> {
		const left = Math.max(rect.left, this.clip.left);
		const top = Math.max(rect.top, this.clip.top);
		const width = Math.max(0, (this.clipX ? Math.min(rect.right, this.clip.right) : rect.right) - left);
		const height = Math.max(0, (this.clipY ? Math.min(rect.bottom, this.clip.bottom) : rect.bottom) - top);
		const clipped: FmmRect = { left, top, width, height, right: left + width, bottom: top + height };
		return width && height && this.parent ? this.parent.clipRect(clipped) : clipped;
	}
}

// =================================================================================================================================
//						C L I P C O N T E X T A N C E S T O R S
// =================================================================================================================================
type ClipContextAncestors = WeakMap<FmmFormElement, ClipContext>;

// =================================================================================================================================
//						D E B O U N C E R
// =================================================================================================================================
class Debouncer {
	private readonly _doTask = this.doTask.bind(this);
	private notBeforeMsec?: number;
	private timer?: number;

	// =============================================================================================================================
	public constructor(private task: () => void, private readonly debounceMsec: number) { }

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
	public readonly e: HTMLFieldSetElement;
	private readonly error: HTMLDivElement;
	private readonly label: HTMLSpanElement;
	private readonly status: HTMLDivElement;
	private readonly value: HTMLTextAreaElement;
	private data = Snapshot.NULLDATA;
	private minimapId: number;

	// =============================================================================================================================
	public constructor(ef: FmmElementFactory, parent: HTMLDivElement) {
		const fieldset = (this.e = ef.createElement('FIELDSET') as HTMLFieldSetElement);
		fieldset.className = Fmm.CLASS.Fieldset;
		const legend = G.ELLIPSIS(ef.createElement('LEGEND'));
		legend.className = Fmm.CLASS.Legend;
		this.status = legend.appendChild(ef.createElement('DIV')) as HTMLDivElement;
		this.status.style.display = 'inline-block';
		this.status.style.margin = '3px 6px 0 3px';
		this.status.style.height = '0.7em';
		this.status.style.width = '1em';
		this.label = legend.appendChild(ef.createElement('SPAN')) as HTMLSpanElement;
		this.label.textContent = G.NBSP;
		fieldset.appendChild(legend);
		this.value = fieldset.appendChild(ef.createElement('TEXTAREA')) as HTMLTextAreaElement;
		this.value.className = Fmm.CLASS.Value;
		this.value.readOnly = true;
		this.error = G.ELLIPSIS(fieldset.appendChild(ef.createElement('DIV'))) as HTMLDivElement;
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
	}

	// =============================================================================================================================
	public refreshDisplay(minimapId: number) {
		if (minimapId !== this.minimapId) return;
		const data = this.data;
		const labelPrefix = data.aggregateLabel?.concat(': ') || '';
		this.error.textContent = this.error.title = data.error || G.NBSP;
		this.label.textContent = this.label.title = labelPrefix + data.label || G.NBSP;
		this.status.className = Fmm.STATUS_CLASS[data.status];
		this.value.placeholder = data.placeholder || '';
		this.value.value = data.aggregateValues ? data.aggregateValues.join('\n') : data.value || '';
	}

	// =============================================================================================================================
	public setDisplay(minimapId: number, newData: FmmSnapshot) {
		this.data = newData || Snapshot.NULLDATA;
		this.refreshDisplay((this.minimapId = minimapId));
	}
}

// =================================================================================================================================
//						F O R M S T O R E I T E M
// =================================================================================================================================
class FormStoreItem {
	private static readonly DEFAULT_FRAMEWORK: FmmFrameworkItem = {
		destructor: (): void => undefined,
		getEnvelope: (_: string, _e: FmmFormElement, _l: FmmFormElement) => undefined,
		getError: (_: string, _e: FmmFormElement, _n: FmmFormElement, _v: boolean): string => undefined,
		getLabel: (_: string, _e: FmmFormElement): FmmFormElement => undefined,
		getValue: (_: string, _e: FmmFormElement, _n: FmmFormElement, _l: string): string => undefined
	};
	private readonly dynamicLabel: boolean;
	private readonly envelope: FmmFormElement;
	private readonly form: FmmForm;
	private readonly framework: FmmFrameworkItem;
	private readonly label: FmmFormElement;
	private readonly snapshot: Snapshot;

	// =============================================================================================================================
	public constructor(name: string, public readonly e: FmmFormElement, private readonly storeItem: FmmStoreItem,
		p: Readonly<ParamUpdates>) {
		const label = p.form.getLabelFor(e);
		this.dynamicLabel = p.dynamicLabels.includes(name);
		this.form = p.form;
		this.framework = p.framework?.createFrameworkItem(name, e) || FormStoreItem.DEFAULT_FRAMEWORK;
		this.envelope = this.framework.getEnvelope(name, e, label) || this.getCommonAncestor(e, label) || e;
		this.label = label || this.framework.getLabel(name, this.envelope);
		this.snapshot = new Snapshot(name, p);
	}

	// =============================================================================================================================
	public destructor() {
		this.framework.destructor();
		this.storeItem.destructor();
	}

	// =============================================================================================================================
	public layoutSnapshot(ancestors: ClipContextAncestors, pageRect: Readonly<FmmRect>, scale: number) {
		const parent = this.form.getParent(this.envelope);
		const clipContext = ancestors.get(parent) || this.getClipContext(parent, ancestors);
		const rect = clipContext.clipRect(this.form.getRect(this.envelope));
		if (!rect.width || !rect.height) return this.snapshot.setRect(undefined);
		const left = Math.floor((rect.left - pageRect.left) * scale);
		const top = Math.floor((rect.top - pageRect.top) * scale);
		const height = Math.max(2, Math.floor(rect.height * scale));
		const width = Math.max(2, Math.floor(rect.width * scale));
		return this.snapshot.setRect(new DOMRectReadOnly(left, top, width, height));
	}

	// =============================================================================================================================
	public removeIfDetached() {
		if (this.form.getParent(this.envelope)) {
			for (let e = this.e; e; e = this.form.getParent(e))
				if (e === this.envelope) return false; // this.envelope.contains(this.e)
		}
		this.snapshot.destructor();
		this.destructor();
		return true;
	}

	// =============================================================================================================================
	public takeSnapshot(form: FmmForm, store: FmmStore): FmmSnapshot {
		const data = this.snapshot.data;
		const name = data.name;
		if (data.label === undefined || this.dynamicLabel) {
			data.label = Fmm.trim(form.getDisplayLabel(this.e, this.label) || name);
			data.placeholder = Fmm.trim(this.form.getPlaceholder(this.e));
		}
		let displayValue = Fmm.trim(this.framework.getValue(name, this.e, this.envelope, data.label));
		if (!displayValue) {
			const rawValue = store.getValue(form, this.storeItem);
			if (rawValue) displayValue = Fmm.trim(form.getDisplayValue(this.e, data.label, rawValue));
		}
		data.value = displayValue;
		const hasValue = !!displayValue;
		if (hasValue && data.aggregateValues) data.aggregateValues.push(displayValue);
		data.error = Fmm.trim(
			this.framework.getError(name, this.e, this.envelope, hasValue) || store.getError(form, this.storeItem, hasValue));
		if (store.isDisabled(form, this.storeItem)) {
			this.snapshot.setStatus('Disabled');
		} else if (hasValue) {
			this.snapshot.setStatus(data.error ? 'Invalid' : 'Valid');
		} else {
			this.snapshot.setStatus(data.error ? 'Required' : 'Optional');
		}
		return data;
	}

	// =============================================================================================================================
	private getClipContext(e: FmmFormElement, ancestors: ClipContextAncestors): ClipContext {
		const parent = this.form.getParent(e);
		const parentContext = parent ? ancestors.get(parent) || this.getClipContext(parent, ancestors) : undefined;
		const clipContext = new ClipContext(this.form, e, parentContext);
		ancestors.set(e, clipContext);
		return clipContext;
	}

	// =============================================================================================================================
	private getCommonAncestor(e: FmmFormElement, label: FmmFormElement): FmmFormElement {
		const labelAncestors: FmmFormElement[] = [];
		do { labelAncestors.push(label); } while ((label = this.form.getParent(label)));
		while (e && !labelAncestors.includes(e)) e = this.form.getParent(e);
		return e;
	}
}

// =================================================================================================================================
//						F O R M S T O R E I T E M S
// =================================================================================================================================
class FormStoreItems {
	private static readonly NAMEPREFIX = '$FmmFSI';
	private readonly list: FormStoreItem[] = [];
	private ignore = new WeakSet();
	private nameCounter = 0;

	// =============================================================================================================================
	public destructor() {
		this.ignore = new WeakSet();
		this.list.splice(0).forEach(fw => fw.destructor());
	}

	// =============================================================================================================================
	public compose(p: Readonly<ParamUpdates>) {
		const elements = p.form.getElements(p.customElementIds);
		const prev = this.list.splice(0);
		prev.forEach(fw => fw.removeIfDetached() || this.list.push(fw));
		const processed = new WeakSet();
		this.list.forEach(fw => processed.add(fw.e));
		elements.forEach(e => {
			if (processed.has(e) || this.ignore.has(e)) return undefined;
			if (p.form.isHidden(e)) return this.ignore.add(e);
			const storeItem = p.store.createStoreItem(p.form, e);
			if (storeItem) {
				const name = p.store.getName(p.form, storeItem) || FormStoreItems.NAMEPREFIX + String(this.nameCounter++);
				this.list.push(new FormStoreItem(name, e, storeItem, p));
			}
			processed.add(e);
		});
	}

	// =============================================================================================================================
	public layoutSnapshots(ancestors: ClipContextAncestors, pageRect: Readonly<FmmRect>, scale: number) {
		this.list.forEach(fw => fw.layoutSnapshot(ancestors, pageRect, scale));
	}

	// =============================================================================================================================
	public takeSnapshots(form: FmmForm, store: FmmStore) {
		return this.list.map(fw => fw.takeSnapshot(form, store));
	}
}

// =================================================================================================================================
//						F R A M E
// =================================================================================================================================
class Frame {
	private static readonly POSITIONS = ['absolute', 'fixed', 'relative', 'sticky'];
	private dragData = '';
	public div: HTMLDivElement;
	public header: HTMLDivElement;
	public popup: Popup;

	// =============================================================================================================================
	public constructor(ef: FmmElementFactory, anchor: HTMLDivElement, status: HTMLDivElement, minimapTitle: string) {
		const div = (this.div = ef.createElement('DIV') as HTMLDivElement);
		div.className = Fmm.CLASS.MinimapFrame;
		div.draggable = true;
		div.ondragstart = this.onDragStart.bind(this);
		div.style.cursor = 'grab';
		div.style.position = 'relative';
		const header = (this.header = div.appendChild(ef.createElement('DIV')) as HTMLDivElement);
		header.className = Fmm.CLASS.Header;
		header.style.overflow = 'hidden';
		header.style.whiteSpace = 'nowrap';
		const title = G.ELLIPSIS(ef.createElement('LABEL'));
		title.className = Fmm.CLASS.Title;
		title.style.cursor = 'inherit';
		title.textContent = title.title = minimapTitle;
		const statusStyle = status.style;
		if (anchor) {
			statusStyle.position = 'absolute';
			statusStyle.top = statusStyle.bottom = statusStyle.left = statusStyle.right = '0';
			if (!Frame.POSITIONS.includes(anchor.style.position)) anchor.style.position = 'relative';
			anchor.appendChild(status);
			this.popup = new Popup(ef, Fmm.CLASS.MinimapPopup, this.div, status);
			let prev = status.previousElementSibling;
			while (prev && !prev.className.includes('fmm-')) prev = prev.previousElementSibling;
			if (prev) anchor.removeChild(prev);
			this.setDestroyOnDetachFromDOM(anchor, status);
		} else {
			header.appendChild(status);
			statusStyle.display = 'inline-block';
			statusStyle.margin = '1px 2px 0 1px';
			statusStyle.height = '0.5em';
			statusStyle.width = '0.8em';
		}
		header.appendChild(title);
	}

	// =============================================================================================================================
	public destructor() {
		if (!this.div) return;
		this.detach();
		if (this.popup) this.popup.destructor();
		this.popup = undefined;
		this.div.onmouseenter = this.div.onmouseleave = undefined;
		this.div.parentElement.removeChild(this.div);
		this.div = undefined;
	}

	// =============================================================================================================================
	public detach() {
		if (!this.div) return;
		if (this.popup) this.div.parentElement.classList.add(Fmm.CLASS.Detached);
		else this.div.classList.add(Fmm.CLASS.Detached);
	}

	// =============================================================================================================================
	public newDetailPopup(ef: FmmElementFactory, detail: Detail) {
		return new Popup(ef, Fmm.CLASS.DetailPopup, detail.e, this.div);
	}

	// =============================================================================================================================
	public setSnapshotResult(result: FmmSnapshots) {
		this.dragData = JSON.stringify(result);
	}

	// =============================================================================================================================
	private onDragStart(ev: DragEvent) {
		ev.dataTransfer.setData('text/plain', this.dragData);
	}

	// =============================================================================================================================
	private setDestroyOnDetachFromDOM(anchor: HTMLDivElement, status: HTMLDivElement) {
		new MutationObserver((_: MutationRecord[], observer: MutationObserver) => {
			if (status.parentElement === anchor) return;
			observer.disconnect();
			this.destructor();
		}).observe(anchor, { childList: true });
	}
}

// =================================================================================================================================
//						G
// =================================================================================================================================
const G: {
	ELLIPSIS: (_: HTMLElement) => HTMLElement;
	NBSP: string;
	NOP: () => void;
} = {
	ELLIPSIS: (e: HTMLElement) => {
		e.style.overflow = 'hidden';
		e.style.textOverflow = 'ellipsis';
		e.style.whiteSpace = 'nowrap';
		return e;
	},
	NBSP: '\u00a0',
	NOP: () => { /**/ }
};

// =================================================================================================================================
//						M I N I M A P
// =================================================================================================================================
class Minimap implements FmmFormLayoutHandler, FmmMinimap {
	private static readonly DEFAULT_DEBOUNCEMSEC = 200;
	private static readonly MAX_ZOOMFACTOR = 5.0;
	private static idCounter = 0;
	public readonly title: string;
	public readonly useWidthToScale: boolean;
	private readonly anchored: boolean;
	private readonly minimapId: number;
	private readonly summaryData: FmmSnapshot;
	private readonly verbosity: number;
	private activeSnapshot: FmmSnapshot;
	private d: { // all refernences which can be shed on detach() when the client FORM is destroyed
		readonly doUpdates: Debouncer;
		readonly onUpdate: FmmOnUpdate;
		readonly paramUpdates: ParamUpdates;
		readonly storeItems: FormStoreItems;
		clipContextAncestors: ClipContextAncestors;
	};
	private detail: Detail;
	private detailPopup: Popup;
	private frame: Frame;
	private onUpdateBeingCalled = false;
	private pendingCompose = false;
	private pendingLayout = false;
	private pendingSnapshot = false;
	private pin: PushPin;
	private snapshotsPanel: SnapshotsPanel;
	private status: HTMLDivElement;

	// =============================================================================================================================
	public constructor(p: Readonly<FmmMinimapCreateParam>, private panel: Panel) {
		const ef = panel.ef;
		this.anchored = !!p.anchor;
		this.status = ef.createElement('DIV') as HTMLDivElement;
		this.summaryData = { ...Snapshot.NULLDATA, label: p.title };
		this.title = p.title;
		const frame = (this.frame = new Frame(ef, p.anchor, this.status, this.title));
		panel.add(this, this.anchored ? undefined : frame.div);
		frame.div.onmouseenter = this.onFrameEnter.bind(this);
		frame.div.onmouseleave = this.onFrameLeave.bind(this);
		if (this.anchored && p.zoomFactor)
			frame.popup.setZoomable(this, frame.header, Math.min(Minimap.MAX_ZOOMFACTOR, Math.max(0.0, p.zoomFactor)));
		frame.header.onmouseenter = this.onHeaderEnter.bind(this);
		this.snapshotsPanel = new SnapshotsPanel(ef, frame.div);
		this.pin = new PushPin(ef, frame.div);
		this.minimapId = Minimap.idCounter++;
		this.useWidthToScale = p.useWidthToScale;
		this.verbosity = p.verbosity || 0;
		this.detail = p.usePanelDetail ? panel.detail : new Detail(ef, undefined);
		this.d = {
			clipContextAncestors: new WeakMap(),
			doUpdates: new Debouncer(() => this.doPendingUpdates(), p.debounceMsec || Minimap.DEFAULT_DEBOUNCEMSEC),
			// eslint-disable-next-line @typescript-eslint/unbound-method
			onUpdate: p.onUpdate || Minimap.ONUPDATE,
			paramUpdates: {
				aggregateLabels: p.aggregateLabels || {},
				aggregateValues: {},
				customElementIds: [] as string[],
				dynamicLabels: p.dynamicLabels || ([] as string[]),
				ef: panel.ef,
				form: p.form,
				framework: p.framework,
				snapshotUpcall: {
					hideDetail: this.snapshotHidden.bind(this),
					showDetail: this.snapshotActive.bind(this)
				},
				snapshotsPanel: this.snapshotsPanel,
				store: p.store || new FmmStoreHTML()
			},
			storeItems: new FormStoreItems()
		};
		if (!p.usePanelDetail)
			this.detailPopup = this.anchored ? frame.newDetailPopup(ef, this.detail) : panel.newDetailPopup(this.detail);
		this.status.onmouseover = this.onStatusEnter.bind(this);
		this.d.paramUpdates.store.notifyMinimapOnUpdate(this, true);
		this.d.paramUpdates.form.setLayoutHandler(this);
	}

	// =============================================================================================================================
	private static ONUPDATE(_: FmmSnapshots) {
		// no-op
	}

	// =============================================================================================================================
	public destructor() {
		this.detach();
		if (!this.status?.parentElement) return; // called recursively by MutationObserver
		this.status.parentElement.removeChild(this.status); // may trigger MutationObserver
		this.snapshotsPanel.destructor(); // snapshot destructors call detail and pin so destruction order matters
		this.snapshotsPanel = undefined;
		this.pin.destructor();
		this.pin = undefined;
		this.frame.destructor();
		this.frame = undefined;
		if (this.detail !== this.panel.detail) this.detail.destructor();
		this.detail = undefined;
		if (this.detailPopup) this.detailPopup.destructor();
		this.detailPopup = undefined;
		this.panel.remove(this);
		this.panel = undefined;
		this.status = undefined;
	}

	// =============================================================================================================================
	public compose(customElementIds: string[]) {
		if (!this.d) return;
		this.d.paramUpdates.customElementIds = customElementIds || [];
		this.pendingCompose = this.pendingLayout = true;
		this.takeSnapshot();
	}

	// =============================================================================================================================
	public get isDetached() {
		return this.d === undefined;
	}

	// =============================================================================================================================
	public get isPinned() {
		return this.pin.isPinned;
	}

	// =============================================================================================================================
	public get isPinnedToPanelDetail() {
		return this.pin.isPinned && this.detail === this.panel.detail;
	}

	// =============================================================================================================================
	public detach() {
		if (!this.d) return;
		this.d.doUpdates.destructor();
		this.pendingCompose = this.pendingLayout = false;
		this.pendingSnapshot = true;
		this.doPendingUpdates();
		this.frame.detach();
		this.d.paramUpdates.form.clearLayoutHandler();
		this.d.paramUpdates.store.notifyMinimapOnUpdate(this, false);
		this.d.storeItems.destructor();
		this.d = undefined;
	}

	// =============================================================================================================================
	public handleLayout(e: FmmFormElement) {
		if (!e || this.d.clipContextAncestors.has(e)) {
			this.pendingLayout = true;
			this.d.doUpdates.schedule();	
		}
	}

	// =============================================================================================================================
	public layout(zoomEvent: MouseEvent) {
		const tStart = zoomEvent && this.verbosity ? Date.now() : 0;
		const pageRect = this.d.paramUpdates.form.getRect();
		if (pageRect.height && pageRect.width) {
			this.d.clipContextAncestors = new WeakMap();
			const scale = this.snapshotsPanel.computeScale(pageRect, this.frame, this.useWidthToScale);
			this.snapshotsPanel.show(false);
			this.d.storeItems.layoutSnapshots(this.d.clipContextAncestors, pageRect, scale);
			this.snapshotsPanel.show(true);
			if (zoomEvent) {
				this.pin.trackOff(undefined, this.frame);
				this.pin.trackOn(this.snapshotsPanel, zoomEvent);
			}
		}
		if (zoomEvent && this.verbosity) console.log('FormMinimap[' + this.title + '] Layout(ms)=' + String(Date.now() - tStart));
	}

	// =============================================================================================================================
	public notifyMinimap(_: Minimap, _on: boolean) {
		// no-op
	}

	// =============================================================================================================================
	public onFrameEnter(ev: MouseEvent) {
		if (!this.pin.isPinned) this.pin.trackOn(this.snapshotsPanel, ev);
		if (this.activeSnapshot) this.detail.setDisplay(this.minimapId, this.activeSnapshot);
		if (!this.anchored) this.showPopups();
	}

	// =============================================================================================================================
	public onFrameLeave() {
		if (this.isPinned) return;
		this.pin.trackOff(undefined, this.frame);
		this.detail.clear(this.activeSnapshot);
		if (this.detailPopup) this.detailPopup.hide();
		else this.panel.hideDetailPopup();
		if (this.frame.popup) this.frame.popup.hide();
	}

	// =============================================================================================================================
	public onHeaderEnter(ev: MouseEvent) {
		ev.stopPropagation();
		if (this.pin.isPinned) return;
		this.activeSnapshot = undefined;
		this.detail.setDisplay(this.minimapId, this.summaryData);
	}

	// =============================================================================================================================
	public onStatusEnter(ev: MouseEvent) {
		ev.stopPropagation();
		if (this.anchored && !this.frame.popup?.isShowing) this.showPopups();
	};

	// =============================================================================================================================
	public takeSnapshot() {
		if (!this.d) return false;
		this.pendingSnapshot = true;
		this.d.doUpdates.schedule();
		return true;
	}

	// =============================================================================================================================
	private doTakeSnapshot(): FmmSnapshots {
		const p = this.d.paramUpdates;
		// we need to preserve the aggregateValues references since they are cached in individual FmmSnapshot
		const aggregateValues = Object.values(p.aggregateValues);
		aggregateValues.forEach(v => v.splice(0));
		const snapshots = this.d.storeItems.takeSnapshots(p.form, p.store);
		aggregateValues.forEach(v => v.sort());
		const status = this.snapshotsPanel.computeStatus();
		this.status.className = Fmm.STATUS_CLASS[status];

		// aggregateValues for the minimap summaryStatus is the list of errors in the form fields
		const errorsSummary: Record<string, string> = {};
		if (status !== 'Disabled') snapshots.filter(s => s.error && s.status === status).forEach(
			s => errorsSummary[s.aggregateLabel || s.label] = s.error);
		this.summaryData.aggregateValues = Object.keys(errorsSummary).sort().map(key => key + ': ' + errorsSummary[key]);
		this.summaryData.status = status;

		// set the result for drag-and-drop and client onUpdate() callback
		return { snapshots, status, title: this.title };
	}

	// =============================================================================================================================
	private doPendingUpdates() {
		if (!this.d) return;
		const tStart = this.verbosity ? Date.now() : 0;
		if (this.pendingCompose) this.d.storeItems.compose(this.d.paramUpdates);
		const tCompose = this.verbosity ? Date.now() : 0;
		if (this.pendingLayout) this.layout(undefined);
		const tLayout = this.verbosity ? Date.now() : 0;
		let tUpdate = tLayout;
		if (this.pendingSnapshot) {
			const result = this.doTakeSnapshot();
			this.frame.setSnapshotResult(result);
			if (this.verbosity) tUpdate = Date.now();
			this.detail.refreshDisplay(this.minimapId);
			if (!this.onUpdateBeingCalled) {
				this.onUpdateBeingCalled = true;
				this.d.onUpdate(result);
				this.onUpdateBeingCalled = false;
			}
		}
		if (this.verbosity) {
			const lCompose = this.pendingCompose ? ' Compose(ms)=' + String(tCompose - tStart) : '';
			const lLayout = this.pendingLayout ? ' Layout(ms)=' + String(tLayout - tCompose) : '';
			const lSnapshot = this.pendingSnapshot ? ' Snapshot(ms)=' + String(tUpdate - tLayout) : '';
			if (lCompose || lLayout || lSnapshot) console.log('FormMinimap[' + this.title + ']' + lCompose + lLayout + lSnapshot);
		}
		this.pendingCompose = this.pendingLayout = this.pendingSnapshot = false;
	}

	// =============================================================================================================================
	private showPopups() {
		if (this.d) this.d.doUpdates.doNow();
		if (this.frame.popup) this.frame.popup.show(true);
		if (this.detailPopup) this.detailPopup.show(false);
		else this.panel.showDetailPopup();
	}

	// =============================================================================================================================
	private snapshotActive(data: FmmSnapshot) {
		if (this.pin.isPinned) return;
		this.detail.setDisplay(this.minimapId, (this.activeSnapshot = data));
	}

	// =============================================================================================================================
	private snapshotHidden(e: HTMLDivElement, data: FmmSnapshot) {
		if (this.activeSnapshot === data) this.activeSnapshot = undefined;
		this.detail.clear(data);
		this.pin.trackOff(e, this.frame);
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
	private readonly detailPopup: Popup;
	private readonly div: HTMLDivElement;
	private readonly minimaps: Minimap[] = [];
	private readonly popupParent: HTMLDivElement;

	// =============================================================================================================================
	public constructor(
		public readonly ef: FmmElementFactory,
		parent: HTMLDivElement,
		detailParent: HTMLDivElement,
		private readonly vertical: boolean
	) {
		this.ef = ef || Panel.EF;
		if (parent) {
			this.detail = new Detail(this.ef, detailParent);
			this.popupParent = parent.appendChild(this.ef.createElement('DIV')) as HTMLDivElement;
			const popupParentStyle = this.popupParent.style;
			popupParentStyle.position = 'relative'; // so popup child can use position:absolute
			if (!detailParent) this.detailPopup = this.newDetailPopup(this.detail);
			this.div = parent.appendChild(this.ef.createElement('DIV')) as HTMLDivElement;
			const divStyle = this.div.style;
			divStyle.height = divStyle.width = '100%';
			divStyle.overflowX = vertical ? 'hidden' : 'scroll';
			divStyle.overflowY = vertical ? 'scroll' : 'hidden';
			divStyle.whiteSpace = vertical ? 'none' : 'nowrap';
		}
	}

	// =============================================================================================================================
	public destructor() {
		if (this.detail) this.detail.destructor();
		if (this.detailPopup) this.detailPopup.destructor();
		this.minimaps.splice(0).forEach(m => m.destructor());
	}

	// =============================================================================================================================
	public add(minimap: Minimap, frame: HTMLDivElement) {
		if (frame && this.div) {
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
		if (!p.form) throw new Error(err + 'form');
		return new Minimap(p, this);
	}

	// =============================================================================================================================
	public destroyDetached() {
		this.minimaps.filter(m => m.isDetached).forEach(m => m.destructor());
	}

	// =============================================================================================================================
	public hideDetailPopup() {
		if (this.detailPopup && !this.minimaps.find(m => m.isPinnedToPanelDetail)) this.detailPopup.hide();
	}

	// =============================================================================================================================
	public newDetailPopup(detail: Detail) {
		return new Popup(this.ef, Fmm.CLASS.DetailPopup, detail.e, this.popupParent);
	}

	// =============================================================================================================================
	public remove(minimap: Minimap) {
		const index = this.minimaps.findIndex(m => m === minimap);
		if (index >= 0) this.minimaps.splice(index, 1);
	}

	// =============================================================================================================================
	public showDetailPopup() {
		if (this.detailPopup) this.detailPopup.show(false);
	}
}

// =================================================================================================================================
//						P A R A M S N A P S H O T C O N S T R U C T O R
// =================================================================================================================================
interface ParamSnapshotConstructor {
	readonly aggregateLabels: FmmMapString;
	readonly aggregateValues: AggregateValues;
	readonly ef: FmmElementFactory;
	readonly snapshotUpcall: SnapshotUpcall;
	readonly snapshotsPanel: SnapshotsPanel;
}

// =================================================================================================================================
//						P A R A M S T O R E I T E M C O N S T R U C T O R
// =================================================================================================================================
interface ParamUpdates extends ParamSnapshotConstructor {
	readonly dynamicLabels: string[];
	readonly form: FmmForm;
	readonly framework: FmmFramework;
	readonly store: FmmStore;
	customElementIds: string[];
}

// =================================================================================================================================
//						P O P U P
// =================================================================================================================================
class Popup {
	private readonly div: HTMLDivElement;

	// =============================================================================================================================
	public constructor(ef: FmmElementFactory, className: string, content: HTMLElement, parent: HTMLDivElement) {
		this.div = parent.appendChild(ef.createElement('DIV')) as HTMLDivElement;
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
	public getElementSize(e: HTMLDivElement) {
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
	public setZoomable(minimap: Minimap, trigger: HTMLDivElement, zoomFactor: number) {
		let isZoomed = false;
		let unzoomedHeight = 0;
		let unzoomedWidth = 0;
		trigger.style.cursor = 'zoom-in';
		trigger.onclick = (ev: MouseEvent) => {
			if (ev.button !== 0) return;
			ev.stopPropagation();
			if (!unzoomedHeight) {
				const rect = this.div.getBoundingClientRect();
				unzoomedHeight = rect.height;
				unzoomedWidth = rect.width;
			}
			if (minimap.useWidthToScale) this.div.style.width = String(isZoomed ? unzoomedWidth : unzoomedWidth * zoomFactor) + 'px';
			else this.div.style.height = String(isZoomed ? unzoomedHeight : unzoomedHeight * zoomFactor) + 'px';
			minimap.layout(ev);
			isZoomed = !isZoomed;
			trigger.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
		}
	}

	// =============================================================================================================================
	public show(anchoredAtParentCenter: boolean) {
		const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
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
			if (viewportWidth - rectL.left - rectL.width < rect.left) {
				style.left = 'auto';
				style.right = anchoredAtParentCenter ? '50%' : '105%';
			}
		}
		if (rect.bottom > viewportHeight) {
			style.bottom = anchoredAtParentCenter ? '50%' : '0';
			style.top = 'auto';
			const rectB = this.div.getBoundingClientRect();
			if (rectB.top + rectB.height - viewportHeight > rect.bottom) {
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
	public constructor(ef: FmmElementFactory, parent: HTMLDivElement) {
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
	public trackOff(onlyIfParentedByE: Element, frame: Frame) {
		const parent = this.svg.parentNode as HTMLDivElement;
		if (onlyIfParentedByE && onlyIfParentedByE !== parent) return;
		this.pinned = false;
		this.svg.style.display = 'none';
		parent.onclick = parent.onmousemove = undefined;
		parent.style.cursor = this.parentCursor;
		if (frame) frame.div.appendChild(this.svg);
		else parent.removeChild(this.svg);
	}

	// =============================================================================================================================
	public trackOn(snapshots: SnapshotsPanel, mev: MouseEvent) {
		const parent = this.svg.parentNode as HTMLDivElement;
		const rect = parent.getBoundingClientRect();
		parent.appendChild(this.svg);
		this.parentCursor = parent.style.cursor;
		this.svg.style.zIndex = String(+parent.style.zIndex + 1);
		parent.onclick = (ev: MouseEvent) => {
			if (ev.button !== 0) return;
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
	private move(ev: MouseEvent, rect: DOMRectReadOnly) {
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
		aggregateValues: undefined,
		error: undefined,
		label: undefined,
		name: undefined,
		placeholder: undefined,
		status: undefined,
		value: undefined
	};
	public readonly data: FmmSnapshot;
	private readonly div: HTMLDivElement;
	private readonly upcall: SnapshotUpcall;
	private rect: DOMRectReadOnly;

	// =============================================================================================================================
	public constructor(name: string, p: Readonly<ParamSnapshotConstructor>) {
		const aggregateLabel = p.aggregateLabels[name];
		if (aggregateLabel && !(name in p.aggregateValues)) p.aggregateValues[name] = [];
		this.data = {
			...Snapshot.NULLDATA,
			aggregateLabel,
			aggregateValues: p.aggregateValues[name],
			name
		};
		this.upcall = p.snapshotUpcall;
		this.div = p.ef.createElement('DIV') as HTMLDivElement;
		this.div.style.position = 'absolute';
		this.div.onmouseover = (ev: MouseEvent) => {
			ev.stopPropagation();
			this.upcall.showDetail(this.data);
		}
		p.snapshotsPanel.addSnapshot(this, this.div);
		this.destructor = () => {
			this.div.onmouseover = undefined;
			this.upcall.hideDetail(this.div, this.data);
			p.snapshotsPanel.removeSnapshot(this, this.div);
			this.destructor = G.NOP;
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
	public setRect(rect: DOMRectReadOnly) {
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
			this.upcall.hideDetail(this.div, this.data);
			return (style.display = 'none');
		}
		style.left = String(rect.left) + 'px';
		style.top = String(rect.top) + 'px';
		style.height = String(rect.height) + 'px';
		style.width = String(rect.width) + 'px';
		return (style.display = 'block');
	}

	// =============================================================================================================================
	public setStatus(status: FmmStatus) {
		this.div.className = Fmm.STATUS_CLASS[this.data.status = status];
	}
}

// =================================================================================================================================
//						S N A P S H O T U P C A L L
// =================================================================================================================================
interface SnapshotUpcall {
	hideDetail(element: HTMLDivElement, data: FmmSnapshot): void;
	showDetail(data: FmmSnapshot): void;
}

// =================================================================================================================================
//						S N A P S H O T S P A N E L
// =================================================================================================================================
class SnapshotsPanel {
	private readonly div: HTMLDivElement;
	private readonly list: Snapshot[] = [];

	// =============================================================================================================================
	public constructor(ef: FmmElementFactory, parent: HTMLDivElement) {
		this.div = parent.appendChild(ef.createElement('DIV')) as HTMLDivElement;
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
	public computeScale(pageRect: Readonly<FmmRect>, frame: Frame, useWidthToScale: boolean) {
		const [height, width] = frame.popup ? frame.popup.getElementSize(this.div) : this.getSize();
		const hscale = height / pageRect.height;
		const wscale = width / pageRect.width;
		const pstyle = this.div.parentElement.style;
		const style = this.div.style;
		if (useWidthToScale) {
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
	public computeStatus(): FmmStatus {
		let allDisabled: FmmStatus = 'Disabled';
		let anyRequired: FmmStatus;
		let anyValid: FmmStatus;
		const snapshots = this.list;
		for (let i = snapshots.length; --i >= 0;) {
			const status = snapshots[i].data.status;
			if (status === 'Invalid') return status;
			if (status !== 'Disabled') allDisabled = undefined;
			if (status === 'Required') anyRequired = status;
			if (status === 'Valid') anyValid = status;
		}
		return anyRequired || allDisabled || anyValid || 'Optional';
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
