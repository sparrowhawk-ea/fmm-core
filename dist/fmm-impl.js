import { __assign } from "tslib";
import { FmmStoreHTML } from './fmm-html';
// =================================================================================================================================
//						F M M
// =================================================================================================================================
var Fmm = /** @class */ (function () {
    function Fmm() {
    }
    // =============================================================================================================================
    Fmm.createMinimap = function (p, parent, ef) {
        var err = 'FmmMinimap not created: invalid ';
        if (parent) {
            var panel = new Panel(ef, parent, undefined, true);
            return panel.createMinimap(__assign(__assign({}, p), { anchor: undefined, usePanelDetail: true }));
        }
        else {
            if (!p.anchor)
                throw new Error(err + 'anchor');
            var panel = new Panel(ef, undefined, undefined, false);
            return panel.createMinimap(__assign(__assign({}, p), { usePanelDetail: false }));
        }
    };
    // =============================================================================================================================
    Fmm.createPanel = function (parent, detailParent, vertical, ef) {
        var err = 'FmmPanel not created: invalid ';
        if (!parent)
            throw new Error(err + 'parent');
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
    Fmm.STATUS_CLASS = Object.freeze({
        Disabled: 'fmm-disabled',
        Invalid: 'fmm-invalid',
        Optional: 'fmm-optional',
        Required: 'fmm-required',
        Valid: 'fmm-valid'
    });
    return Fmm;
}());
export { Fmm };
// =================================================================================================================================
//						C L I P C O N T E X T
// =================================================================================================================================
var ClipContext = /** @class */ (function () {
    // =============================================================================================================================
    function ClipContext(form, e, parent) {
        this.parent = parent;
        this.clip = (parent === null || parent === void 0 ? void 0 : parent.clipRect(form.getRect(e))) || form.getRect(e);
        this.clipX = form.clipsContentX(e);
        this.clipY = form.clipsContentY(e);
    }
    // =============================================================================================================================
    ClipContext.prototype.clipRect = function (rect) {
        var left = Math.max(rect.left, this.clip.left);
        var top = Math.max(rect.top, this.clip.top);
        var width = Math.max(0, (this.clipX ? Math.min(rect.right, this.clip.right) : rect.right) - left);
        var height = Math.max(0, (this.clipY ? Math.min(rect.bottom, this.clip.bottom) : rect.bottom) - top);
        var clipped = { left: left, top: top, width: width, height: height, right: left + width, bottom: top + height };
        return width && height && this.parent ? this.parent.clipRect(clipped) : clipped;
    };
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
    };
    // =============================================================================================================================
    Detail.prototype.refreshDisplay = function (minimapId) {
        var _a;
        if (minimapId !== this.minimapId)
            return;
        var data = this.data;
        var labelPrefix = ((_a = data.aggregateLabel) === null || _a === void 0 ? void 0 : _a.concat(': ')) || '';
        this.error.textContent = this.error.title = data.error || G.NBSP;
        this.label.textContent = this.label.title = labelPrefix + data.label || G.NBSP;
        this.status.className = Fmm.STATUS_CLASS[data.status];
        this.value.placeholder = data.placeholder || '';
        this.value.value = data.aggregateValues ? data.aggregateValues.join('\n') : data.value || '';
    };
    // =============================================================================================================================
    Detail.prototype.setDisplay = function (minimapId, newData) {
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
    function FormStoreItem(name, e, storeItem, p) {
        var _a;
        this.e = e;
        this.storeItem = storeItem;
        var label = p.form.getLabelFor(e);
        this.dynamicLabel = p.dynamicLabels.includes(name);
        this.form = p.form;
        this.framework = ((_a = p.framework) === null || _a === void 0 ? void 0 : _a.createFrameworkItem(name, e)) || FormStoreItem.DEFAULT_FRAMEWORK;
        this.envelope = this.framework.getEnvelope(name, e, label) || this.getCommonAncestor(e, label) || e;
        this.label = label || this.framework.getLabel(name, this.envelope);
        this.snapshot = new Snapshot(name, p);
    }
    // =============================================================================================================================
    FormStoreItem.prototype.destructor = function () {
        this.framework.destructor();
        this.storeItem.destructor();
    };
    // =============================================================================================================================
    FormStoreItem.prototype.layoutSnapshot = function (ancestors, pageRect, scale) {
        var parent = this.form.getParent(this.envelope);
        var clipContext = ancestors.get(parent) || this.getClipContext(parent, ancestors);
        var rect = clipContext.clipRect(this.form.getRect(this.envelope));
        if (!rect.width || !rect.height)
            return this.snapshot.setRect(undefined);
        var left = Math.floor((rect.left - pageRect.left) * scale);
        var top = Math.floor((rect.top - pageRect.top) * scale);
        var height = Math.max(2, Math.floor(rect.height * scale));
        var width = Math.max(2, Math.floor(rect.width * scale));
        return this.snapshot.setRect(new DOMRectReadOnly(left, top, width, height));
    };
    // =============================================================================================================================
    FormStoreItem.prototype.removeIfDetached = function () {
        if (this.form.getParent(this.envelope)) {
            for (var e = this.e; e; e = this.form.getParent(e))
                if (e === this.envelope)
                    return false; // this.envelope.contains(this.e)
        }
        this.snapshot.destructor();
        this.destructor();
        return true;
    };
    // =============================================================================================================================
    FormStoreItem.prototype.takeSnapshot = function (form, store) {
        var data = this.snapshot.data;
        var name = data.name;
        if (data.label === undefined || this.dynamicLabel) {
            data.label = Fmm.trim(form.getDisplayLabel(this.e, this.label) || name);
            data.placeholder = Fmm.trim(this.form.getPlaceholder(this.e));
        }
        var displayValue = Fmm.trim(this.framework.getValue(name, this.e, this.envelope, data.label));
        if (!displayValue) {
            var rawValue = store.getValue(form, this.storeItem);
            if (rawValue)
                displayValue = Fmm.trim(form.getDisplayValue(this.e, data.label, rawValue));
        }
        data.value = displayValue;
        var hasValue = !!displayValue;
        if (hasValue && data.aggregateValues)
            data.aggregateValues.push(displayValue);
        data.error = Fmm.trim(this.framework.getError(name, this.e, this.envelope, hasValue) || store.getError(form, this.storeItem, hasValue));
        if (store.isDisabled(form, this.storeItem)) {
            this.snapshot.setStatus('Disabled');
        }
        else if (hasValue) {
            this.snapshot.setStatus(data.error ? 'Invalid' : 'Valid');
        }
        else {
            this.snapshot.setStatus(data.error ? 'Required' : 'Optional');
        }
        return data;
    };
    // =============================================================================================================================
    FormStoreItem.prototype.getClipContext = function (e, ancestors) {
        var parent = this.form.getParent(e);
        var parentContext = parent ? ancestors.get(parent) || this.getClipContext(parent, ancestors) : undefined;
        var clipContext = new ClipContext(this.form, e, parentContext);
        ancestors.set(e, clipContext);
        return clipContext;
    };
    // =============================================================================================================================
    FormStoreItem.prototype.getCommonAncestor = function (e, label) {
        var labelAncestors = [];
        do {
            labelAncestors.push(label);
        } while ((label = this.form.getParent(label)));
        while (e && !labelAncestors.includes(e))
            e = this.form.getParent(e);
        return e;
    };
    FormStoreItem.DEFAULT_FRAMEWORK = {
        destructor: function () { return undefined; },
        getEnvelope: function (_, _e, _l) { return undefined; },
        getError: function (_, _e, _n, _v) { return undefined; },
        getLabel: function (_, _e) { return undefined; },
        getValue: function (_, _e, _n, _l) { return undefined; }
    };
    return FormStoreItem;
}());
// =================================================================================================================================
//						F O R M S T O R E I T E M S
// =================================================================================================================================
var FormStoreItems = /** @class */ (function () {
    function FormStoreItems() {
        this.list = [];
        this.ignore = new WeakSet();
        this.nameCounter = 0;
    }
    // =============================================================================================================================
    FormStoreItems.prototype.destructor = function () {
        this.ignore = new WeakSet();
        this.list.splice(0).forEach(function (fw) { return fw.destructor(); });
    };
    // =============================================================================================================================
    FormStoreItems.prototype.compose = function (p) {
        var _this = this;
        var elements = p.form.getElements(p.customElementIds);
        var prev = this.list.splice(0);
        prev.forEach(function (fw) { return fw.removeIfDetached() || _this.list.push(fw); });
        var processed = new WeakSet();
        this.list.forEach(function (fw) { return processed.add(fw.e); });
        elements.forEach(function (e) {
            if (processed.has(e) || _this.ignore.has(e))
                return undefined;
            if (p.form.isHidden(e))
                return _this.ignore.add(e);
            var storeItem = p.store.createStoreItem(p.form, e);
            if (storeItem) {
                var name_1 = p.store.getName(p.form, storeItem) || FormStoreItems.NAMEPREFIX + String(_this.nameCounter++);
                _this.list.push(new FormStoreItem(name_1, e, storeItem, p));
            }
            processed.add(e);
        });
    };
    // =============================================================================================================================
    FormStoreItems.prototype.layoutSnapshots = function (ancestors, pageRect, scale) {
        this.list.forEach(function (fw) { return fw.layoutSnapshot(ancestors, pageRect, scale); });
    };
    // =============================================================================================================================
    FormStoreItems.prototype.takeSnapshots = function (form, store) {
        return this.list.map(function (fw) { return fw.takeSnapshot(form, store); });
    };
    FormStoreItems.NAMEPREFIX = '$FmmFSI';
    return FormStoreItems;
}());
// =================================================================================================================================
//						F R A M E
// =================================================================================================================================
var Frame = /** @class */ (function () {
    // =============================================================================================================================
    function Frame(ef, anchor, status, minimapTitle) {
        this.dragData = '';
        var div = (this.div = ef.createElement('DIV'));
        div.className = Fmm.CLASS.MinimapFrame;
        div.draggable = true;
        div.ondragstart = this.onDragStart.bind(this);
        div.style.cursor = 'grab';
        div.style.position = 'relative';
        var header = (this.header = div.appendChild(ef.createElement('DIV')));
        header.className = Fmm.CLASS.Header;
        header.style.overflow = 'hidden';
        header.style.whiteSpace = 'nowrap';
        var title = G.ELLIPSIS(ef.createElement('LABEL'));
        title.className = Fmm.CLASS.Title;
        title.style.cursor = 'inherit';
        title.textContent = title.title = minimapTitle;
        var statusStyle = status.style;
        if (anchor) {
            statusStyle.position = 'absolute';
            statusStyle.top = statusStyle.bottom = statusStyle.left = statusStyle.right = '0';
            if (!Frame.POSITIONS.includes(anchor.style.position))
                anchor.style.position = 'relative';
            anchor.appendChild(status);
            this.popup = new Popup(ef, Fmm.CLASS.MinimapPopup, this.div, status);
            var prev = status.previousElementSibling;
            while (prev && !prev.className.includes('fmm-'))
                prev = prev.previousElementSibling;
            if (prev)
                anchor.removeChild(prev);
            this.setDestroyOnDetachFromDOM(anchor, status);
        }
        else {
            header.appendChild(status);
            statusStyle.display = 'inline-block';
            statusStyle.margin = '1px 2px 0 1px';
            statusStyle.height = '0.5em';
            statusStyle.width = '0.8em';
        }
        header.appendChild(title);
    }
    // =============================================================================================================================
    Frame.prototype.destructor = function () {
        if (!this.div)
            return;
        this.detach();
        if (this.popup)
            this.popup.destructor();
        this.popup = undefined;
        this.div.onmouseenter = this.div.onmouseleave = undefined;
        this.div.parentElement.removeChild(this.div);
        this.div = undefined;
    };
    // =============================================================================================================================
    Frame.prototype.detach = function () {
        if (!this.div)
            return;
        if (this.popup)
            this.div.parentElement.classList.add(Fmm.CLASS.Detached);
        else
            this.div.classList.add(Fmm.CLASS.Detached);
    };
    // =============================================================================================================================
    Frame.prototype.newDetailPopup = function (ef, detail) {
        return new Popup(ef, Fmm.CLASS.DetailPopup, detail.e, this.div);
    };
    // =============================================================================================================================
    Frame.prototype.setSnapshotResult = function (result) {
        this.dragData = JSON.stringify(result);
    };
    // =============================================================================================================================
    Frame.prototype.onDragStart = function (ev) {
        ev.dataTransfer.setData('text/plain', this.dragData);
    };
    // =============================================================================================================================
    Frame.prototype.setDestroyOnDetachFromDOM = function (anchor, status) {
        var _this = this;
        new MutationObserver(function (_, observer) {
            if (status.parentElement === anchor)
                return;
            observer.disconnect();
            _this.destructor();
        }).observe(anchor, { childList: true });
    };
    Frame.POSITIONS = ['absolute', 'fixed', 'relative', 'sticky'];
    return Frame;
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
    NBSP: '\u00a0',
    NOP: function () { }
};
// =================================================================================================================================
//						M I N I M A P
// =================================================================================================================================
var Minimap = /** @class */ (function () {
    // =============================================================================================================================
    function Minimap(p, panel) {
        var _this = this;
        this.panel = panel;
        this.onUpdateBeingCalled = false;
        this.pendingCompose = false;
        this.pendingLayout = false;
        this.pendingSnapshot = false;
        var ef = panel.ef;
        this.anchored = !!p.anchor;
        this.status = ef.createElement('DIV');
        this.summaryData = __assign(__assign({}, Snapshot.NULLDATA), { label: p.title });
        this.title = p.title;
        var frame = (this.frame = new Frame(ef, p.anchor, this.status, this.title));
        panel.add(this, this.anchored ? undefined : frame.div);
        frame.div.onmouseenter = this.onFrameEnter.bind(this);
        frame.div.onmouseleave = this.onFrameLeave.bind(this);
        if (this.anchored && p.zoomFactor)
            frame.popup.setZoomable(this, frame.header, Math.min(Minimap.MAX_ZOOMFACTOR, Math.max(0.0, p.zoomFactor)));
        frame.header.onmouseenter = this.onHeaderEnter.bind(this);
        this.snapshotsPanel = new SnapshotsPanel(ef, frame.div);
        this.pin = new PushPin(ef, frame.div);
        this.minimapId = Minimap.idCounter++;
        this.useWidthToScale = p.useWidthToScale;
        this.verbosity = p.verbosity || 0;
        this.detail = p.usePanelDetail ? panel.detail : new Detail(ef, undefined);
        this.d = {
            clipContextAncestors: new WeakMap(),
            doUpdates: new Debouncer(function () { return _this.doPendingUpdates(); }, p.debounceMsec || Minimap.DEFAULT_DEBOUNCEMSEC),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            onUpdate: p.onUpdate || Minimap.ONUPDATE,
            paramUpdates: {
                aggregateLabels: p.aggregateLabels || {},
                aggregateValues: {},
                customElementIds: [],
                dynamicLabels: p.dynamicLabels || [],
                ef: panel.ef,
                form: p.form,
                framework: p.framework,
                snapshotUpcall: {
                    hideDetail: this.snapshotHidden.bind(this),
                    showDetail: this.snapshotActive.bind(this)
                },
                snapshotsPanel: this.snapshotsPanel,
                store: p.store || new FmmStoreHTML()
            },
            storeItems: new FormStoreItems()
        };
        if (!p.usePanelDetail)
            this.detailPopup = this.anchored ? frame.newDetailPopup(ef, this.detail) : panel.newDetailPopup(this.detail);
        this.status.onmouseover = this.onStatusEnter.bind(this);
        this.d.paramUpdates.store.notifyMinimapOnUpdate(this, true);
        this.d.paramUpdates.form.setLayoutHandler(this);
    }
    // =============================================================================================================================
    Minimap.ONUPDATE = function (_) {
        // no-op
    };
    // =============================================================================================================================
    Minimap.prototype.destructor = function () {
        var _a;
        this.detach();
        if (!((_a = this.status) === null || _a === void 0 ? void 0 : _a.parentElement))
            return; // called recursively by MutationObserver
        this.status.parentElement.removeChild(this.status); // may trigger MutationObserver
        this.snapshotsPanel.destructor(); // snapshot destructors call detail and pin so destruction order matters
        this.snapshotsPanel = undefined;
        this.pin.destructor();
        this.pin = undefined;
        this.frame.destructor();
        this.frame = undefined;
        if (this.detail !== this.panel.detail)
            this.detail.destructor();
        this.detail = undefined;
        if (this.detailPopup)
            this.detailPopup.destructor();
        this.detailPopup = undefined;
        this.panel.remove(this);
        this.panel = undefined;
        this.status = undefined;
    };
    // =============================================================================================================================
    Minimap.prototype.compose = function (customElementIds) {
        if (!this.d)
            return;
        this.d.paramUpdates.customElementIds = customElementIds || [];
        this.pendingCompose = this.pendingLayout = true;
        this.takeSnapshot();
    };
    Object.defineProperty(Minimap.prototype, "isDetached", {
        // =============================================================================================================================
        get: function () {
            return this.d === undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Minimap.prototype, "isPinned", {
        // =============================================================================================================================
        get: function () {
            return this.pin.isPinned;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Minimap.prototype, "isPinnedToPanelDetail", {
        // =============================================================================================================================
        get: function () {
            return this.pin.isPinned && this.detail === this.panel.detail;
        },
        enumerable: false,
        configurable: true
    });
    // =============================================================================================================================
    Minimap.prototype.detach = function () {
        if (!this.d)
            return;
        this.d.doUpdates.destructor();
        this.pendingCompose = this.pendingLayout = false;
        this.pendingSnapshot = true;
        this.doPendingUpdates();
        this.frame.detach();
        this.d.paramUpdates.form.clearLayoutHandler();
        this.d.paramUpdates.store.notifyMinimapOnUpdate(this, false);
        this.d.storeItems.destructor();
        this.d = undefined;
    };
    // =============================================================================================================================
    Minimap.prototype.handleLayout = function (e) {
        if (!e || this.d.clipContextAncestors.has(e)) {
            this.pendingLayout = true;
            this.d.doUpdates.schedule();
        }
    };
    // =============================================================================================================================
    Minimap.prototype.layout = function (zoomEvent) {
        var tStart = zoomEvent && this.verbosity ? Date.now() : 0;
        var pageRect = this.d.paramUpdates.form.getRect();
        if (pageRect.height && pageRect.width) {
            this.d.clipContextAncestors = new WeakMap();
            var scale = this.snapshotsPanel.computeScale(pageRect, this.frame, this.useWidthToScale);
            this.snapshotsPanel.show(false);
            this.d.storeItems.layoutSnapshots(this.d.clipContextAncestors, pageRect, scale);
            this.snapshotsPanel.show(true);
            if (zoomEvent) {
                this.pin.trackOff(undefined, this.frame);
                this.pin.trackOn(this.snapshotsPanel, zoomEvent);
            }
        }
        if (zoomEvent && this.verbosity)
            console.log('FormMinimap[' + this.title + '] Layout(ms)=' + String(Date.now() - tStart));
    };
    // =============================================================================================================================
    Minimap.prototype.notifyMinimap = function (_, _on) {
        // no-op
    };
    // =============================================================================================================================
    Minimap.prototype.onFrameEnter = function (ev) {
        if (!this.pin.isPinned)
            this.pin.trackOn(this.snapshotsPanel, ev);
        if (this.activeSnapshot)
            this.detail.setDisplay(this.minimapId, this.activeSnapshot);
        if (!this.anchored)
            this.showPopups();
    };
    // =============================================================================================================================
    Minimap.prototype.onFrameLeave = function () {
        if (this.isPinned)
            return;
        this.pin.trackOff(undefined, this.frame);
        this.detail.clear(this.activeSnapshot);
        if (this.detailPopup)
            this.detailPopup.hide();
        else
            this.panel.hideDetailPopup();
        if (this.frame.popup)
            this.frame.popup.hide();
    };
    // =============================================================================================================================
    Minimap.prototype.onHeaderEnter = function (ev) {
        ev.stopPropagation();
        if (this.pin.isPinned)
            return;
        this.activeSnapshot = undefined;
        this.detail.setDisplay(this.minimapId, this.summaryData);
    };
    // =============================================================================================================================
    Minimap.prototype.onStatusEnter = function (ev) {
        var _a;
        ev.stopPropagation();
        if (this.anchored && !((_a = this.frame.popup) === null || _a === void 0 ? void 0 : _a.isShowing))
            this.showPopups();
    };
    ;
    // =============================================================================================================================
    Minimap.prototype.takeSnapshot = function () {
        if (!this.d)
            return false;
        this.pendingSnapshot = true;
        this.d.doUpdates.schedule();
        return true;
    };
    // =============================================================================================================================
    Minimap.prototype.doTakeSnapshot = function () {
        var p = this.d.paramUpdates;
        // we need to preserve the aggregateValues references since they are cached in individual FmmSnapshot
        var aggregateValues = Object.values(p.aggregateValues);
        aggregateValues.forEach(function (v) { return v.splice(0); });
        var snapshots = this.d.storeItems.takeSnapshots(p.form, p.store);
        aggregateValues.forEach(function (v) { return v.sort(); });
        var status = this.snapshotsPanel.computeStatus();
        this.status.className = Fmm.STATUS_CLASS[status];
        // aggregateValues for the minimap summaryStatus is the list of errors in the form fields
        var errorsSummary = {};
        if (status !== 'Disabled')
            snapshots.filter(function (s) { return s.error && s.status === status; }).forEach(function (s) { return errorsSummary[s.aggregateLabel || s.label] = s.error; });
        this.summaryData.aggregateValues = Object.keys(errorsSummary).sort().map(function (key) { return key + ': ' + errorsSummary[key]; });
        this.summaryData.status = status;
        // set the result for drag-and-drop and client onUpdate() callback
        return { snapshots: snapshots, status: status, title: this.title };
    };
    // =============================================================================================================================
    Minimap.prototype.doPendingUpdates = function () {
        if (!this.d)
            return;
        var tStart = this.verbosity ? Date.now() : 0;
        if (this.pendingCompose)
            this.d.storeItems.compose(this.d.paramUpdates);
        var tCompose = this.verbosity ? Date.now() : 0;
        if (this.pendingLayout)
            this.layout(undefined);
        var tLayout = this.verbosity ? Date.now() : 0;
        var tUpdate = tLayout;
        if (this.pendingSnapshot) {
            var result = this.doTakeSnapshot();
            this.frame.setSnapshotResult(result);
            if (this.verbosity)
                tUpdate = Date.now();
            this.detail.refreshDisplay(this.minimapId);
            if (!this.onUpdateBeingCalled) {
                this.onUpdateBeingCalled = true;
                this.d.onUpdate(result);
                this.onUpdateBeingCalled = false;
            }
        }
        if (this.verbosity) {
            var lCompose = this.pendingCompose ? ' Compose(ms)=' + String(tCompose - tStart) : '';
            var lLayout = this.pendingLayout ? ' Layout(ms)=' + String(tLayout - tCompose) : '';
            var lSnapshot = this.pendingSnapshot ? ' Snapshot(ms)=' + String(tUpdate - tLayout) : '';
            if (lCompose || lLayout || lSnapshot)
                console.log('FormMinimap[' + this.title + ']' + lCompose + lLayout + lSnapshot);
        }
        this.pendingCompose = this.pendingLayout = this.pendingSnapshot = false;
    };
    // =============================================================================================================================
    Minimap.prototype.showPopups = function () {
        if (this.d)
            this.d.doUpdates.doNow();
        if (this.frame.popup)
            this.frame.popup.show(true);
        if (this.detailPopup)
            this.detailPopup.show(false);
        else
            this.panel.showDetailPopup();
    };
    // =============================================================================================================================
    Minimap.prototype.snapshotActive = function (data) {
        if (this.pin.isPinned)
            return;
        this.detail.setDisplay(this.minimapId, (this.activeSnapshot = data));
    };
    // =============================================================================================================================
    Minimap.prototype.snapshotHidden = function (e, data) {
        if (this.activeSnapshot === data)
            this.activeSnapshot = undefined;
        this.detail.clear(data);
        this.pin.trackOff(e, this.frame);
    };
    Minimap.DEFAULT_DEBOUNCEMSEC = 200;
    Minimap.MAX_ZOOMFACTOR = 5.0;
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
        if (parent) {
            this.detail = new Detail(this.ef, detailParent);
            this.popupParent = parent.appendChild(this.ef.createElement('DIV'));
            var popupParentStyle = this.popupParent.style;
            popupParentStyle.position = 'relative'; // so popup child can use position:absolute
            if (!detailParent)
                this.detailPopup = this.newDetailPopup(this.detail);
            this.div = parent.appendChild(this.ef.createElement('DIV'));
            var divStyle = this.div.style;
            divStyle.height = divStyle.width = '100%';
            divStyle.overflowX = vertical ? 'hidden' : 'scroll';
            divStyle.overflowY = vertical ? 'scroll' : 'hidden';
            divStyle.whiteSpace = vertical ? 'none' : 'nowrap';
        }
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
        if (frame && this.div) {
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
        if (!p.form)
            throw new Error(err + 'form');
        return new Minimap(p, this);
    };
    // =============================================================================================================================
    Panel.prototype.destroyDetached = function () {
        this.minimaps.filter(function (m) { return m.isDetached; }).forEach(function (m) { return m.destructor(); });
    };
    // =============================================================================================================================
    Panel.prototype.hideDetailPopup = function () {
        if (this.detailPopup && !this.minimaps.find(function (m) { return m.isPinnedToPanelDetail; }))
            this.detailPopup.hide();
    };
    // =============================================================================================================================
    Panel.prototype.newDetailPopup = function (detail) {
        return new Popup(this.ef, Fmm.CLASS.DetailPopup, detail.e, this.popupParent);
    };
    // =============================================================================================================================
    Panel.prototype.remove = function (minimap) {
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
    Popup.prototype.setZoomable = function (minimap, trigger, zoomFactor) {
        var _this = this;
        var isZoomed = false;
        var unzoomedHeight = 0;
        var unzoomedWidth = 0;
        trigger.style.cursor = 'zoom-in';
        trigger.onclick = function (ev) {
            if (ev.button !== 0)
                return;
            ev.stopPropagation();
            if (!unzoomedHeight) {
                var rect = _this.div.getBoundingClientRect();
                unzoomedHeight = rect.height;
                unzoomedWidth = rect.width;
            }
            if (minimap.useWidthToScale)
                _this.div.style.width = String(isZoomed ? unzoomedWidth : unzoomedWidth * zoomFactor) + 'px';
            else
                _this.div.style.height = String(isZoomed ? unzoomedHeight : unzoomedHeight * zoomFactor) + 'px';
            minimap.layout(ev);
            isZoomed = !isZoomed;
            trigger.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
        };
    };
    // =============================================================================================================================
    Popup.prototype.show = function (anchoredAtParentCenter) {
        var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
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
            if (viewportWidth - rectL.left - rectL.width < rect.left) {
                style.left = 'auto';
                style.right = anchoredAtParentCenter ? '50%' : '105%';
            }
        }
        if (rect.bottom > viewportHeight) {
            style.bottom = anchoredAtParentCenter ? '50%' : '0';
            style.top = 'auto';
            var rectB = this.div.getBoundingClientRect();
            if (rectB.top + rectB.height - viewportHeight > rect.bottom) {
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
            frame.div.appendChild(this.svg);
        else
            parent.removeChild(this.svg);
    };
    // =============================================================================================================================
    PushPin.prototype.trackOn = function (snapshots, mev) {
        var _this = this;
        var parent = this.svg.parentNode;
        var rect = parent.getBoundingClientRect();
        parent.appendChild(this.svg);
        this.parentCursor = parent.style.cursor;
        this.svg.style.zIndex = String(+parent.style.zIndex + 1);
        parent.onclick = function (ev) {
            if (ev.button !== 0)
                return;
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
    function Snapshot(name, p) {
        var _this = this;
        var aggregateLabel = p.aggregateLabels[name];
        if (aggregateLabel && !(name in p.aggregateValues))
            p.aggregateValues[name] = [];
        this.data = __assign(__assign({}, Snapshot.NULLDATA), { aggregateLabel: aggregateLabel, aggregateValues: p.aggregateValues[name], name: name });
        this.upcall = p.snapshotUpcall;
        this.div = p.ef.createElement('DIV');
        this.div.style.position = 'absolute';
        this.div.onmouseover = function (ev) {
            ev.stopPropagation();
            _this.upcall.showDetail(_this.data);
        };
        p.snapshotsPanel.addSnapshot(this, this.div);
        this.destructor = function () {
            _this.div.onmouseover = undefined;
            _this.upcall.hideDetail(_this.div, _this.data);
            p.snapshotsPanel.removeSnapshot(_this, _this.div);
            _this.destructor = G.NOP;
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
    Snapshot.prototype.setRect = function (rect) {
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
            this.upcall.hideDetail(this.div, this.data);
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
        this.div.className = Fmm.STATUS_CLASS[this.data.status = status];
    };
    Snapshot.NULLDATA = {
        aggregateLabel: undefined,
        aggregateValues: undefined,
        error: undefined,
        label: undefined,
        name: undefined,
        placeholder: undefined,
        status: undefined,
        value: undefined
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
    SnapshotsPanel.prototype.computeScale = function (pageRect, frame, useWidthToScale) {
        var _a = frame.popup ? frame.popup.getElementSize(this.div) : this.getSize(), height = _a[0], width = _a[1];
        var hscale = height / pageRect.height;
        var wscale = width / pageRect.width;
        var pstyle = this.div.parentElement.style;
        var style = this.div.style;
        if (useWidthToScale) {
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
        var allDisabled = 'Disabled';
        var anyRequired;
        var anyValid;
        var snapshots = this.list;
        for (var i = snapshots.length; --i >= 0;) {
            var status_1 = snapshots[i].data.status;
            if (status_1 === 'Invalid')
                return status_1;
            if (status_1 !== 'Disabled')
                allDisabled = undefined;
            if (status_1 === 'Required')
                anyRequired = status_1;
            if (status_1 === 'Valid')
                anyValid = status_1;
        }
        return anyRequired || allDisabled || anyValid || 'Optional';
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
