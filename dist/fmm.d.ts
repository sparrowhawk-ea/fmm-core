export interface FmmElementFactory {
    createElement(tagName: string): HTMLElement;
    createElementNS(namespaceURI: string, qualifiedName: string): Element;
}
export interface FmmFramework {
    createFrameworkItem(name: string, element: HTMLElement): FmmFrameworkItem;
}
export interface FmmFrameworkItem {
    destructor(): void;
    getEnvelope(name: string, element: HTMLElement, label: HTMLElement): HTMLElement;
    getError(name: string, element: HTMLElement, envelope: HTMLElement, hasValue: boolean): string;
    getLabel(name: string, envelope: HTMLElement): HTMLElement;
    getValue(name: string, element: HTMLElement, envelope: HTMLElement, label: string): string;
}
export interface FmmMapString {
    [k: string]: string;
}
export interface FmmMinimap {
    compose(customWidgetIds?: string[]): void;
    destructor(): void;
    detach(): void;
    takeSnapshot(): boolean;
}
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
export declare type FmmOnUpdate = (snapshots: FmmSnapshot[], status: FmmStatus) => void;
export interface FmmPanel {
    createMinimap(p: Readonly<FmmMinimapCreateParam>): FmmMinimap;
    destroyDetached(): void;
    destructor(): void;
}
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
export declare type FmmStatus = 'Disabled' | 'Invalid' | 'Optional' | 'Required' | 'Valid';
export interface FmmStore {
    createStoreItem(element: HTMLElement, createDefaultItem: () => FmmStoreItem): FmmStoreItem;
    notifyMinimap(minimap: FmmMinimap, on: boolean): void;
}
export interface FmmStoreErrors {
    [k: string]: string | string[];
}
export interface FmmStoreItem {
    destructor(): void;
    getError(hasValue: boolean): string;
    getName(): string;
    getValue(): unknown;
    isDisabled(): boolean;
}
export interface FmmStoreValues {
    [k: string]: unknown;
}
export interface FmmWidget {
    destructor(): void;
    getDisplayValue(name: string, element: HTMLElement, label: string, rawValue: unknown): string;
}
export interface FmmWidgetFactory {
    createWidget(name: string, element: HTMLElement): FmmWidget;
}
