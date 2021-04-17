import { __extends } from "tslib";
import { FmmFrameworkItemBase } from './fmm-utils';
// =================================================================================================================================
//						F M M M A T E R I A L U I
// =================================================================================================================================
export var FmmMaterialUI = {
    createFrameworkItem: function (_, e) {
        if (e.tagName === 'INPUT') {
            var type = e.type;
            if (type === 'checkbox' || type === 'radio')
                return G.Check;
        }
        return e.classList.contains('MuiSelect-nativeInput') ? G.Select : G.Other;
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
var FrameworkItem = /** @class */ (function (_super) {
    __extends(FrameworkItem, _super);
    // =============================================================================================================================
    function FrameworkItem(wrapperClass) {
        return _super.call(this, wrapperClass || 'MuiFormControl-root') || this;
    }
    // =============================================================================================================================
    FrameworkItem.prototype.getError = function (_, _e, envelope, _v) {
        var _a;
        return (_a = envelope === null || envelope === void 0 ? void 0 : envelope.querySelector('.MuiFormHelperText-root')) === null || _a === void 0 ? void 0 : _a.textContent;
    };
    return FrameworkItem;
}(FmmFrameworkItemBase));
// =================================================================================================================================
//						F R A M E W O R K I T E M C H E C K
// =================================================================================================================================
var FrameworkItemCheck = /** @class */ (function (_super) {
    __extends(FrameworkItemCheck, _super);
    // =============================================================================================================================
    function FrameworkItemCheck() {
        return _super.call(this, 'MuiFormControlLabel-root') || this;
    }
    // =============================================================================================================================
    FrameworkItemCheck.prototype.getLabel = function (_, envelope) {
        return envelope === null || envelope === void 0 ? void 0 : envelope.querySelector('SPAN.MuiFormControlLabel-label');
    };
    return FrameworkItemCheck;
}(FrameworkItem));
// =================================================================================================================================
//						F R A M E W O R K I T E M S E L E C T
// =================================================================================================================================
var FrameworkItemSelect = /** @class */ (function (_super) {
    __extends(FrameworkItemSelect, _super);
    function FrameworkItemSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =============================================================================================================================
    FrameworkItemSelect.prototype.getValue = function (name, e, _n, _l) {
        var _a;
        return (_a = e.parentElement.querySelector('#mui-component-select-' + name)) === null || _a === void 0 ? void 0 : _a.textContent;
    };
    return FrameworkItemSelect;
}(FrameworkItem));
// =================================================================================================================================
//						G
// =================================================================================================================================
var G = {
    Check: new FrameworkItemCheck(),
    Select: new FrameworkItemSelect(),
    Other: new FrameworkItem()
};
