import { FmmFrameworkItem, FmmStoreErrors, FmmStoreValues, FmmMinimap, FmmStore, FmmStoreItem } from './fmm';
export declare class FmmFrameworkItemBase implements FmmFrameworkItem {
    protected readonly wrapperClass: string;
    constructor(wrapperClass: string);
    destructor(): void;
    getEnvelope(_: string, e: HTMLElement, label: HTMLElement): HTMLElement;
    getError(_: string, _e: HTMLElement, _n: HTMLElement, _v: boolean): string;
    getLabel(_: string, envelope: HTMLElement): HTMLElement;
    getValue(_: string, _e: HTMLElement, _n: HTMLElement, _l: string): string;
}
export declare class FmmStoreImpl<TV extends FmmStoreValues, TE extends FmmStoreErrors> implements FmmStore {
    private values;
    private errors?;
    private readonly minimaps;
    constructor(values: TV, errors?: TE);
    destructor(): void;
    createStoreItem(e: HTMLElement, _: () => FmmStoreItem): FmmStoreItem;
    getError(key: string): string;
    getValue(key: string): unknown;
    notifyMinimap(minimap: FmmMinimap, on: boolean): void;
    update(values: TV, errors?: TE): void;
}
