"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FmmMapStore = exports.FmmFrameworkItemBase = void 0;
// =================================================================================================================================
//						F M M F R A M E W O R K I T E M B A S E
// =================================================================================================================================
var FmmFrameworkItemBase = /** @class */ (function () {
    // =============================================================================================================================
    function FmmFrameworkItemBase(wrapperClass) {
        this.wrapperClass = wrapperClass;
        if (!wrapperClass)
            throw new Error('FmmFrameworkItemBase requires wrapperClass');
    }
    // =============================================================================================================================
    FmmFrameworkItemBase.prototype.destructor = function () {
        /**/
    };
    // =============================================================================================================================
    FmmFrameworkItemBase.prototype.getEnvelope = function (_, e, label) {
        var p = e.parentElement;
        while (p && p.tagName !== 'FORM' && !p.classList.contains(this.wrapperClass))
            p = p.parentElement;
        if (p && p.tagName !== 'FORM')
            return p;
        if (!label)
            return undefined;
        p = label.parentElement;
        while (p && p.tagName !== 'FORM' && !p.classList.contains(this.wrapperClass))
            p = p.parentElement;
        return (p === null || p === void 0 ? void 0 : p.tagName) !== 'FORM' ? p : undefined;
    };
    // =============================================================================================================================
    FmmFrameworkItemBase.prototype.getError = function (_, _e, _n, _v) {
        return undefined;
    };
    // =============================================================================================================================
    FmmFrameworkItemBase.prototype.getLabel = function (_, envelope) {
        return envelope.querySelector('LABEL') || envelope.querySelector('[aria-label]');
    };
    // =============================================================================================================================
    FmmFrameworkItemBase.prototype.getValue = function (_, _e, _n, _l) {
        return undefined;
    };
    return FmmFrameworkItemBase;
}());
exports.FmmFrameworkItemBase = FmmFrameworkItemBase;
// =================================================================================================================================
//						F M M M A P S T O R E
// =================================================================================================================================
var FmmMapStore = /** @class */ (function () {
    // =============================================================================================================================
    function FmmMapStore(values, errors) {
        this.values = values;
        this.errors = errors;
        this.minimaps = new Set();
        this.errors = errors || {};
        this.values = values || {};
    }
    // =============================================================================================================================
    FmmMapStore.prototype.destructor = function () {
        /**/
    };
    // =============================================================================================================================
    FmmMapStore.prototype.createStoreItem = function (e, _) {
        var name = e.getAttribute('name');
        if (name in this.values)
            return new StoreItem(e, this, name);
        if (e.id in this.values)
            return new StoreItem(e, this, e.id);
        return undefined; // ignore everything else
    };
    // =============================================================================================================================
    FmmMapStore.prototype.getError = function (key) {
        var error = this.errors[key];
        if (Array.isArray(error))
            return error.length ? String(error[0]) : undefined;
        return error ? String(error) : undefined;
    };
    // =============================================================================================================================
    FmmMapStore.prototype.getValue = function (key) {
        return this.values[key];
    };
    // =============================================================================================================================
    FmmMapStore.prototype.notifyMinimap = function (minimap, on) {
        if (on)
            this.minimaps.add(minimap);
        else
            this.minimaps.delete(minimap);
    };
    // =============================================================================================================================
    FmmMapStore.prototype.update = function (values, errors) {
        var _this = this;
        this.errors = errors || {};
        this.values = values || {};
        var stale = new Set();
        this.minimaps.forEach(function (m) { return m.takeSnapshot() || stale.add(m); });
        stale.forEach(function (m) { return _this.minimaps.delete(m); });
    };
    return FmmMapStore;
}());
exports.FmmMapStore = FmmMapStore;
// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================
// =================================================================================================================================
//						S T O R E I T E M
// =================================================================================================================================
var StoreItem = /** @class */ (function () {
    // =============================================================================================================================
    function StoreItem(e, f, key) {
        this.e = e;
        this.f = f;
        this.key = key;
    }
    // =============================================================================================================================
    StoreItem.prototype.destructor = function () {
        this.f = undefined;
    };
    // =============================================================================================================================
    StoreItem.prototype.getError = function (_) {
        return this.f.getError(this.key);
    };
    // =============================================================================================================================
    StoreItem.prototype.getName = function () {
        return this.key;
    };
    // =============================================================================================================================
    StoreItem.prototype.getValue = function () {
        return this.f.getValue(this.key);
    };
    // =============================================================================================================================
    StoreItem.prototype.isDisabled = function () {
        return this.e.disabled;
    };
    return StoreItem;
}());
