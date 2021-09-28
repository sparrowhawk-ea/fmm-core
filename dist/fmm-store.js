export class FmmStoreBase {
    constructor() {
        this.minimaps = new Set();
    }
    notifyMinimapOnUpdate(minimap, on) {
        if (on)
            this.minimaps.add(minimap);
        else
            this.minimaps.delete(minimap);
    }
    notifyMinimaps() {
        const stale = new Set();
        this.minimaps.forEach(m => m.takeSnapshot() || stale.add(m));
        stale.forEach(m => this.minimaps.delete(m));
    }
}
export class FmmStoreImpl extends FmmStoreBase {
    constructor(values, errors) {
        super();
        this.values = values;
        this.errors = errors || {};
        this.values = values || {};
    }
    createStoreItem(form, e) {
        for (const key of form.getStoreKeys(e))
            if (key && key in this.values)
                return new StoreItem(e, key);
        return undefined;
    }
    getError(_, item, _hasValue) {
        const error = this.errors[item.key];
        if (Array.isArray(error))
            return error.length ? String(error[0]) : '';
        return error ? String(error) : '';
    }
    getName(_, item) {
        return item.key;
    }
    getValue(_, item) {
        return this.values[item.key];
    }
    isDisabled(form, item) {
        return form.isDisabled(item.e);
    }
    update(values, errors) {
        this.errors = errors || {};
        this.values = values || {};
        super.notifyMinimaps();
    }
}
class StoreItem {
    constructor(e, key) {
        this.e = e;
        this.key = key;
    }
    destructor() { }
}
