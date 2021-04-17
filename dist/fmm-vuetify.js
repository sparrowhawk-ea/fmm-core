import { __extends } from "tslib";
// =================================================================================================================================
//						F M M V U E T I F Y
// =================================================================================================================================
export var FmmVuetify = {
    createFrameworkItem: function (_, e) {
        var _a;
        return ((_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.classList.contains('v-select__selections')) ? new FrameworkItemSelect(e) : new FrameworkItem(e);
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
        var isRadio = e.tagName === 'INPUT' && e.type === 'radio';
        var tag = e.parentElement;
        var envelopeClass = isRadio ? 'v-radio' : 'v-input';
        while (tag && !tag.classList.contains(envelopeClass))
            tag = tag.parentElement;
        if (!tag) {
            this.envelope = this.forValidation = e;
        }
        else {
            this.envelope = tag;
            var labels = tag.querySelectorAll('LABEL');
            if (labels.length === 1)
                this.label = labels[0];
            if (isRadio) {
                while (tag && !tag.classList.contains('v-input--radio-group'))
                    tag = tag.parentElement;
            }
            this.forValidation = tag || this.envelope;
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
        return (_a = this.forValidation.querySelector('DIV.v-messages__message')) === null || _a === void 0 ? void 0 : _a.textContent;
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
//						F R A M E W O R K I T E M S E L E C T
// =================================================================================================================================
var FrameworkItemSelect = /** @class */ (function (_super) {
    __extends(FrameworkItemSelect, _super);
    function FrameworkItemSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // =============================================================================================================================
    FrameworkItemSelect.prototype.getValue = function (_, e, _n, _l) {
        return e.parentElement.textContent;
    };
    return FrameworkItemSelect;
}(FrameworkItem));
