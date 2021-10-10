interface FmmElementFactory {
    createElement(tagName: string): HTMLElement;
    createElementNS(namespaceURI: string, qualifiedName: string): Element;
}
interface FmmForm {
    clearLayoutHandler(): void;
    clipsContentX(element: FmmFormElement): boolean;
    clipsContentY(element: FmmFormElement): boolean;
    getDisplayLabel(element: FmmFormElement, label?: FmmFormElement): string;
    getDisplayValue(element: FmmFormElement, label: string, rawValue: unknown): string;
    getElements(customElementIds: string[]): FmmFormElement[];
    getLabelFor(element: FmmFormElement): FmmFormElement | undefined;
    getParent(element: FmmFormElement): FmmFormElement | undefined;
    getPlaceholder(element: FmmFormElement): string;
    getRect(element?: FmmFormElement): Readonly<FmmRect>;
    getStoreKeys(element: FmmFormElement): string[];
    isDisabled(element: FmmFormElement): boolean;
    isHidden(element: FmmFormElement): boolean;
    setLayoutHandler(handler: FmmFormLayoutHandler): void;
}
interface FmmFormElement {
}
interface FmmFormLayoutHandler {
    handleLayout(element?: FmmFormElement): void;
}
interface FmmFramework {
    createFrameworkItem(name: string, element: FmmFormElement): FmmFrameworkItem | undefined;
}
interface FmmFrameworkItem {
    destructor(): void;
    getEnvelope(name: string, element: FmmFormElement, label?: FmmFormElement): FmmFormElement | undefined;
    getError(name: string, element: FmmFormElement, envelope: FmmFormElement, hasValue: boolean): string;
    getLabel(name: string, envelope: FmmFormElement): FmmFormElement | undefined;
    getValue(name: string, element: FmmFormElement, envelope: FmmFormElement, label: string): string;
}
declare type FmmMapString = Record<string, string>;
interface FmmMinimap {
    compose(customElementIds?: string[]): void;
    destructor(): void;
    detach(): void;
    takeSnapshot(): boolean;
}
interface FmmMinimapCreateParam {
    aggregateLabels?: FmmMapString;
    anchor?: HTMLDivElement;
    debounceMsec?: number;
    dynamicLabels?: string[];
    form: FmmForm;
    framework?: FmmFramework;
    onUpdate?: FmmOnUpdate;
    ordinal?: number;
    store?: FmmStore;
    title: string;
    usePanelDetail?: boolean;
    useWidthToScale?: boolean;
    verbosity?: number;
    zoomFactor?: number;
}
declare type FmmOnUpdate = (snapshots: FmmSnapshots) => void;
interface FmmPanel {
    createMinimap(p: Readonly<FmmMinimapCreateParam>): FmmMinimap;
    destroyDetached(): void;
    destructor(): void;
}
interface FmmRect {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}
interface FmmSnapshot {
    readonly aggregateLabel: string;
    readonly name: string;
    aggregateValues: string[] | undefined;
    error: string;
    label: string;
    placeholder: string;
    status: FmmStatus;
    value: string;
}
interface FmmSnapshots {
    snapshots: FmmSnapshot[];
    status: FmmStatus;
    title: string;
}
declare type FmmStatus = 'Disabled' | 'Invalid' | 'Optional' | 'Required' | 'Valid';
interface FmmStore {
    createStoreItem(form: FmmForm, element: FmmFormElement): FmmStoreItem | undefined;
    getError(form: FmmForm, item: FmmStoreItem, hasValue: boolean): string;
    getName(form: FmmForm, item: FmmStoreItem): string;
    getValue(form: FmmForm, item: FmmStoreItem): unknown;
    isDisabled(form: FmmForm, item: FmmStoreItem): boolean;
    notifyMinimapOnUpdate(minimap: FmmMinimap, on: boolean): void;
}
declare type FmmStoreErrors = Record<string, string | string[]>;
interface FmmStoreItem {
    destructor(): void;
}
declare type FmmStoreValues = Record<string, unknown>;

declare abstract class FmmStoreBase {
    private readonly minimaps;
    notifyMinimapOnUpdate(minimap: FmmMinimap, on: boolean): void;
    protected notifyMinimaps(): void;
}
declare class FmmStoreImpl<TV extends FmmStoreValues, TE extends FmmStoreErrors> extends FmmStoreBase implements FmmStore {
    private values;
    private errors;
    constructor(values: TV, errors?: TE);
    createStoreItem(form: FmmForm, e: FmmFormElement): FmmStoreItem | undefined;
    getError(_: FmmForm, item: StoreItem$1, _hasValue: boolean): string;
    getName(_: FmmForm, item: StoreItem$1): string;
    getValue(_: FmmForm, item: StoreItem$1): unknown;
    isDisabled(form: FmmForm, item: StoreItem$1): boolean;
    update(values: TV, errors?: TE): void;
}
declare class StoreItem$1 implements FmmStoreItem {
    readonly e: FmmFormElement;
    readonly key: string;
    constructor(e: FmmFormElement, key: string);
    destructor(): void;
}

declare const FmmBootstrap4: FmmFramework;
interface FmmFormElementHTML extends FmmFormElement, HTMLElement {
}
declare class FmmFormHTML implements FmmForm {
    private readonly form;
    private static readonly CLIP;
    private readonly resizeObserver;
    private readonly page;
    private layoutHandler?;
    constructor(form: HTMLFormElement, page?: HTMLElement);
    clearLayoutHandler(): void;
    clipsContentX(e: FmmFormElementHTML): boolean;
    clipsContentY(e: FmmFormElementHTML): boolean;
    getDisplayLabel(e: FmmFormElementHTML, label: FmmFormElementHTML): string;
    getDisplayValue(e: FmmFormElementHTML, label: string, value: unknown): string;
    getElements(customElementIds: string[]): FmmFormElementHTML[];
    getLabelFor(e: FmmFormElementHTML): FmmFormElementHTML | undefined;
    getParent(e: FmmFormElementHTML): FmmFormElementHTML | undefined;
    getPlaceholder(e: FmmFormElementHTML): string;
    getRect(e?: FmmFormElementHTML): Readonly<FmmRect>;
    getStoreKeys(e: FmmFormElementHTML): string[];
    isDisabled(e: FmmFormElementHTML): boolean;
    isHidden(e: FmmFormElementHTML): boolean;
    setLayoutHandler(handler: FmmFormLayoutHandler): void;
    private onFormResize;
    private updateLayoutOnScroll;
}
declare class FmmFrameworkItemHTML implements FmmFrameworkItem {
    protected readonly wrapperClass: string;
    constructor(wrapperClass: string);
    destructor(): void;
    getEnvelope(_: string, e: FmmFormElementHTML, label: FmmFormElementHTML): FmmFormElementHTML | undefined;
    getError(_: string, _e: FmmFormElementHTML, _n: FmmFormElementHTML, _v: boolean): string;
    getLabel(_: string, envelope: FmmFormElementHTML): FmmFormElementHTML | undefined;
    getValue(_: string, _e: FmmFormElementHTML, _n: FmmFormElementHTML, _l: string): string;
}
declare class FmmStoreHTML extends FmmStoreBase implements FmmStore {
    private static readonly INPUTTYPES;
    private readonly listener;
    createStoreItem(_: FmmForm, e: FmmFormElementHTML): FmmStoreItem | undefined;
    getError(_: FmmForm, i: StoreItem, _hasValue: boolean): string;
    getName(_: FmmForm, i: StoreItem): string;
    getValue(_: FmmForm, i: StoreItem): unknown;
    isDisabled(form: FmmForm, i: StoreItem): boolean;
}
declare class StoreItem implements FmmStoreItem {
    readonly fe: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    private readonly event;
    private readonly listener;
    protected constructor(fe: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, event: string, listener: EventListener);
    destructor(): void;
    getValue(): unknown;
    isDisabled(): boolean;
}

declare class Fmm {
    static readonly CLASS: Readonly<{
        Detached: string;
        DetailPopup: string;
        Disabled: string;
        Error: string;
        Fieldset: string;
        Header: string;
        Invalid: string;
        Legend: string;
        MinimapFrame: string;
        MinimapPopup: string;
        Optional: string;
        Pushpin: string;
        Required: string;
        Title: string;
        Valid: string;
        Value: string;
    }>;
    static readonly CSS = "\n\tcircle.fmm-pushpin {\n\t\tfill: blue;\n\t}\n\tdiv.fmm-detail,\n\tdiv.fmm-popup {\n\t\tbackground-color: darkgray;\n\t\tborder: 1px solid black;\n\t\tbox-shadow: 5px 5px lightgray;\n\t\tpadding-top: 10px;\n\t\tz-index: 1;\n\t}\n\tdiv.fmm-disabled {\n\t\tbackground-color: darkgray;\n\t}\n\tdiv.fmm-disabled,\n\tdiv.fmm-invalid,\n\tdiv.fmm-optional,\n\tdiv.fmm-required,\n\tdiv.fmm-valid {\n\t\tborder: 1px solid transparent;\n\t}\n\tdiv.fmm-frame {\n\t\tbackground-color: white;\n\t}\n\tdiv.fmm-header {\n\t\tborder-bottom: 5px groove;\n\t\tmargin: 0;\n\t}\n\tdiv.fmm-invalid {\n\t\tbackground-color: red;\n\t}\n\tdiv.fmm-optional {\n\t\tborder-color: black;\n\t}\n\tdiv.fmm-required {\n\t\tborder-color: red;\n\t}\n\tdiv.fmm-valid {\n\t\tbackground-color: green;\n\t}\n\tfieldset.fmm-fieldset {\n\t\tbackground-color: white;\n\t\tborder-top: 5px groove;\n\t\tmin-width: 0;\n\t\tpadding: 5px 10px;\n\t}\n\tfieldset.fmm-fieldset div.fmm-disabled,\n\tfieldset.fmm-fieldset div.fmm-invalid,\n\tfieldset.fmm-fieldset div.fmm-optional,\n\tfieldset.fmm-fieldset div.fmm-required,\n\tfieldset.fmm-fieldset div.fmm-valid {\n\t\tborder-width: 2px;\n\t}\n\tlabel.fmm-title {\n\t\tfont-size: smaller;\n\t\tpadding: 2px;\n\t}\n\tlegend.fmm-legend {\n\t\tbackground-color: white;\n\t\tmargin: 5px;\n\t\tmax-width: 100%;\n\t\tpadding-right: 5px;\n\t}\n\ttextarea.fmm-value {\n\t\theight: 3em;\n\t\twidth: 100%;\n\t}\n\tdiv.fmm-detached.fmm-popup,\n\tdiv.fmm-detached div.fmm-detail {\n\t\tbackground-color: lightgray;\n\t}\n\tdiv.fmm-detached.fmm-frame,\n\tdiv.fmm-detached div.fmm-frame,\n\tdiv.fmm-detached fieldset.fmm-fieldset,\n\tiv.fmm-detached legend.fmm-legend {\n\t\tbackground-color: lightgray !important;\n\t}\n\t";
    static readonly STATUS_CLASS: Record<FmmStatus, string>;
    static createMinimap(p: Readonly<FmmMinimapCreateParam>, ef?: FmmElementFactory): FmmMinimap;
    static createPanel(parent: HTMLDivElement, minimapsCount: number, detailParent?: HTMLDivElement, vertical?: boolean, ef?: FmmElementFactory): FmmPanel;
    static trim(s: string): string;
}

export { Fmm, FmmBootstrap4, FmmElementFactory, FmmForm, FmmFormElement, FmmFormElementHTML, FmmFormHTML, FmmFormLayoutHandler, FmmFramework, FmmFrameworkItem, FmmFrameworkItemHTML, FmmMapString, FmmMinimap, FmmMinimapCreateParam, FmmOnUpdate, FmmPanel, FmmRect, FmmSnapshot, FmmSnapshots, FmmStatus, FmmStore, FmmStoreBase, FmmStoreErrors, FmmStoreHTML, FmmStoreImpl, FmmStoreItem, FmmStoreValues };
