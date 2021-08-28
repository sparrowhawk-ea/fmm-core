export interface FmmElementFactory {
    createElement(tagName: string): HTMLElement;
    createElementNS(namespaceURI: string, qualifiedName: string): Element;
}
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
export interface FmmFormElement {
}
export interface FmmFormLayoutHandler {
    handleLayout(element: FmmFormElement): void;
}
export interface FmmFramework {
    createFrameworkItem(name: string, element: FmmFormElement): FmmFrameworkItem;
}
export interface FmmFrameworkItem {
    destructor(): void;
    getEnvelope(name: string, element: FmmFormElement, label: FmmFormElement): FmmFormElement;
    getError(name: string, element: FmmFormElement, envelope: FmmFormElement, hasValue: boolean): string;
    getLabel(name: string, envelope: FmmFormElement): FmmFormElement;
    getValue(name: string, element: FmmFormElement, envelope: FmmFormElement, label: string): string;
}
export interface FmmMapString {
    [k: string]: string;
}
export interface FmmMinimap {
    compose(customElementIds?: string[]): void;
    destructor(): void;
    detach(): void;
    takeSnapshot(): boolean;
}
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
export declare type FmmOnUpdate = (snapshots: FmmSnapshots) => void;
export interface FmmPanel {
    createMinimap(p: Readonly<FmmMinimapCreateParam>): FmmMinimap;
    destroyDetached(): void;
    destructor(): void;
}
export interface FmmRect {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
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
export interface FmmSnapshots {
    snapshots: FmmSnapshot[];
    status: FmmStatus;
    title: string;
}
export declare type FmmStatus = 'Disabled' | 'Invalid' | 'Optional' | 'Required' | 'Valid';
export interface FmmStore {
    createStoreItem(form: FmmForm, element: FmmFormElement): FmmStoreItem;
    getError(form: FmmForm, item: FmmStoreItem, hasValue: boolean): string;
    getName(form: FmmForm, item: FmmStoreItem): string;
    getValue(form: FmmForm, item: FmmStoreItem): unknown;
    isDisabled(form: FmmForm, item: FmmStoreItem): boolean;
    notifyMinimapOnUpdate(minimap: FmmMinimap, on: boolean): void;
}
export interface FmmStoreErrors {
    [k: string]: string | string[];
}
export interface FmmStoreItem {
    destructor(): void;
}
export interface FmmStoreValues {
    [k: string]: unknown;
}
