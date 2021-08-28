import { FmmForm, FmmFormElement, FmmFormLayoutHandler, FmmFramework, FmmFrameworkItem, FmmRect, FmmStore, FmmStoreItem } from './fmm';
import { FmmStoreBase } from './fmm-store';
export declare const FmmBootstrap4: FmmFramework;
export interface FmmFormElementHTML extends FmmFormElement, HTMLElement {
}
export declare class FmmFormHTML implements FmmForm {
    private readonly form;
    private readonly page?;
    private static readonly CLIP;
    private readonly resizeObserver;
    private layoutHandler;
    constructor(form: HTMLFormElement, page?: HTMLElement);
    clearLayoutHandler(): void;
    clipsContentX(e: FmmFormElementHTML): boolean;
    clipsContentY(e: FmmFormElementHTML): boolean;
    getDisplayLabel(e: FmmFormElementHTML, label: FmmFormElementHTML): string;
    getDisplayValue(e: FmmFormElementHTML, label: string, value: unknown): string;
    getElements(customElementIds: string[]): FmmFormElementHTML[];
    getLabelFor(e: FmmFormElementHTML): FmmFormElementHTML;
    getParent(e: FmmFormElementHTML): FmmFormElementHTML;
    getPlaceholder(e: FmmFormElementHTML): string;
    getRect(e?: FmmFormElementHTML): Readonly<FmmRect>;
    getStoreKeys(e: FmmFormElementHTML): string[];
    isDisabled(e: FmmFormElementHTML): boolean;
    isHidden(e: FmmFormElementHTML): boolean;
    setLayoutHandler(handler: FmmFormLayoutHandler): void;
    private onFormResize;
    private updateLayoutOnScroll;
}
export declare class FmmFrameworkItemHTML implements FmmFrameworkItem {
    protected readonly wrapperClass: string;
    constructor(wrapperClass: string);
    destructor(): void;
    getEnvelope(_: string, e: FmmFormElementHTML, label: FmmFormElementHTML): FmmFormElementHTML;
    getError(_: string, _e: FmmFormElementHTML, _n: FmmFormElementHTML, _v: boolean): string;
    getLabel(_: string, envelope: FmmFormElementHTML): FmmFormElementHTML;
    getValue(_: string, _e: FmmFormElementHTML, _n: FmmFormElementHTML, _l: string): string;
}
export declare class FmmStoreHTML extends FmmStoreBase implements FmmStore {
    private static readonly INPUTTYPES;
    private readonly listener;
    createStoreItem(_: FmmForm, e: FmmFormElementHTML): FmmStoreItem;
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
export {};
