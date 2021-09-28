import { FmmForm, FmmFormElement, FmmMinimap, FmmStoreErrors, FmmStoreValues, FmmStore, FmmStoreItem } from './fmm';
export declare abstract class FmmStoreBase {
    private readonly minimaps;
    notifyMinimapOnUpdate(minimap: FmmMinimap, on: boolean): void;
    protected notifyMinimaps(): void;
}
export declare class FmmStoreImpl<TV extends FmmStoreValues, TE extends FmmStoreErrors> extends FmmStoreBase implements FmmStore {
    private values;
    private errors;
    constructor(values: TV, errors?: TE);
    createStoreItem(form: FmmForm, e: FmmFormElement): FmmStoreItem | undefined;
    getError(_: FmmForm, item: StoreItem, _hasValue: boolean): string;
    getName(_: FmmForm, item: StoreItem): string;
    getValue(_: FmmForm, item: StoreItem): unknown;
    isDisabled(form: FmmForm, item: StoreItem): boolean;
    update(values: TV, errors?: TE): void;
}
declare class StoreItem implements FmmStoreItem {
    readonly e: FmmFormElement;
    readonly key: string;
    constructor(e: FmmFormElement, key: string);
    destructor(): void;
}
export {};
