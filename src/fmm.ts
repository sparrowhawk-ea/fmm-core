// =================================================================================================================================
//						F M M E L E M E N T F A C T O R Y
// =================================================================================================================================
export interface FmmElementFactory {
	createElement(tagName: string): HTMLElement;
	createElementNS(namespaceURI: string, qualifiedName: string): Element;
}

// =================================================================================================================================
//						F M M F O R M
// =================================================================================================================================
export interface FmmForm {
	clearLayoutHandler(): void;
	clipsContentX(element: FmmFormElement): boolean;
	clipsContentY(element: FmmFormElement): boolean;
	getDisplayLabel(element: FmmFormElement, label: FmmFormElement): string;
	getDisplayValue(element: FmmFormElement, label: string, rawValue: unknown): string;
	getElements(customElementIds: string[]): FmmFormElement[];
	getLabelFor(element: FmmFormElement): FmmFormElement;
	getParent(element: FmmFormElement): FmmFormElement;
	getPlaceholder(element: FmmFormElement): string;
	getRect(element?: FmmFormElement): Readonly<FmmRect>;
	getStoreKeys(element: FmmFormElement): string[];
	isDisabled(element: FmmFormElement): boolean;
	isHidden(element: FmmFormElement): boolean;
	setLayoutHandler(handler: FmmFormLayoutHandler): void;
}

// =================================================================================================================================
//						F M M F O R M E L E M E N T
// =================================================================================================================================
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FmmFormElement {
	// marker interface
}

// =================================================================================================================================
//						F M M F O R M L A Y O U T H A N D L E R
// =================================================================================================================================
export interface FmmFormLayoutHandler {
	handleLayout(element: FmmFormElement): void;
}

// =================================================================================================================================
//						F M M F R A M E W O R K
// =================================================================================================================================
export interface FmmFramework {
	createFrameworkItem(name: string, element: FmmFormElement): FmmFrameworkItem;
}

// =================================================================================================================================
//						F M M F R A M E W O R K I T E M
// =================================================================================================================================
export interface FmmFrameworkItem {
	destructor(): void;
	getEnvelope(name: string, element: FmmFormElement, label: FmmFormElement): FmmFormElement;
	getError(name: string, element: FmmFormElement, envelope: FmmFormElement, hasValue: boolean): string;
	getLabel(name: string, envelope: FmmFormElement): FmmFormElement;
	getValue(name: string, element: FmmFormElement, envelope: FmmFormElement, label: string): string;
}

// =================================================================================================================================
//						F M M M A P S T R I N G
// =================================================================================================================================
export type FmmMapString = Record<string, string>;

// =================================================================================================================================
//						F M M M I N I M A P
// =================================================================================================================================
export interface FmmMinimap {
	compose(customElementIds?: string[]): void;
	destructor(): void;
	detach(): void;
	takeSnapshot(): boolean;
}

// =================================================================================================================================
//						F M M M I N I M A P C R E A T E P A R A M
// =================================================================================================================================
export interface FmmMinimapCreateParam {
	aggregateLabels?: FmmMapString;
	anchor?: HTMLDivElement;
	debounceMsec?: number;
	dynamicLabels?: string[];
	form: FmmForm;
	framework?: FmmFramework;
	onUpdate?: FmmOnUpdate;
	store?: FmmStore;
	title: string;
	usePanelDetail?: boolean;
	useWidthToScale?: boolean;
	verbosity?: number;
	zoomFactor?: number;
}

// =================================================================================================================================
//						F M M O N U P D A T E
// =================================================================================================================================
export type FmmOnUpdate = (snapshots: FmmSnapshots) => void;

// =================================================================================================================================
//						F M M P A N E L
// =================================================================================================================================
export interface FmmPanel {
	createMinimap(p: Readonly<FmmMinimapCreateParam>): FmmMinimap;
	destroyDetached(): void;
	destructor(): void;
}

// =================================================================================================================================
//						F M M R E C T
// =================================================================================================================================
export interface FmmRect {
	bottom: number;
	height: number;
	left: number;
	right: number;
	top: number;
	width: number;
}

// =================================================================================================================================
//						F M M S N A P S H O T
// =================================================================================================================================
export interface FmmSnapshot {
	readonly aggregateLabel: string;
	readonly name: string;
	aggregateValues: string[];
	error: string;
	label: string;
	placeholder: string;
	status: FmmStatus;
	value: string;
}

// =================================================================================================================================
//						F M M S N A P S H O T S
// =================================================================================================================================
export interface FmmSnapshots {
	snapshots: FmmSnapshot[],
	status: FmmStatus,
	title: string
}

// =================================================================================================================================
//						F M M S T A T U S
// =================================================================================================================================
export type FmmStatus = 'Disabled' | 'Invalid' | 'Optional' | 'Required' | 'Valid';

// =================================================================================================================================
//						F M M S T O R E
// =================================================================================================================================
export interface FmmStore {
	createStoreItem(form: FmmForm, element: FmmFormElement): FmmStoreItem;
	getError(form: FmmForm, item: FmmStoreItem, hasValue: boolean): string;
	getName(form: FmmForm, item: FmmStoreItem): string;
	getValue(form: FmmForm, item: FmmStoreItem): unknown;
	isDisabled(form: FmmForm, item: FmmStoreItem): boolean;
	notifyMinimapOnUpdate(minimap: FmmMinimap, on: boolean): void;
}

// =================================================================================================================================
//						F M M S T O R E E R R O R S
// =================================================================================================================================
export type FmmStoreErrors = Record<string, string | string[]>;

// =================================================================================================================================
//						F M M S T O R E I T E M
// =================================================================================================================================
export interface FmmStoreItem {
	destructor(): void;
}

// =================================================================================================================================
//						F M M S T O R E V A L U E S
// =================================================================================================================================
export type FmmStoreValues = Record<string, unknown>;
