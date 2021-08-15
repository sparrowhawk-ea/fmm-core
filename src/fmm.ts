// =================================================================================================================================
//						F M M E L E M E N T F A C T O R Y
// =================================================================================================================================
export interface FmmElementFactory {
	createElement(tagName: string): HTMLElement;
	createElementNS(namespaceURI: string, qualifiedName: string): Element;
}

// =================================================================================================================================
//						F M M F R A M E W O R K
// =================================================================================================================================
export interface FmmFramework {
	createFrameworkItem(name: string, element: HTMLElement): FmmFrameworkItem;
}

// =================================================================================================================================
//						F M M F R A M E W O R K I T E M
// =================================================================================================================================
export interface FmmFrameworkItem {
	destructor(): void;
	getEnvelope(name: string, element: HTMLElement, label: HTMLElement): HTMLElement;
	getError(name: string, element: HTMLElement, envelope: HTMLElement, hasValue: boolean): string;
	getLabel(name: string, envelope: HTMLElement): HTMLElement;
	getValue(name: string, element: HTMLElement, envelope: HTMLElement, label: string): string;
}

// =================================================================================================================================
//						F M M M A P S T R I N G
// =================================================================================================================================
export interface FmmMapString {
	[k: string]: string;
}

// =================================================================================================================================
//						F M M M I N I M A P
// =================================================================================================================================
export interface FmmMinimap {
	compose(customWidgetIds?: string[]): void;
	destructor(): void;
	detach(): void;
	takeSnapshot(): boolean;
}

// =================================================================================================================================
//						F M M M I N I M A P C R E A T E P A R A M
// =================================================================================================================================
export interface FmmMinimapCreateParam {
	aggregateLabels?: FmmMapString;
	anchor?: HTMLElement;
	debounceMsec?: number;
	dynamicLabels?: string[];
	form: HTMLFormElement;
	framework?: FmmFramework;
	onUpdate?: FmmOnUpdate;
	page?: HTMLElement;
	store?: FmmStore;
	title: string;
	usePanelDetail?: boolean;
	useWidthToScale?: boolean;
	verbosity?: number;
	widgetFactories?: FmmWidgetFactory[];
	zoomMaxPercent?: number;
}

// =================================================================================================================================
//						F M M O N U P D A T E
// =================================================================================================================================
export type FmmOnUpdate = (snapshots: FmmSnapshot[], status: FmmStatus) => void;

// =================================================================================================================================
//						F M M P A N E L
// =================================================================================================================================
export interface FmmPanel {
	createMinimap(p: Readonly<FmmMinimapCreateParam>): FmmMinimap;
	destroyDetached(): void;
	destructor(): void;
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
//						F M M S T A T U S
// =================================================================================================================================
export type FmmStatus = 'Disabled' | 'Invalid' | 'Optional' | 'Required' | 'Valid';

// =================================================================================================================================
//						F M M S T O R E
// =================================================================================================================================
export interface FmmStore {
	createStoreItem(element: HTMLElement, createDefaultItem: () => FmmStoreItem): FmmStoreItem;
	notifyMinimap(minimap: FmmMinimap, on: boolean): void;
}

// =================================================================================================================================
//						F M M S T O R E E R R O R S
// =================================================================================================================================
export interface FmmStoreErrors {
	[k: string]: string | string[];
}

// =================================================================================================================================
//						F M M S T O R E I T E M
// =================================================================================================================================
export interface FmmStoreItem {
	destructor(): void;
	getError(hasValue: boolean): string;
	getName(): string;
	getValue(): unknown;
	isDisabled(): boolean;
}

// =================================================================================================================================
//						F M M S T O R E V A L U E S
// =================================================================================================================================
export interface FmmStoreValues {
	[k: string]: unknown;
}

// =================================================================================================================================
//						F M M W I D G E T
// =================================================================================================================================
export interface FmmWidget {
	destructor(): void;
	getDisplayValue(name: string, element: HTMLElement, label: string, rawValue: unknown): string;
}

// =================================================================================================================================
//						F M M W I D G E T F A C T O R Y
// =================================================================================================================================
export interface FmmWidgetFactory {
	createWidget(name: string, element: HTMLElement): FmmWidget;
}
