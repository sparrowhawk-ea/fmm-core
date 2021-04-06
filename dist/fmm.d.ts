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
export interface FmmMapErrors {
    [k: string]: string | string[];
}
export interface FmmMapString {
    [k: string]: string;
}
export interface FmmMapStrings {
    [k: string]: string[];
}
export interface FmmMapValues {
    [k: string]: unknown;
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
}
export interface FmmMinimapSnapshot {
    snapshots: FmmSnapshot[];
    status: string;
    title: string;
    values: FmmMapStrings;
}
export declare type FmmOnUpdate = (snapshot: Readonly<FmmMinimapSnapshot>) => void;
export interface FmmPanel {
    createMinimap(p: Readonly<FmmMinimapCreateParam>): FmmMinimap;
    destroyDetached(): void;
    destructor(): void;
}
export interface FmmSnapshot {
    readonly aggregateLabel: string;
    readonly name: string;
    error: string;
    label: string;
    placeholder: string;
    status: string;
}
export interface FmmStore {
    createStoreItem(element: HTMLElement, createDefaultItem: () => FmmStoreItem): FmmStoreItem;
    notifyMinimap(minimap: FmmMinimap, on: boolean): void;
}
export interface FmmStoreItem {
    destructor(): void;
    getError(hasValue: boolean): string;
    getName(): string;
    getValue(): unknown;
    isDisabled(): boolean;
}
export interface FmmWidget {
    destructor(): void;
    getDisplayValue(name: string, element: HTMLElement, label: string, rawValue: unknown): string;
}
export interface FmmWidgetFactory {
    createWidget(name: string, element: HTMLElement): FmmWidget;
}
