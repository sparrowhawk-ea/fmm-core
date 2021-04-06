"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fmm = void 0;
var tslib_1 = require("tslib");
// =================================================================================================================================
//						F M M
// =================================================================================================================================
var Fmm = /** @class */ (function () {
    function Fmm() {
    }
    // =============================================================================================================================
    Fmm.createPanel = function (ef, parent, detailParent, vertical) {
        var err = 'FmmPanel not created: invalid ';
        if (!(parent instanceof HTMLElement))
            throw new Error(err + 'parent');
        if (detailParent && !(detailParent instanceof HTMLElement))
            throw new Error(err + 'detailParent');
        return new Panel(ef, parent, detailParent, vertical);
    };
    // =============================================================================================================================
    Fmm.trim = function (s) {
        return s === null || s === void 0 ? void 0 : s.trim().replace(/\u200B/g, '');
    };
    // =============================================================================================================================
    Fmm.CLASS = Object.freeze({
        Detached: 'fmm-detached',
        DetailPopup: 'fmm-detail',
        Disabled: 'fmm-disabled',
        Error: 'fmm-error',
        Fieldset: 'fmm-fieldset',
        Header: 'fmm-header',
        Invalid: 'fmm-invalid',
        Legend: 'fmm-legend',
        MinimapFrame: 'fmm-frame',
        MinimapPopup: 'fmm-popup',
        Optional: 'fmm-optional',
        Pushpin: 'fmm-pushpin',
        Required: 'fmm-required',
        Title: 'fmm-title',
        Valid: 'fmm-valid',
        Value: 'fmm-value'
    });
    // =============================================================================================================================
    Fmm.CSS = "\n\tcircle.fmm-pushpin {\n\t\tfill: blue;\n\t}\n\tdiv.fmm-detail,\n\tdiv.fmm-popup {\n\t\tbackground-color: darkgray;\n\t\tborder: 1px solid black;\n\t\tbox-shadow: 5px 5px lightgray;\n\t\tpadding-top: 10px;\n\t\tz-index: 1;\n\t}\n\tdiv.fmm-disabled {\n\t\tbackground-color: darkgray;\n\t}\n\tdiv.fmm-disabled,\n\tdiv.fmm-invalid,\n\tdiv.fmm-optional,\n\tdiv.fmm-required,\n\tdiv.fmm-valid {\n\t\tborder: 1px solid transparent;\n\t}\n\tdiv.fmm-frame {\n\t\tbackground-color: white;\n\t}\n\tdiv.fmm-header {\n\t\tborder-bottom: 5px groove;\n\t\tmargin: 0;\n\t}\n\tdiv.fmm-invalid {\n\t\tbackground-color: red;\n\t}\n\tdiv.fmm-optional {\n\t\tborder-color: black;\n\t}\n\tdiv.fmm-required {\n\t\tborder-color: red;\n\t}\n\tdiv.fmm-valid {\n\t\tbackground-color: green;\n\t}\n\tfieldset.fmm-fieldset {\n\t\tbackground-color: white;\n\t\tborder-top: 5px groove;\n\t\tmin-width: 0;\n\t\tpadding: 5px 10px;\n\t}\n\tfieldset.fmm-fieldset div.fmm-disabled,\n\tfieldset.fmm-fieldset div.fmm-invalid,\n\tfieldset.fmm-fieldset div.fmm-optional,\n\tfieldset.fmm-fieldset div.fmm-required,\n\tfieldset.fmm-fieldset div.fmm-valid {\n\t\tborder-width: 2px;\n\t}\n\tlabel.fmm-title {\n\t\tfont-size: smaller;\n\t\tpadding: 2px;\n\t}\n\tlegend.fmm-legend {\n\t\tbackground-color: white;\n\t\tmargin: 5px;\n\t\tmax-width: 100%;\n\t\tpadding-right: 5px;\n\t}\n\ttextarea.fmm-value {\n\t\theight: 3em;\n\t\twidth: 100%;\n\t}\n\tdiv.fmm-detached.fmm-popup,\n\tdiv.fmm-detached div.fmm-detail {\n\t\tbackground-color: lightgray;\n\t}\n\tdiv.fmm-detached.fmm-frame,\n\tdiv.fmm-detached div.fmm-frame,\n\tdiv.fmm-detached fieldset.fmm-fieldset,\n\tiv.fmm-detached legend.fmm-legend {\n\t\tbackground-color: lightgray !important;\n\t}\n\t";
    // =============================================================================================================================
    Fmm.STATUS = Object.freeze({
        Disabled: 'fmm-disabled',
        Invalid: 'fmm-invalid',
        Optional: 'fmm-optional',
        Required: 'fmm-required',
        Valid: 'fmm-valid'
    });
    return Fmm;
}());
exports.Fmm = Fmm;
// =================================================================================================================================
//						C L I P C O N T E X T
// =================================================================================================================================
var ClipContext = /** @class */ (function () {
    // =============================================================================================================================
    function ClipContext(e, parent) {
        this.parent = parent;
        var _a = e.style, overflow = _a.overflow, overflowX = _a.overflowX, overflowY = _a.overflowY;
        this.clipX = ClipContext.CLIP.includes(overflow) || ClipContext.CLIP.includes(overflowX);
        this.clipY = ClipContext.CLIP.includes(overflow) || ClipContext.CLIP.includes(overflowY);
        this.rect = (parent === null || parent === void 0 ? void 0 : parent.clipRect(e.getBoundingClientRect())) || e.getBoundingClientRect();
    }
    // =============================================================================================================================
    ClipContext.prototype.clipRect = function (rect) {
        var left = Math.max(rect.left, this.rect.left);
        var top = Math.max(rect.top, this.rect.top);
        var width = Math.max(0, (this.clipX ? Math.min(rect.right, this.rect.right) : rect.right) - left);
        var height = Math.max(0, (this.clipY ? Math.min(rect.bottom, this.rect.bottom) : rect.bottom) - top);
        var clipped = new DOMRectReadOnly(left, top, width, height);
        return width && height && this.parent ? this.parent.clipRect(clipped) : clipped;
    };
    ClipContext.CLIP = ['auto', 'hidden', 'scroll'];
    return ClipContext;
}());
// =================================================================================================================================
//						D E B O U N C E R
// =================================================================================================================================
var Debouncer = /** @class */ (function () {
    // =============================================================================================================================
    function Debouncer(task, debounceMsec) {
        this.task = task;
        this.debounceMsec = debounceMsec;
        this._doTask = this.doTask.bind(this);
    }
    // =============================================================================================================================
    Debouncer.prototype.destructor = function () {
        if (!this.task)
            return;
        if (this.timer)
            window.clearTimeout(this.timer);
        this.timer = undefined;
        this.task = undefined;
    };
    // =============================================================================================================================
    Debouncer.prototype.cancel = function () {
        if (!this.timer)
            return false;
        window.clearTimeout(this.timer);
        this.timer = undefined;
        return true;
    };
    // =============================================================================================================================
    Debouncer.prototype.doNow = function () {
        if (!this.task)
            return;
        this.cancel();
        this.task();
    };
    // =============================================================================================================================
    Debouncer.prototype.schedule = function () {
        if (!this.task)
            return;
        this.notBeforeMsec = Date.now() + this.debounceMsec;
        if (!this.timer)
            this.timer = window.setTimeout(this._doTask, this.debounceMsec);
    };
    // =============================================================================================================================
    Debouncer.prototype.doTask = function () {
        var tooEarlyMsec = this.notBeforeMsec - Date.now();
        if (tooEarlyMsec > 0) {
            this.timer = window.setTimeout(this._doTask, tooEarlyMsec);
        }
        else {
            this.timer = undefined;
            this.task();
        }
    };
    return Debouncer;
}());
// =================================================================================================================================
//						D E T A I L
// =================================================================================================================================
var Detail = /** @class */ (function () {
    // =============================================================================================================================
    function Detail(ef, parent) {
        this.data = Snapshot.NULLDATA;
        this.values = [];
        var fieldset = (this.e = ef.createElement('FIELDSET'));
        fieldset.className = Fmm.CLASS.Fieldset;
        var legend = G.ELLIPSIS(ef.createElement('LEGEND'));
        legend.className = Fmm.CLASS.Legend;
        this.status = legend.appendChild(ef.createElement('DIV'));
        this.status.style.display = 'inline-block';
        this.status.style.margin = '3px 6px 0 3px';
        this.status.style.height = '0.7em';
        this.status.style.width = '1em';
        this.label = legend.appendChild(ef.createElement('SPAN'));
        this.label.textContent = G.NBSP;
        fieldset.appendChild(legend);
        this.value = fieldset.appendChild(ef.createElement('TEXTAREA'));
        this.value.className = Fmm.CLASS.Value;
        this.value.readOnly = true;
        this.error = G.ELLIPSIS(fieldset.appendChild(ef.createElement('DIV')));
        this.error.className = Fmm.CLASS.Error;
        this.error.textContent = G.NBSP;
        if (parent)
            parent.appendChild(fieldset);
    }
    // =============================================================================================================================
    Detail.prototype.destructor = function () {
        if (this.e.parentElement)
            this.e.parentElement.removeChild(this.e);
    };
    // =============================================================================================================================
    Detail.prototype.clear = function (onlyIfShowingThisData) {
        if (onlyIfShowingThisData && onlyIfShowingThisData !== this.data)
            return;
        this.error.textContent = this.label.textContent = G.NBSP;
        this.status.className = this.value.placeholder = this.value.value = '';
        this.data = Snapshot.NULLDATA;
        this.values = [];
    };
    // =============================================================================================================================
    Detail.prototype.refreshDisplay = function (minimapId) {
        var _a, _b;
        if (minimapId !== this.minimapId)
            return;
        var labelPrefix = ((_a = this.data.aggregateLabel) === null || _a === void 0 ? void 0 : _a.concat(': ')) || '';
        this.error.textContent = this.error.title = this.data.error || G.NBSP;
        this.label.textContent = this.label.title = labelPrefix + this.data.label || G.NBSP;
        this.status.className = this.data.status;
        this.value.placeholder = this.data.placeholder || '';
        this.value.value = (_b = this.values) === null || _b === void 0 ? void 0 : _b.join('\n');
    };
    // =============================================================================================================================
    Detail.prototype.setDisplay = function (minimapId, newData, values) {
        this.values = values || [];
        this.data = newData || Snapshot.NULLDATA;
        this.refreshDisplay((this.minimapId = minimapId));
    };
    return Detail;
}());
// =================================================================================================================================
//						F O R M S T O R E I T E M
// =================================================================================================================================
var FormStoreItem = /** @class */ (function () {
    // =============================================================================================================================
    function FormStoreItem(e, store, p) {
        var _this = this;
        var _a, _b, _c, _d;
        this.e = e;
        this.store = store;
        var label = e.id ? p.page.querySelector('label[for=' + e.id + ']') : undefined;
        if (!label && ((_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.tagName) === 'LABEL')
            label = e.parentElement;
        if (!label && ((_b = e.previousElementSibling) === null || _b === void 0 ? void 0 : _b.tagName) === 'LABEL')
            label = e.previousElementSibling;
        var name = store.getName() || FormStoreItem.NAMEPREFIX + String(p.nameCounter++);
        if (!(name in p.values))
            p.values[name] = [];
        var widget;
        this.widget = ((_c = p.widgetFactories) === null || _c === void 0 ? void 0 : _c.find(function (f) { return (widget = f.createWidget(name, e)); })) ? widget : FormStoreItem.DEFAULTWIDGET;
        this.dynamicLabel = p.dynamicLabels.includes(name);
        this.framework = ((_d = p.framework) === null || _d === void 0 ? void 0 : _d.createFrameworkItem(name, e)) || FormStoreItem.DEFAULTFRAMEWORK;
        this.envelope = this.framework.getEnvelope(name, e, label) || this.getCommonAncestor(e, label);
        this.label = label || this.framework.getLabel(name, this.envelope);
        this.snapshot = new Snapshot(p.aggregateLabels[name], name, p.ef, p.snapshotsPanel, p.snapshotUpcall);
        this.destructor = function () {
            _this.framework.destructor();
            store.destructor();
            _this.widget.destructor();
        };
    }
    // =============================================================================================================================
    FormStoreItem.prototype.destructor = function () {
        // function body overwritten in constructor
    };
    // =============================================================================================================================
    FormStoreItem.prototype.layoutSnapshot = function (p, pageRect, scale) {
        var parent = this.envelope.parentElement;
        var clipContext = p.ancestors.get(parent) || this.getClipContext(parent, p.ancestors);
        var rect = clipContext.clipRect(this.envelope.getBoundingClientRect());
        if (!rect.width || !rect.height)
            return this.snapshot.setRect(undefined, p.snapshotUpcall);
        var left = Math.floor((rect.left - pageRect.left) * scale);
        var top = Math.floor((rect.top - pageRect.top) * scale);
        var height = Math.max(2, Math.floor(rect.height * scale));
        var width = Math.max(2, Math.floor(rect.width * scale));
        return this.snapshot.setRect(new DOMRectReadOnly(left, top, width, height), p.snapshotUpcall);
    };
    // =============================================================================================================================
    FormStoreItem.prototype.removeIfDetached = function () {
        if (this.envelope.parentElement && this.envelope.contains(this.e))
            return false;
        this.snapshot.destructor();
        this.destructor();
        return true;
    };
    // =============================================================================================================================
    FormStoreItem.prototype.takeSnapshot = function (values) {
        var _a, _b;
        var data = this.snapshot.data;
        if (data.label === undefined || this.dynamicLabel) {
            var label = ((_a = this.label) === null || _a === void 0 ? void 0 : _a.getAttribute('aria-label')) || ((_b = this.label) === null || _b === void 0 ? void 0 : _b.textContent) || this.e.getAttribute('aria-label');
            data.label = Fmm.trim(label);
            data.placeholder = Fmm.trim(this.e.getAttribute('placeholder'));
        }
        var name = data.name;
        var displayValue = Fmm.trim(this.framework.getValue(name, this.e, this.envelope, data.label));
        if (!displayValue) {
            var rawValue = this.store.getValue();
            if (rawValue)
                displayValue = Fmm.trim(this.widget.getDisplayValue(name, this.e, data.label, rawValue));
        }
        var hasValue = !!displayValue;
        if (hasValue)
            values[name].push(displayValue);
        data.error = Fmm.trim(this.framework.getError(name, this.e, this.envelope, hasValue) || this.store.getError(hasValue));
        var status;
        if (this.store.isDisabled()) {
            status = Fmm.STATUS.Disabled;
        }
        else if (hasValue) {
            status = data.error ? Fmm.STATUS.Invalid : Fmm.STATUS.Valid;
        }
        else {
            status = data.error ? Fmm.STATUS.Required : Fmm.STATUS.Optional;
        }
        if (status !== data.status)
            this.snapshot.setStatus((data.status = status));
        return data;
    };
    // =============================================================================================================================
    FormStoreItem.prototype.getClipContext = function (e, ancestors) {
        var parent = e.parentElement;
        var parentContext = parent ? ancestors.get(parent) || this.getClipContext(parent, ancestors) : undefined;
        var clipContext = new ClipContext(e, parentContext);
        ancestors.set(e, clipContext);
        return clipContext;
    };
    // =============================================================================================================================
    FormStoreItem.prototype.getCommonAncestor = function (e, label) {
        if (!label)
            return e;
        var parent = e.parentElement;
        while (parent && !parent.contains(label))
            parent = parent.parentElement;
        return parent || e;
    };
    FormStoreItem.DEFAULTFRAMEWORK = {
        destructor: function () { return undefined; },
        getEnvelope: function (_, _e, _l) { return undefined; },
        getError: function (_, _e, _n, _v) { return undefined; },
        getLabel: function (_, _e) { return undefined; },
        getValue: function (_, _e, _n, _l) { return undefined; }
    };
    FormStoreItem.DEFAULTWIDGET = {
        destructor: function () { return undefined; },
        getDisplayValue: function (_, e, label, value) {
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
        }
    };
    FormStoreItem.NAMEPREFIX = '$Fmm';
    return FormStoreItem;
}());
// =================================================================================================================================
//						F O R M S T O R E I T E M S
// =================================================================================================================================
var FormStoreItems = /** @class */ (function () {
    function FormStoreItems() {
        this.list = [];
        this.ignore = new WeakSet();
    }
    // =============================================================================================================================
    FormStoreItems.prototype.destructor = function () {
        this.ignore = new WeakSet();
        this.list.splice(0).forEach(function (fw) { return fw.destructor(); });
    };
    // =============================================================================================================================
    FormStoreItems.prototype.compose = function (p) {
        var _this = this;
        var prev = this.list.splice(0);
        prev.forEach(function (fw) { return fw.removeIfDetached() || _this.list.push(fw); });
        var processed = new WeakSet();
        this.list.forEach(function (fw) { return processed.add(fw.e); });
        Array.from(p.form.elements).forEach(function (e) { return _this.createFormStoreItem(e, p, processed); });
        if (!p.customWidgetIds.length)
            return;
        var custom = p.page.querySelectorAll('#' + p.customWidgetIds.join(',#'));
        custom.forEach(function (e) { return _this.createFormStoreItem(e, p, processed); });
    };
    // =============================================================================================================================
    FormStoreItems.prototype.layoutSnapshots = function (p, pageRect, scale) {
        p.ancestors = new WeakMap();
        this.list.forEach(function (fw) { return fw.layoutSnapshot(p, pageRect, scale); });
    };
    // =============================================================================================================================
    FormStoreItems.prototype.takeSnapshot = function (values) {
        // we need to preserve the values string[] reference, since it may be cached in Detail with the currently displayed Snapshot
        Object.keys(values).forEach(function (name) { return values[name].splice(0); });
        var snapshots = this.list.map(function (fw) { return fw.takeSnapshot(values); });
        Object.values(values).forEach(function (v) { return v.sort(); });
        return snapshots;
    };
    // =============================================================================================================================
    FormStoreItems.prototype.createFormStoreItem = function (e, p, processed) {
        if (processed.has(e) || this.ignore.has(e))
            return undefined;
        if (e.hidden)
            return this.ignore.add(e);
        var store = p.store.createStoreItem(e, function () { return StoreItem.NEW(e, p.storeListener); });
        if (store)
            this.list.push(new FormStoreItem(e, store, p));
        return processed.add(e);
    };
    return FormStoreItems;
}());
// =================================================================================================================================
//						G
// =================================================================================================================================
var G = {
    ELLIPSIS: function (e) {
        e.style.overflow = 'hidden';
        e.style.textOverflow = 'ellipsis';
        e.style.whiteSpace = 'nowrap';
        return e;
    },
    NBSP: '\u00a0'
};
// =================================================================================================================================
//						M I N I M A P
// =================================================================================================================================
var Minimap = /** @class */ (function () {
    // =============================================================================================================================
    function Minimap(p, panel) {
        var _this = this;
        this.panel = panel;
        this.summary = [];
        this.values = {};
        this.dragData = '';
        this.onUpdateBeingCalled = false;
        this.pendingCompose = false;
        this.pendingLayout = false;
        this.pendingSnapshot = false;
        this.data = tslib_1.__assign(tslib_1.__assign({}, Snapshot.NULLDATA), { label: p.title });
        this.minimapId = Minimap.idCounter++;
        this.verbosity = p.verbosity;
        var showingSnapshot;
        var ef = panel.ef;
        var frame = (this.frame = ef.createElement('DIV'));
        frame.className = Fmm.CLASS.MinimapFrame;
        frame.draggable = true;
        frame.ondragstart = function (ev) { return ev.dataTransfer.setData('text/plain', _this.dragData); };
        frame.style.cursor = 'grab';
        frame.style.position = 'relative';
        var header = frame.appendChild(ef.createElement('DIV'));
        header.className = Fmm.CLASS.Header;
        header.style.overflow = 'hidden';
        header.onmouseenter = function (ev) {
            ev.stopPropagation();
            if (_this.pin.isPinned)
                return;
            showingSnapshot = undefined;
            _this.detail.setDisplay(_this.minimapId, _this.data, _this.summary);
        };
        this.status = ef.createElement('DIV');
        var statusStyle = this.status.style;
        var title = G.ELLIPSIS(ef.createElement('LABEL'));
        title.className = Fmm.CLASS.Title;
        title.textContent = title.title = p.title;
        this.detail = p.usePanelDetail ? panel.detail : new Detail(ef, undefined);
        if (!p.usePanelDetail)
            this.detailPopup = new Popup(ef, Fmm.CLASS.DetailPopup, this.detail.e, p.anchor ? this.frame : panel.popupParent);
        this.snapshotsPanel = new SnapshotsPanel(ef, frame);
        this.pin = new PushPin(ef, frame);
        var popup;
        if (p.anchor) {
            panel.add(this, undefined);
            header.appendChild(title);
            statusStyle.position = 'absolute';
            statusStyle.top = statusStyle.bottom = statusStyle.left = statusStyle.right = '0';
            if (!Minimap.POSITIONS.includes(p.anchor.style.position))
                p.anchor.style.position = 'relative';
            p.anchor.appendChild(this.status);
            popup = new Popup(ef, Fmm.CLASS.MinimapPopup, this.frame, this.status);
            var prev = this.status.previousElementSibling;
            while (prev && !prev.className.includes('fmm-'))
                prev = prev.previousElementSibling;
            if (prev)
                p.anchor.removeChild(prev);
            new MutationObserver(function (_, observer) {
                if (!_this.status || _this.status.parentElement === p.anchor)
                    return;
                observer.disconnect();
                _this.destructor();
                popup.destructor();
            }).observe(p.anchor, { childList: true });
        }
        else {
            panel.add(this, frame);
            header.style.whiteSpace = 'nowrap';
            header.appendChild(this.status);
            statusStyle.display = 'inline-block';
            statusStyle.margin = '1px 2px 0 1px';
            statusStyle.height = '0.5em';
            statusStyle.width = '0.8em';
            header.appendChild(title);
        }
        this.d = {
            doUpdates: new Debouncer(function () { return _this.doPendingUpdates(); }, p.debounceMsec || 200),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            onUpdate: p.onUpdate || Minimap.ONUPDATE,
            resizeObserver: new ResizeObserver(function () {
                _this.pendingLayout = true;
                _this.d.doUpdates.schedule();
            }),
            updatesParam: {
                aggregateLabels: p.aggregateLabels || {},
                ancestors: new WeakMap(),
                customWidgetIds: [],
                dynamicLabels: p.dynamicLabels || [],
                ef: ef,
                form: p.form,
                framework: p.framework,
                nameCounter: 1,
                page: p.page || p.form,
                popup: popup,
                snapshotsPanel: this.snapshotsPanel,
                snapshotUpcall: {
                    showDetail: function (d) {
                        return _this.pin.isPinned || _this.detail.setDisplay(_this.minimapId, (showingSnapshot = d), _this.values[d.name]);
                    },
                    snapshotHidden: function (e, d) {
                        if (showingSnapshot === d)
                            showingSnapshot = undefined;
                        _this.detail.clear(d);
                        _this.pin.trackOff(e, frame);
                    }
                },
                store: p.store || this,
                storeListener: function () { return _this.takeSnapshot(); },
                useWidthToScale: p.useWidthToScale,
                values: this.values,
                widgetFactories: p.widgetFactories
            },
            stores: new FormStoreItems()
        };
        var showPopups = function () {
            if (_this.d)
                _this.d.doUpdates.doNow();
            if (popup)
                popup.show(true);
            if (_this.detailPopup)
                _this.detailPopup.show(false);
            else
                _this.panel.showDetailPopup();
        };
        this.status.onmouseover = function (ev) {
            ev.stopPropagation();
            if (p.anchor && !(popup === null || popup === void 0 ? void 0 : popup.isShowing))
                showPopups();
        };
        frame.onmouseenter = function (ev) {
            if (showingSnapshot)
                _this.detail.setDisplay(_this.minimapId, showingSnapshot, _this.values[showingSnapshot.name]);
            if (!_this.pin.isPinned)
                _this.pin.trackOn(_this.snapshotsPanel, ev);
            if (!p.anchor)
                showPopups();
        };
        frame.onmouseleave = function () {
            if (_this.pin.isPinned)
                return;
            _this.pin.trackOff(undefined, frame);
            if (_this.detailPopup)
                _this.detailPopup.hide();
            else
                _this.panel.hideDetailPopup();
            if (popup)
                popup.hide();
        };
        this.updateLayoutOnScroll = this.updateLayoutOnScroll.bind(this);
        this.d.resizeObserver.observe(p.form);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.d.updatesParam.page.addEventListener('scroll', this.updateLayoutOnScroll, true);
        this.d.updatesParam.store.notifyMinimap(this, true);
    }
    // =============================================================================================================================
    Minimap.ONUPDATE = function (_) {
        /**/
    };
    // =============================================================================================================================
    Minimap.prototype.destructor = function () {
        var _a;
        this.detach();
        if (!((_a = this.status) === null || _a === void 0 ? void 0 : _a.parentElement))
            return; // called recursively by MutationObserver
        this.status.parentElement.removeChild(this.status); // may trigger MutationObserver
        this.snapshotsPanel.destructor(); // snapshot destructors call detail
        this.snapshotsPanel = undefined;
        if (this.detail !== this.panel.detail)
            this.detail.destructor();
        this.detail = undefined;
        if (this.detailPopup)
            this.detailPopup.destructor();
        this.detailPopup = undefined;
        this.frame.onmouseenter = this.frame.onmouseleave = undefined;
        this.panel.remove(this, this.frame);
        this.frame = undefined;
        this.panel = undefined;
        this.pin.destructor();
        this.pin = undefined;
        this.status = undefined;
    };
    // =============================================================================================================================
    Minimap.prototype.compose = function (customWidgetIds) {
        if (!this.d)
            return;
        this.d.updatesParam.customWidgetIds = customWidgetIds || [];
        this.updateComposition();
    };
    // =============================================================================================================================
    Minimap.prototype.createStoreItem = function (_, createDefaultStoreItem) {
        return createDefaultStoreItem();
    };
    // =============================================================================================================================
    Minimap.prototype.detach = function () {
        if (!this.d)
            return;
        this.d.doUpdates.destructor();
        this.d.resizeObserver.disconnect();
        this.pendingCompose = this.pendingLayout = false;
        this.pendingSnapshot = true;
        this.doPendingUpdates();
        if (this.d.updatesParam.popup)
            this.frame.parentElement.className += ' ' + Fmm.CLASS.Detached;
        else
            this.frame.className += ' ' + Fmm.CLASS.Detached;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.d.updatesParam.page.removeEventListener('scroll', this.updateLayoutOnScroll, true);
        this.d.updatesParam.store.notifyMinimap(this, false);
        this.d.stores.destructor();
        this.d = undefined;
    };
    // =============================================================================================================================
    Minimap.prototype.isDetached = function () {
        return this.d === undefined;
    };
    // =============================================================================================================================
    Minimap.prototype.isPinnedToPanelDetail = function () {
        return this.pin.isPinned && this.detail === this.panel.detail;
    };
    // =============================================================================================================================
    Minimap.prototype.notifyMinimap = function (_, _on) {
        /**/
    };
    // =============================================================================================================================
    Minimap.prototype.takeSnapshot = function () {
        if (!this.d)
            return false;
        this.pendingSnapshot = true;
        this.d.doUpdates.schedule();
        return true;
    };
    // =============================================================================================================================
    Minimap.prototype.doPendingUpdates = function () {
        var _a;
        if (!this.d)
            return;
        var tStart = this.verbosity ? Date.now() : 0;
        if (this.pendingCompose)
            this.d.stores.compose(this.d.updatesParam);
        var tCompose = this.verbosity ? Date.now() : 0;
        if (this.pendingLayout) {
            var pageRect = this.d.updatesParam.page.getBoundingClientRect();
            if (pageRect.height && pageRect.width) {
                var scale = this.snapshotsPanel.computeScale(pageRect, this.d.updatesParam);
                this.snapshotsPanel.show(false);
                this.d.stores.layoutSnapshots(this.d.updatesParam, pageRect, scale);
                this.snapshotsPanel.show(true);
            }
        }
        var tLayout = this.verbosity ? Date.now() : 0;
        var tUpdate = tLayout;
        var data = this.data;
        if (this.pendingSnapshot) {
            var snapshots = this.d.stores.takeSnapshot(this.values);
            this.status.className = data.status = this.snapshotsPanel.computeStatus();
            var summary_1 = {};
            if (data.status !== Fmm.STATUS.Disabled)
                snapshots.forEach(function (s) { return s.status !== data.status || (summary_1[s.aggregateLabel || s.label] = s.error); });
            var summaryKeys = Object.keys(summary_1).sort();
            (_a = this.summary).splice.apply(_a, tslib_1.__spreadArray([0, this.summary.length], summaryKeys.map(function (key) { return key + ': ' + summary_1[key]; })));
            var minimapSnapshot = { snapshots: snapshots, status: data.status, title: data.label, values: this.values };
            this.detail.refreshDisplay(this.minimapId);
            this.dragData = JSON.stringify(minimapSnapshot);
            if (this.verbosity)
                tUpdate = Date.now();
            if (!this.onUpdateBeingCalled) {
                this.onUpdateBeingCalled = true;
                this.d.onUpdate(minimapSnapshot);
                this.onUpdateBeingCalled = false;
            }
        }
        if (this.verbosity) {
            var lCompose = this.pendingCompose ? ' Compose(ms)=' + String(tCompose - tStart) : '';
            var lLayout = this.pendingLayout ? ' Layout(ms)=' + String(tLayout - tCompose) : '';
            var lSnapshot = this.pendingSnapshot ? ' Snapshot(ms)=' + String(tUpdate - tLayout) : '';
            if (lCompose || lLayout || lSnapshot)
                console.log('FormMinimap[' + data.label + ']' + lCompose + lLayout + lSnapshot);
        }
        this.pendingCompose = this.pendingLayout = this.pendingSnapshot = false;
    };
    // =============================================================================================================================
    Minimap.prototype.updateComposition = function () {
        this.pendingCompose = this.pendingLayout = true;
        this.takeSnapshot();
    };
    // =============================================================================================================================
    Minimap.prototype.updateLayoutOnScroll = function (ev) {
        if (ev.target instanceof HTMLElement && this.d.updatesParam.ancestors.has(ev.target)) {
            this.pendingLayout = true;
            this.d.doUpdates.schedule();
        }
    };
    Minimap.POSITIONS = ['absolute', 'fixed', 'relative', 'sticky'];
    Minimap.idCounter = 0;
    return Minimap;
}());
// =================================================================================================================================
//						P A N E L
// =================================================================================================================================
var Panel = /** @class */ (function () {
    // =============================================================================================================================
    function Panel(ef, parent, detailParent, vertical) {
        this.ef = ef;
        this.vertical = vertical;
        this.minimaps = [];
        this.ef = ef || Panel.EF;
        this.detail = new Detail(this.ef, detailParent);
        this.popupParent = parent.appendChild(this.ef.createElement('DIV'));
        var popupParentStyle = this.popupParent.style;
        popupParentStyle.position = 'relative'; // so popup child can use position:absolute
        if (!detailParent)
            this.detailPopup = new Popup(ef, Fmm.CLASS.DetailPopup, this.detail.e, this.popupParent);
        this.div = parent.appendChild(this.ef.createElement('DIV'));
        var divStyle = this.div.style;
        divStyle.height = divStyle.width = '100%';
        divStyle.overflowX = vertical ? 'hidden' : 'scroll';
        divStyle.overflowY = vertical ? 'scroll' : 'hidden';
        divStyle.whiteSpace = vertical ? 'none' : 'nowrap';
    }
    // =============================================================================================================================
    Panel.prototype.destructor = function () {
        if (this.detail)
            this.detail.destructor();
        if (this.detailPopup)
            this.detailPopup.destructor();
        this.minimaps.splice(0).forEach(function (m) { return m.destructor(); });
    };
    // =============================================================================================================================
    Panel.prototype.add = function (minimap, frame) {
        if (frame) {
            this.div.appendChild(frame);
            frame.style.height = frame.style.width = '100%';
            frame.style.display = this.vertical ? 'block' : 'inline-block';
            frame.scrollIntoView();
        }
        this.minimaps.push(minimap);
    };
    // =============================================================================================================================
    Panel.prototype.createMinimap = function (p) {
        var err = 'FmmMinimap <' + p.title + '> not created: invalid ';
        if (p.anchor && !(p.anchor instanceof HTMLElement))
            throw new Error(err + 'anchor');
        if (!(p.form instanceof HTMLFormElement))
            throw new Error(err + 'form');
        if (p.page && !(p.page instanceof HTMLElement))
            throw new Error(err + 'page');
        return new Minimap(p, this);
    };
    // =============================================================================================================================
    Panel.prototype.destroyDetached = function () {
        this.minimaps.filter(function (m) { return m.isDetached(); }).forEach(function (m) { return m.destructor(); });
    };
    // =============================================================================================================================
    Panel.prototype.hideDetailPopup = function () {
        if (this.detailPopup && !this.minimaps.find(function (m) { return m.isPinnedToPanelDetail(); }))
            this.detailPopup.hide();
    };
    // =============================================================================================================================
    Panel.prototype.remove = function (minimap, frame) {
        frame.parentElement.removeChild(frame);
        var index = this.minimaps.findIndex(function (m) { return m === minimap; });
        if (index >= 0)
            this.minimaps.splice(index, 1);
    };
    // =============================================================================================================================
    Panel.prototype.showDetailPopup = function () {
        if (this.detailPopup)
            this.detailPopup.show(false);
    };
    Panel.EF = {
        createElement: function (t) { return document.createElement(t); },
        createElementNS: function (n, q) { return document.createElementNS(n, q); }
    };
    return Panel;
}());
// =================================================================================================================================
//						P O P U P
// =================================================================================================================================
var Popup = /** @class */ (function () {
    // =============================================================================================================================
    function Popup(ef, className, content, parent) {
        this.div = parent.appendChild(ef.createElement('DIV'));
        this.div.className = className;
        this.div.style.display = 'none';
        this.div.style.position = 'absolute';
        this.div.appendChild(content);
        parent.style.overflow = 'visible'; // to show Popup outside parent
        content.style.display = 'block';
        content.style.position = 'relative';
    }
    // =============================================================================================================================
    Popup.prototype.destructor = function () {
        if (this.div.parentElement)
            this.div.parentElement.removeChild(this.div);
    };
    Object.defineProperty(Popup.prototype, "isShowing", {
        // =============================================================================================================================
        get: function () {
            return this.div.style.display !== 'none';
        },
        enumerable: false,
        configurable: true
    });
    // =============================================================================================================================
    Popup.prototype.getElementSize = function (e) {
        var style = this.div.style;
        if (style.display !== 'none') {
            var rect = this.div.getBoundingClientRect();
            var eRect = e.getBoundingClientRect();
            return [rect.height - (eRect.top - rect.top), rect.width - (eRect.left - rect.left)];
        }
        style.visibility = 'hidden';
        style.display = 'block';
        var rect1 = this.div.getBoundingClientRect();
        var eRect1 = e.getBoundingClientRect();
        style.display = 'none';
        style.visibility = 'visible';
        return [rect1.height - (eRect1.top - rect1.top), rect1.width - (eRect1.left - rect1.left)];
    };
    // =============================================================================================================================
    Popup.prototype.hide = function () {
        this.div.style.display = 'none';
    };
    // =============================================================================================================================
    Popup.prototype.show = function (anchoredAtParentCenter) {
        var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var style = this.div.style;
        if (style.display !== 'none')
            return;
        style.left = style.bottom = 'auto';
        style.right = anchoredAtParentCenter ? '50%' : '105%';
        style.top = anchoredAtParentCenter ? '50%' : '0';
        style.visibility = 'hidden';
        style.display = 'block';
        var rect = this.div.getBoundingClientRect();
        if (rect.left < 0) {
            style.left = anchoredAtParentCenter ? '50%' : '105%';
            style.right = 'auto';
            var rectL = this.div.getBoundingClientRect();
            if (vw - rectL.left - rectL.width < rect.left) {
                style.left = 'auto';
                style.right = anchoredAtParentCenter ? '50%' : '105%';
            }
        }
        if (rect.bottom > vh) {
            style.bottom = anchoredAtParentCenter ? '50%' : '0';
            style.top = 'auto';
            var rectB = this.div.getBoundingClientRect();
            if (rectB.top + rectB.height - vh > rect.bottom) {
                style.bottom = 'auto';
                style.top = anchoredAtParentCenter ? '50%' : '0';
            }
        }
        style.visibility = 'visible';
    };
    return Popup;
}());
// =================================================================================================================================
//						P U S H P I N
// =================================================================================================================================
var PushPin = /** @class */ (function () {
    // =============================================================================================================================
    function PushPin(ef, parent) {
        var _this = this;
        this.SIZE = 24;
        this.pinned = false;
        var uri = 'http://www.w3.org/2000/svg';
        var svg = parent.appendChild(ef.createElementNS(uri, 'svg'));
        this.svg = svg;
        parent.style.overflow = 'visible'; // to show parts of PushPin outside parent
        svg.setAttribute('height', String(this.SIZE));
        svg.setAttribute('width', String(this.SIZE));
        var radius = this.SIZE / 4;
        var circle = svg.appendChild(ef.createElementNS(uri, 'circle'));
        circle.setAttribute('class', Fmm.CLASS.Pushpin);
        circle.setAttribute('cx', String(this.SIZE - radius));
        circle.setAttribute('cy', String(radius));
        circle.setAttribute('r', String(radius));
        var polygon = svg.appendChild(ef.createElementNS(uri, 'polygon'));
        [
            [this.SIZE / 2 + 1, Math.ceil(radius * 1.5)],
            [0, this.SIZE],
            [Math.ceil(this.SIZE * 0.6), radius * 2 - 1]
        ].forEach(function (_a) {
            var x = _a[0], y = _a[1];
            var point = _this.svg.createSVGPoint();
            point.x = x;
            point.y = y;
            polygon.points.appendItem(point);
        });
        polygon.setAttribute('style', 'fill:black');
        svg.style.display = 'none';
        svg.style.position = 'absolute';
    }
    // =============================================================================================================================
    PushPin.prototype.destructor = function () {
        this.trackOff(undefined, undefined);
    };
    Object.defineProperty(PushPin.prototype, "isPinned", {
        // =============================================================================================================================
        get: function () {
            return this.pinned;
        },
        enumerable: false,
        configurable: true
    });
    // =============================================================================================================================
    PushPin.prototype.trackOff = function (onlyIfParentedByE, frame) {
        var parent = this.svg.parentNode;
        if (onlyIfParentedByE && onlyIfParentedByE !== parent)
            return;
        this.pinned = false;
        this.svg.style.display = 'none';
        parent.onclick = parent.onmousemove = undefined;
        parent.style.cursor = this.parentCursor;
        if (frame)
            frame.appendChild(this.svg);
        else
            parent.removeChild(this.svg);
    };
    // =============================================================================================================================
    PushPin.prototype.trackOn = function (snapshots, mev) {
        var _this = this;
        var parent = this.svg.parentNode;
        var rect = parent.getBoundingClientRect();
        parent.appendChild(this.svg);
        this.parentCursor = parent.style.cursor || 'default';
        this.svg.style.zIndex = String(+parent.style.zIndex + 1);
        parent.onclick = function (ev) {
            if (_this.pinned) {
                _this.pinned = false;
                parent.style.cursor = 'none';
                parent.appendChild(_this.svg);
                _this.move(ev, rect);
            }
            else {
                _this.pinned = true;
                parent.style.cursor = _this.parentCursor;
                // position percentagewise to cater for any framework changes while pinned
                if (snapshots.reparentPushPinToSnapshot(_this.svg, ev))
                    return;
                var left = Math.max(1, ((ev.clientX - rect.left) * 100) / rect.width);
                _this.svg.style.left = String(left) + '%';
                var bottom = Math.min(95, ((rect.top + rect.height - ev.clientY) * 100) / rect.height);
                _this.svg.style.bottom = String(bottom) + '%';
            }
        };
        parent.onmousemove = function (ev) { return _this.move(ev, rect); };
        this.move(mev, rect);
        parent.style.cursor = 'none';
        this.svg.style.display = 'block';
    };
    // =============================================================================================================================
    PushPin.prototype.move = function (ev, rect) {
        if (this.pinned)
            return;
        var left = ev.clientX - rect.left;
        var bottom = rect.top + rect.height - ev.clientY;
        this.svg.style.left = String(Math.min(rect.width, Math.max(left, 0))) + 'px';
        this.svg.style.bottom = String(Math.min(rect.height, Math.max(bottom, 0))) + 'px';
    };
    return PushPin;
}());
// =================================================================================================================================
//						S N A P S H O T
// =================================================================================================================================
var Snapshot = /** @class */ (function () {
    // =============================================================================================================================
    function Snapshot(aggregateLabel, name, ef, panel, upcall) {
        var _this = this;
        this.data = tslib_1.__assign(tslib_1.__assign({}, Snapshot.NULLDATA), { aggregateLabel: aggregateLabel, name: name });
        this.div = ef.createElement('DIV');
        this.div.style.position = 'absolute';
        this.div.onmouseover = function (ev) {
            ev.stopPropagation();
            upcall.showDetail(_this.data);
        };
        panel.addSnapshot(this, this.div);
        this.destructor = function () {
            _this.div.onmouseover = undefined;
            panel.removeSnapshot(_this, _this.div);
            upcall.snapshotHidden(_this.div, _this.data);
        };
    }
    // =============================================================================================================================
    Snapshot.prototype.destructor = function () {
        // function body overwritten in constructor
    };
    // =============================================================================================================================
    Snapshot.prototype.reparentPushPin = function (svg, x, y) {
        var rect = this.rect;
        if (!rect || x < rect.left || x > rect.left + rect.width)
            return false;
        if (y < rect.top || y > rect.top + rect.height)
            return false;
        this.div.appendChild(svg);
        svg.style.left = String(((x - rect.left) * 100) / rect.width) + '%';
        svg.style.bottom = String(((rect.top + rect.height - y) * 100) / rect.height) + '%';
        return true;
    };
    // =============================================================================================================================
    Snapshot.prototype.setRect = function (rect, upcall) {
        if (this.rect &&
            rect &&
            this.rect.left === rect.left &&
            this.rect.top === rect.top &&
            this.rect.right === rect.right &&
            this.rect.bottom === rect.bottom)
            return undefined;
        this.rect = rect;
        var style = this.div.style;
        if (!rect) {
            upcall.snapshotHidden(this.div, this.data);
            return (style.display = 'none');
        }
        style.left = String(rect.left) + 'px';
        style.top = String(rect.top) + 'px';
        style.height = String(rect.height) + 'px';
        style.width = String(rect.width) + 'px';
        return (style.display = 'block');
    };
    // =============================================================================================================================
    Snapshot.prototype.setStatus = function (status) {
        this.div.className = status;
    };
    Snapshot.NULLDATA = {
        aggregateLabel: undefined,
        error: undefined,
        label: undefined,
        name: undefined,
        placeholder: undefined,
        status: undefined
    };
    return Snapshot;
}());
// =================================================================================================================================
//						S N A P S H O T S P A N E L
// =================================================================================================================================
var SnapshotsPanel = /** @class */ (function () {
    // =============================================================================================================================
    function SnapshotsPanel(ef, parent) {
        this.list = [];
        this.div = parent.appendChild(ef.createElement('DIV'));
        this.div.style.position = 'relative';
    }
    // =============================================================================================================================
    SnapshotsPanel.prototype.destructor = function () {
        if (this.div.parentElement)
            this.div.parentElement.removeChild(this.div);
        this.list.splice(0).forEach(function (snapshot) { return snapshot.destructor(); });
    };
    // =============================================================================================================================
    SnapshotsPanel.prototype.addSnapshot = function (snapshot, snapshotDiv) {
        this.list.push(snapshot);
        this.div.appendChild(snapshotDiv);
    };
    // =============================================================================================================================
    SnapshotsPanel.prototype.computeScale = function (pageRect, p) {
        var _a;
        var _b = ((_a = p.popup) === null || _a === void 0 ? void 0 : _a.getElementSize(this.div)) || this.getSize(), height = _b[0], width = _b[1];
        var hscale = height / pageRect.height;
        var wscale = width / pageRect.width;
        var pstyle = this.div.parentElement.style;
        var style = this.div.style;
        if (p.useWidthToScale) {
            var heightpx = String(Math.round(pageRect.height * wscale)) + 'px';
            pstyle.width = style.width = String(width) + 'px';
            style.height = heightpx; // may be vetoed by CSS
            if (style.height === heightpx)
                return wscale;
        }
        else {
            var widthpx = String(Math.round(pageRect.width * hscale)) + 'px';
            style.height = String(height) + 'px';
            pstyle.width = style.width = widthpx; // may be vetoed by CSS
            if (pstyle.width === widthpx && style.width === widthpx)
                return hscale;
        }
        // aspect ratio got vetoed by CSS; do the best we can under the circumstances
        var scale = Math.min(hscale, wscale);
        style.height = String(Math.round(pageRect.height * scale)) + 'px';
        pstyle.width = style.width = String(Math.round(pageRect.width * scale)) + 'px';
        return scale;
    };
    // =============================================================================================================================
    SnapshotsPanel.prototype.computeStatus = function () {
        var allDisabled = Fmm.STATUS.Disabled;
        var anyRequired;
        var anyValid;
        var snapshots = this.list;
        for (var i = snapshots.length; --i >= 0;) {
            var status_1 = snapshots[i].data.status;
            if (status_1 === Fmm.STATUS.Invalid)
                return Fmm.STATUS.Invalid;
            if (status_1 !== Fmm.STATUS.Disabled)
                allDisabled = undefined;
            if (status_1 === Fmm.STATUS.Required)
                anyRequired = Fmm.STATUS.Required;
            if (status_1 === Fmm.STATUS.Valid)
                anyValid = Fmm.STATUS.Valid;
        }
        return anyRequired || allDisabled || anyValid || Fmm.STATUS.Optional;
    };
    // =============================================================================================================================
    SnapshotsPanel.prototype.removeSnapshot = function (snapshot, snapshotDiv) {
        var ix = this.list.findIndex(function (s) { return s === snapshot; });
        if (ix < 0)
            return;
        this.list.splice(ix, 1);
        this.div.removeChild(snapshotDiv);
    };
    // =============================================================================================================================
    SnapshotsPanel.prototype.reparentPushPinToSnapshot = function (svg, ev) {
        var rect = this.div.getBoundingClientRect();
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        return !!this.list.find(function (snapshot) { return snapshot.reparentPushPin(svg, x, y); });
    };
    // =============================================================================================================================
    SnapshotsPanel.prototype.show = function (on) {
        this.div.style.display = on ? 'block' : 'none';
    };
    // =============================================================================================================================
    SnapshotsPanel.prototype.getSize = function () {
        var pRect = this.div.parentElement.getBoundingClientRect();
        var rect = this.div.getBoundingClientRect();
        return [pRect.height - (rect.top - pRect.top), pRect.width - (rect.left - pRect.left)];
    };
    return SnapshotsPanel;
}());
// =================================================================================================================================
//						S T O R E I T E M
// =================================================================================================================================
var StoreItem = /** @class */ (function () {
    // =============================================================================================================================
    function StoreItem(fe, event, listener) {
        this.fe = fe;
        fe.addEventListener(event, listener);
        this.destructor = function () { return fe.removeEventListener(event, listener); };
    }
    // =============================================================================================================================
    StoreItem.NEW = function (e, listener) {
        var tag = e.tagName;
        if (tag === 'INPUT') {
            var ie = e;
            return StoreItem.INPUTTYPES.includes(ie.type) ? new StoreItemInput(ie, listener) : undefined;
        }
        if (tag === 'SELECT')
            return new StoreItemSelect(e, listener);
        if (tag === 'TEXTAREA')
            return new StoreItemTextArea(e, listener);
        return undefined;
    };
    // =============================================================================================================================
    StoreItem.prototype.destructor = function () {
        // function body overwritten in constructor
    };
    // =============================================================================================================================
    StoreItem.prototype.getError = function (_) {
        return this.fe.validationMessage || (this.fe.required && !this.fe.value && 'Required') || undefined;
    };
    // =============================================================================================================================
    StoreItem.prototype.getName = function () {
        return this.fe.name;
    };
    // =============================================================================================================================
    StoreItem.prototype.getValue = function () {
        return this.fe.value || undefined;
    };
    // =============================================================================================================================
    StoreItem.prototype.isDisabled = function () {
        return this.fe.disabled;
    };
    StoreItem.INPUTTYPES = [
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
    return StoreItem;
}());
// =================================================================================================================================
//						S T O R E I T E M I N P U T
// =================================================================================================================================
var StoreItemInput = /** @class */ (function (_super) {
    tslib_1.__extends(StoreItemInput, _super);
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
    tslib_1.__extends(StoreItemSelect, _super);
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
    tslib_1.__extends(StoreItemTextArea, _super);
    // =============================================================================================================================
    function StoreItemTextArea(e, listener) {
        var _this = _super.call(this, e, 'input', listener) || this;
        _this.e = e;
        return _this;
    }
    // =============================================================================================================================
    StoreItemTextArea.prototype.isDisabled = function () {
        return this.e.disabled || this.e.readOnly;
    };
    return StoreItemTextArea;
}(StoreItem));
