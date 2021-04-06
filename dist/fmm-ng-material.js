"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FmmNgMaterial = void 0;
var tslib_1 = require("tslib");
// =================================================================================================================================
//						F M M N G M A T E R I A L
// =================================================================================================================================
exports.FmmNgMaterial = {
    createFrameworkItem: function (_, e) {
        var eTag = e.tagName;
        if (eTag === 'INPUT' && e.classList.contains('mat-autocomplete-trigger'))
            return new FrameworkItemAutoComplete(e);
        return eTag === 'MAT-SELECT' ? new FrameworkItemSelect(e) : new FrameworkItem(e);
    }
};
// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================
// =================================================================================================================================
//						F R A M E W O R K I T E M
// =================================================================================================================================
var FrameworkItem = /** @class */ (function () {
    // =============================================================================================================================
    function FrameworkItem(e) {
        var field = e.parentElement;
        while (field && field.tagName !== 'MAT-FORM-FIELD')
            field = field.parentElement;
        var tag = e;
        while (tag && !tag.tagName.startsWith('MAT-'))
            tag = tag.parentElement;
        if (!field) {
            this.envelope = this.forValidation = tag || e;
        }
        else {
            this.forValidation = field;
            this.envelope = !tag || field.querySelectorAll(tag.tagName).length < 2 ? field : tag || e;
            var labels = field.querySelectorAll('LABEL');
            if (labels.length === 1)
                this.label = labels[0];
        }
    }
    // =============================================================================================================================
    FrameworkItem.prototype.destructor = function () {
        /**/
    };
    // =============================================================================================================================
    FrameworkItem.prototype.getEnvelope = function (_, _e, _l) {
        return this.envelope;
    };
    // =============================================================================================================================
    FrameworkItem.prototype.getError = function (_, _e, _n, _v) {
        var _a;
        return (_a = this.forValidation.querySelector('MAT-ERROR')) === null || _a === void 0 ? void 0 : _a.textContent;
    };
    // =============================================================================================================================
    FrameworkItem.prototype.getLabel = function (_, _e) {
        return this.label;
    };
    // =============================================================================================================================
    FrameworkItem.prototype.getValue = function (_, _e, _n, _l) {
        return undefined;
    };
    return FrameworkItem;
}());
// =================================================================================================================================
//						F R A M E W O R K I T E M A U T O C O M P L E T E
// =================================================================================================================================
var FrameworkItemAutoComplete = /** @class */ (function (_super) {
    tslib_1.__extends(FrameworkItemAutoComplete, _super);
    function FrameworkItemAutoComplete() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =============================================================================================================================
    FrameworkItemAutoComplete.prototype.getValue = function (_, e, _n, _l) {
        return e.value;
    };
    return FrameworkItemAutoComplete;
}(FrameworkItem));
// =================================================================================================================================
//						F R A M E W O R K I T E M S E L E C T
// =================================================================================================================================
var FrameworkItemSelect = /** @class */ (function (_super) {
    tslib_1.__extends(FrameworkItemSelect, _super);
    function FrameworkItemSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =============================================================================================================================
    FrameworkItemSelect.prototype.getValue = function (_, e, _n, _l) {
        var _a;
        return (_a = e.querySelector('.mat-select-value-text')) === null || _a === void 0 ? void 0 : _a.textContent;
    };
    return FrameworkItemSelect;
}(FrameworkItem));
