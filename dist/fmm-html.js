import { FmmStoreBase } from './fmm-store';
export const FmmBootstrap4 = {
    createFrameworkItem(_, e) {
        return e.tagName === 'INPUT' && ['checkbox', 'radio'].includes(e.type) ? G.B4_Check : G.B4_Other;
    }
};
export class FmmFormHTML {
    constructor(form, page) {
        this.form = form;
        this.resizeObserver = new ResizeObserver(this.onFormResize.bind(this));
        this.page = page || form;
        this.resizeObserver.observe(form);
        this.updateLayoutOnScroll = this.updateLayoutOnScroll.bind(this);
        this.page.addEventListener('scroll', this.updateLayoutOnScroll, true);
    }
    clearLayoutHandler() {
        this.resizeObserver.disconnect();
        this.page.removeEventListener('scroll', this.updateLayoutOnScroll, true);
        this.layoutHandler = undefined;
    }
    clipsContentX(e) {
        const { overflow, overflowX } = e.style;
        return FmmFormHTML.CLIP.includes(overflow) || FmmFormHTML.CLIP.includes(overflowX);
    }
    clipsContentY(e) {
        const { overflow, overflowY } = e.style;
        return FmmFormHTML.CLIP.includes(overflow) || FmmFormHTML.CLIP.includes(overflowY);
    }
    getDisplayLabel(e, label) {
        return (label === null || label === void 0 ? void 0 : label.getAttribute('aria-label')) || (label === null || label === void 0 ? void 0 : label.textContent) || e.getAttribute('aria-label') || e.id;
    }
    getDisplayValue(e, label, value) {
        const tag = e.tagName;
        if (tag === 'INPUT') {
            const ie = e;
            if (ie.type === 'checkbox' || ie.type === 'radio')
                return ie.checked ? label : '';
            return ie.type === 'password' ? '*****' : String(value);
        }
        if (tag === 'SELECT') {
            const values = Array.isArray(value) ? value : [value];
            if (!values.length)
                return String(value);
            const options = e.options;
            if (typeof values[0] === 'number')
                return values.map((i) => options[i].text).join('\n');
            const sel = Array.from(options).filter(o => values.includes(o.value));
            return sel.map(o => o.text).join('\n');
        }
        return String(value);
    }
    getElements(customElementIds) {
        const elements = Array.from(this.form.elements);
        if (customElementIds.length)
            elements.push(...Array.from(this.page.querySelectorAll('#' + customElementIds.join(',#'))));
        return elements;
    }
    getLabelFor(e) {
        var _a, _b;
        let label = e.id ? this.page.querySelector('label[for=' + e.id + ']') : undefined;
        if (!label && ((_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.tagName) === 'LABEL')
            label = e.parentElement;
        if (!label && ((_b = e.previousElementSibling) === null || _b === void 0 ? void 0 : _b.tagName) === 'LABEL')
            label = e.previousElementSibling;
        return label;
    }
    getParent(e) {
        return e.parentElement;
    }
    getPlaceholder(e) {
        return e.getAttribute('placeholder') || '';
    }
    getRect(e) {
        return (e || this.page).getBoundingClientRect();
    }
    getStoreKeys(e) {
        const name = e.getAttribute('name');
        return name ? [name, e.id] : [e.id];
    }
    isDisabled(e) {
        if (e.tagName !== 'TEXTAREA')
            return e.disabled;
        const t = e;
        return t.disabled || t.readOnly;
    }
    isHidden(e) {
        return e.hidden;
    }
    setLayoutHandler(handler) {
        this.layoutHandler = handler;
    }
    onFormResize() {
        if (this.layoutHandler)
            this.layoutHandler.handleLayout();
    }
    updateLayoutOnScroll(ev) {
        if (ev.target instanceof HTMLElement && this.layoutHandler)
            this.layoutHandler.handleLayout(ev.target);
    }
}
FmmFormHTML.CLIP = ['auto', 'hidden', 'scroll'];
export class FmmFrameworkItemHTML {
    constructor(wrapperClass) {
        this.wrapperClass = wrapperClass;
        if (!wrapperClass)
            throw new Error('FmmFrameworkItemBase requires wrapperClass');
    }
    destructor() { }
    getEnvelope(_, e, label) {
        let p = e.parentElement;
        while (p && p.tagName !== 'FORM' && !p.classList.contains(this.wrapperClass))
            p = p.parentElement;
        if (p && p.tagName !== 'FORM')
            return p;
        if (!label)
            return undefined;
        p = label.parentElement;
        while (p && p.tagName !== 'FORM' && !p.classList.contains(this.wrapperClass))
            p = p.parentElement;
        return p && p.tagName !== 'FORM' ? p : undefined;
    }
    getError(_, _e, _n, _v) {
        return '';
    }
    getLabel(_, envelope) {
        return (envelope.querySelector('LABEL') || envelope.querySelector('[aria-label]'));
    }
    getValue(_, _e, _n, _l) {
        return '';
    }
}
export class FmmStoreHTML extends FmmStoreBase {
    constructor() {
        super(...arguments);
        this.listener = this.notifyMinimaps.bind(this);
    }
    createStoreItem(_, e) {
        const tag = e.tagName;
        if (tag === 'INPUT') {
            const ie = e;
            return FmmStoreHTML.INPUTTYPES.includes(ie.type) ? new StoreItemInput(ie, this.listener) : undefined;
        }
        if (tag === 'SELECT')
            return new StoreItemSelect(e, this.listener);
        if (tag === 'TEXTAREA')
            return new StoreItemTextArea(e, this.listener);
        return undefined;
    }
    getError(_, i, _hasValue) {
        return i.fe.validationMessage || (i.fe.required && !i.fe.value && 'Required') || '';
    }
    getName(_, i) {
        return i.fe.name;
    }
    getValue(_, i) {
        return i.getValue();
    }
    isDisabled(form, i) {
        return form.isDisabled(i.fe);
    }
}
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
class FrameworkItemB4 extends FmmFrameworkItemHTML {
    constructor(wrapperClass) {
        super(wrapperClass);
    }
    getError(_, e, _n, _v) {
        if (!e.classList.contains('is-invalid'))
            return '';
        for (let s = e.nextElementSibling; s && s !== e; s = s.nextElementSibling) {
            if (s.classList.contains('invalid-feedback'))
                return s.textContent || '';
        }
        return '';
    }
}
const G = {
    B4_Check: new FrameworkItemB4('form-check'),
    B4_Other: new FrameworkItemB4('form-group')
};
class StoreItem {
    constructor(fe, event, listener) {
        this.fe = fe;
        this.event = event;
        this.listener = listener;
        fe.addEventListener(event, listener);
    }
    destructor() {
        this.fe.removeEventListener(this.event, this.listener);
    }
    getValue() {
        return this.fe.value || undefined;
    }
    isDisabled() {
        return this.fe.disabled;
    }
}
class StoreItemInput extends StoreItem {
    constructor(e, listener) {
        super(e, 'input', listener);
    }
}
class StoreItemSelect extends StoreItem {
    constructor(e, listener) {
        super(e, 'change', listener);
        this.e = e;
        this.isMultiple = e.multiple;
    }
    getValue() {
        const index = this.e.selectedIndex;
        if (index < 0)
            return undefined;
        if (!this.isMultiple)
            return [index];
        const indexes = [];
        const options = this.e.options;
        for (let i = options.length; --i >= index;)
            if (options[i].selected)
                indexes.push(i);
        return indexes.reverse();
    }
}
class StoreItemTextArea extends StoreItem {
    constructor(e, listener) {
        super(e, 'input', listener);
        this.e = e;
    }
}
