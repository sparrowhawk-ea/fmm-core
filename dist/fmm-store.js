import { __extends } from "tslib";
// =================================================================================================================================
//						F M M S T O R E B A S E
// =================================================================================================================================
var FmmStoreBase = /** @class */ (function () {
    function FmmStoreBase() {
        this.minimaps = new Set();
    }
    // =============================================================================================================================
    FmmStoreBase.prototype.notifyMinimapOnUpdate = function (minimap, on) {
        if (on)
            this.minimaps.add(minimap);
        else
            this.minimaps.delete(minimap);
    };
    // =============================================================================================================================
    FmmStoreBase.prototype.notifyMinimaps = function () {
        var _this = this;
        var stale = new Set();
        this.minimaps.forEach(function (m) { return m.takeSnapshot() || stale.add(m); });
        stale.forEach(function (m) { return _this.minimaps.delete(m); });
    };
    return FmmStoreBase;
}());
export { FmmStoreBase };
// =================================================================================================================================
//						F M M S T O R E I M P L
// =================================================================================================================================
var FmmStoreImpl = /** @class */ (function (_super) {
    __extends(FmmStoreImpl, _super);
    // =============================================================================================================================
    function FmmStoreImpl(values, errors) {
        var _this = _super.call(this) || this;
        _this.values = values;
        _this.errors = errors;
        _this.errors = errors || {};
        _this.values = values || {};
        return _this;
    }
    // =============================================================================================================================
    FmmStoreImpl.prototype.createStoreItem = function (form, e) {
        var key = form.findKeyInObject(e, this.values);
        return key ? new StoreItem(e, key) : undefined;
    };
    // =============================================================================================================================
    FmmStoreImpl.prototype.getError = function (_, item, _hasValue) {
        var error = this.errors[item.key];
        if (Array.isArray(error))
            return error.length ? String(error[0]) : undefined;
        return error ? String(error) : undefined;
    };
    // =============================================================================================================================
    FmmStoreImpl.prototype.getName = function (_, item) {
        return item.key;
    };
    // =============================================================================================================================
    FmmStoreImpl.prototype.getValue = function (_, item) {
        return this.values[item.key];
    };
    // =============================================================================================================================
    FmmStoreImpl.prototype.isDisabled = function (form, item) {
        return form.isDisabled(item.e);
    };
    // =============================================================================================================================
    FmmStoreImpl.prototype.update = function (values, errors) {
        this.errors = errors || {};
        this.values = values || {};
        _super.prototype.notifyMinimaps.call(this);
    };
    return FmmStoreImpl;
}(FmmStoreBase));
export { FmmStoreImpl };
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
    function StoreItem(e, key) {
        this.e = e;
        this.key = key;
    }
    // =============================================================================================================================
    StoreItem.prototype.destructor = function () { };
    return StoreItem;
}());
