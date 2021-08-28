import { __extends } from "tslib";
import { FmmStoreBase } from './fmm-store';
// =================================================================================================================================
//						F M M B O O T S T R A P 4
// =================================================================================================================================
export var FmmBootstrap4 = {
    createFrameworkItem: function (_, e) {
        return e.tagName === 'INPUT' && ['checkbox', 'radio'].includes(e.type) ? G.B4_Check : G.B4_Other;
    }
};
// =================================================================================================================================
//						F M M F O R M H T M L
// =================================================================================================================================
var FmmFormHTML = /** @class */ (function () {
    // =============================================================================================================================
    function FmmFormHTML(form, page) {
        this.form = form;
        this.page = page;
        this.resizeObserver = new ResizeObserver(this.onFormResize.bind(this));
        this.page = page || form;
        this.resizeObserver.observe(form);
        this.updateLayoutOnScroll = this.updateLayoutOnScroll.bind(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        page.addEventListener('scroll', this.updateLayoutOnScroll, true);
    }
    // =============================================================================================================================
    FmmFormHTML.prototype.clearLayoutHandler = function () {
        this.resizeObserver.disconnect();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.page.removeEventListener('scroll', this.updateLayoutOnScroll, true);
        this.layoutHandler = undefined;
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.clipsContentX = function (e) {
        var _a = e.style, overflow = _a.overflow, overflowX = _a.overflowX;
        return FmmFormHTML.CLIP.includes(overflow) || FmmFormHTML.CLIP.includes(overflowX);
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.clipsContentY = function (e) {
        var _a = e.style, overflow = _a.overflow, overflowY = _a.overflowY;
        return FmmFormHTML.CLIP.includes(overflow) || FmmFormHTML.CLIP.includes(overflowY);
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.getDisplayLabel = function (e, label) {
        return (label === null || label === void 0 ? void 0 : label.getAttribute('aria-label')) || (label === null || label === void 0 ? void 0 : label.textContent) || e.getAttribute('aria-label') || e.id;
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.getDisplayValue = function (e, label, value) {
        var tag = e.tagName;
        if (tag === 'INPUT') {
            var ie = e;
            if (ie.type === 'checkbox' || ie.type === 'radio')
                return ie.checked ? label : undefined;
            return ie.type === 'password' ? '*****' : String(value);
        }
        if (tag === 'SELECT') {
            var values_1 = Array.isArray(value) ? value : [value];
            if (!values_1.length)
                return String(value);
            var options_1 = e.options;
            if (typeof values_1[0] === 'number')
                return values_1.map(function (i) { return options_1[i].text; }).join('\n');
            var sel = Array.from(options_1).filter(function (o) { return values_1.includes(o.value); });
            return sel.map(function (o) { return o.text; }).join('\n');
        }
        return String(value);
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.getElements = function (customElementIds) {
        var elements = Array.from(this.form.elements);
        if (customElementIds.length)
            elements.push.apply(elements, Array.from(this.page.querySelectorAll('#' + customElementIds.join(',#'))));
        return elements;
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.getLabelFor = function (e) {
        var _a, _b;
        var label = e.id ? this.page.querySelector('label[for=' + e.id + ']') : undefined;
        if (!label && ((_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.tagName) === 'LABEL')
            label = e.parentElement;
        if (!label && ((_b = e.previousElementSibling) === null || _b === void 0 ? void 0 : _b.tagName) === 'LABEL')
            label = e.previousElementSibling;
        return label;
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.getParent = function (e) {
        return e.parentElement;
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.getPlaceholder = function (e) {
        return e.getAttribute('placeholder');
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.getRect = function (e) {
        return (e || this.page).getBoundingClientRect();
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.getStoreKeys = function (e) {
        return [e.getAttribute('name'), e.id];
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.isDisabled = function (e) {
        if (e.tagName !== 'TEXTAREA')
            return e.disabled;
        var t = e;
        return t.disabled || t.readOnly;
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.isHidden = function (e) {
        return e.hidden;
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.setLayoutHandler = function (handler) {
        this.layoutHandler = handler;
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.onFormResize = function () {
        if (this.layoutHandler)
            this.layoutHandler.handleLayout(undefined);
    };
    // =============================================================================================================================
    FmmFormHTML.prototype.updateLayoutOnScroll = function (ev) {
        if (ev.target instanceof HTMLElement && this.layoutHandler)
            this.layoutHandler.handleLayout(ev.target);
    };
    FmmFormHTML.CLIP = ['auto', 'hidden', 'scroll'];
    return FmmFormHTML;
}());
export { FmmFormHTML };
// =================================================================================================================================
//						F M M F R A M E W O R K I T E M H T M L
// =================================================================================================================================
var FmmFrameworkItemHTML = /** @class */ (function () {
    // =============================================================================================================================
    function FmmFrameworkItemHTML(wrapperClass) {
        this.wrapperClass = wrapperClass;
        if (!wrapperClass)
            throw new Error('FmmFrameworkItemBase requires wrapperClass');
    }
    // =============================================================================================================================
    FmmFrameworkItemHTML.prototype.destructor = function () { };
    // =============================================================================================================================
    FmmFrameworkItemHTML.prototype.getEnvelope = function (_, e, label) {
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
    FmmFrameworkItemHTML.prototype.getError = function (_, _e, _n, _v) {
        return undefined;
    };
    // =============================================================================================================================
    FmmFrameworkItemHTML.prototype.getLabel = function (_, envelope) {
        return envelope.querySelector('LABEL') || envelope.querySelector('[aria-label]');
    };
    // =============================================================================================================================
    FmmFrameworkItemHTML.prototype.getValue = function (_, _e, _n, _l) {
        return undefined;
    };
    return FmmFrameworkItemHTML;
}());
export { FmmFrameworkItemHTML };
// =================================================================================================================================
//						F M M S T O R E H T M L
// =================================================================================================================================
var FmmStoreHTML = /** @class */ (function (_super) {
    __extends(FmmStoreHTML, _super);
    function FmmStoreHTML() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.listener = _this.notifyMinimaps.bind(_this);
        return _this;
    }
    // =============================================================================================================================
    FmmStoreHTML.prototype.createStoreItem = function (_, e) {
        var tag = e.tagName;
        if (tag === 'INPUT') {
            var ie = e;
            return FmmStoreHTML.INPUTTYPES.includes(ie.type) ? new StoreItemInput(ie, this.listener) : undefined;
        }
        if (tag === 'SELECT')
            return new StoreItemSelect(e, this.listener);
        if (tag === 'TEXTAREA')
            return new StoreItemTextArea(e, this.listener);
        return undefined;
    };
    // =============================================================================================================================
    FmmStoreHTML.prototype.getError = function (_, i, _hasValue) {
        return i.fe.validationMessage || (i.fe.required && !i.fe.value && 'Required') || undefined;
    };
    // =============================================================================================================================
    FmmStoreHTML.prototype.getName = function (_, i) {
        return i.fe.name;
    };
    // =============================================================================================================================
    FmmStoreHTML.prototype.getValue = function (_, i) {
        return i.getValue();
    };
    // =============================================================================================================================
    FmmStoreHTML.prototype.isDisabled = function (form, i) {
        return form.isDisabled(i.fe);
    };
    FmmStoreHTML.INPUTTYPES = [
        'checkbox',
        'color',
        'date',
        'datetime',
        'datetime-local',
        'email',
        'month',
        'number',
        'password',
        'radio',
        'range',
        'search',
        'tel',
        'text',
        'time',
        'url',
        'week'
    ];
    return FmmStoreHTML;
}(FmmStoreBase));
export { FmmStoreHTML };
// =================================================================================================================================
// =================================================================================================================================
// =================================================	P R I V A T E	============================================================
// =================================================================================================================================
// =================================================================================================================================
// =================================================================================================================================
//						F R A M E W O R K I T E M B 4
// =================================================================================================================================
var FrameworkItemB4 = /** @class */ (function (_super) {
    __extends(FrameworkItemB4, _super);
    // =============================================================================================================================
    function FrameworkItemB4(wrapperClass) {
        return _super.call(this, wrapperClass) || this;
    }
    // =============================================================================================================================
    FrameworkItemB4.prototype.getError = function (_, e, _n, _v) {
        if (!e.classList.contains('is-invalid') /* && !e.matches(':invalid')*/)
            return undefined;
        for (var s = e.nextElementSibling; s && s !== e; s = s.nextElementSibling) {
            if (s.classList.contains('invalid-feedback'))
                return s.textContent;
        }
        return undefined;
    };
    return FrameworkItemB4;
}(FmmFrameworkItemHTML));
// =================================================================================================================================
//						G
// =================================================================================================================================
var G = {
    B4_Check: new FrameworkItemB4('form-check'),
    B4_Other: new FrameworkItemB4('form-group')
};
// =================================================================================================================================
//						S T O R E I T E M
// =================================================================================================================================
var StoreItem = /** @class */ (function () {
    // =============================================================================================================================
    function StoreItem(fe, event, listener) {
        this.fe = fe;
        this.event = event;
        this.listener = listener;
        fe.addEventListener(event, listener);
    }
    // =============================================================================================================================
    StoreItem.prototype.destructor = function () {
        this.fe.removeEventListener(this.event, this.listener);
    };
    // =============================================================================================================================
    StoreItem.prototype.getValue = function () {
        return this.fe.value || undefined;
    };
    // =============================================================================================================================
    StoreItem.prototype.isDisabled = function () {
        return this.fe.disabled;
    };
    return StoreItem;
}());
// =================================================================================================================================
//						S T O R E I T E M I N P U T
// =================================================================================================================================
var StoreItemInput = /** @class */ (function (_super) {
    __extends(StoreItemInput, _super);
    // =============================================================================================================================
    function StoreItemInput(e, listener) {
        return _super.call(this, e, 'input', listener) || this;
    }
    return StoreItemInput;
}(StoreItem));
// =================================================================================================================================
//						S T O R E I T E M S E L E C T
// =================================================================================================================================
var StoreItemSelect = /** @class */ (function (_super) {
    __extends(StoreItemSelect, _super);
    // =============================================================================================================================
    function StoreItemSelect(e, listener) {
        var _this = _super.call(this, e, 'change', listener) || this;
        _this.e = e;
        _this.isMultiple = e.multiple;
        return _this;
    }
    // =============================================================================================================================
    StoreItemSelect.prototype.getValue = function () {
        var index = this.e.selectedIndex;
        if (index < 0)
            return undefined;
        if (!this.isMultiple)
            return [index];
        var indexes = [];
        var options = this.e.options;
        for (var i = options.length; --i >= index;)
            if (options[i].selected)
                indexes.push(i);
        return indexes.reverse();
    };
    return StoreItemSelect;
}(StoreItem));
// =================================================================================================================================
//						S T O R E I T E M T E X T A R E A
// =================================================================================================================================
var StoreItemTextArea = /** @class */ (function (_super) {
    __extends(StoreItemTextArea, _super);
    // =============================================================================================================================
    function StoreItemTextArea(e, listener) {
        var _this = _super.call(this, e, 'input', listener) || this;
        _this.e = e;
        return _this;
    }
    return StoreItemTextArea;
}(StoreItem));
