(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Fmm = {}));
})(this, (function (exports) { 'use strict';

	class FmmStoreBase {
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
	    this.minimaps.forEach((m) => m.takeSnapshot() || stale.add(m));
	    stale.forEach((m) => this.minimaps.delete(m));
	  }
	}
	class FmmStoreImpl extends FmmStoreBase {
	  constructor(values, errors) {
	    super();
	    this.values = values;
	    this.errors = errors || {};
	    this.values = values || {};
	  }
	  createStoreItem(form, e) {
	    for (const key of form.getStoreKeys(e))
	      if (key && key in this.values)
	        return new StoreItem$1(e, key);
	    return void 0;
	  }
	  getError(_, item, _hasValue) {
	    const error = this.errors[item.key];
	    if (Array.isArray(error))
	      return error.length ? String(error[0]) : "";
	    return error ? String(error) : "";
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
	class StoreItem$1 {
	  constructor(e, key) {
	    this.e = e;
	    this.key = key;
	  }
	  destructor() {
	  }
	}

	const FmmBootstrap4 = {
	  createFrameworkItem(_, e) {
	    return e.tagName === "INPUT" && ["checkbox", "radio"].includes(e.type) ? G$1.B4_Check : G$1.B4_Other;
	  }
	};
	const _FmmFormHTML = class {
	  constructor(form, page) {
	    this.form = form;
	    this.resizeObserver = new ResizeObserver(this.onFormResize.bind(this));
	    this.page = page || form;
	    this.resizeObserver.observe(form);
	    this.updateLayoutOnScroll = this.updateLayoutOnScroll.bind(this);
	    this.page.addEventListener("scroll", this.updateLayoutOnScroll, true);
	  }
	  clearLayoutHandler() {
	    this.resizeObserver.disconnect();
	    this.page.removeEventListener("scroll", this.updateLayoutOnScroll, true);
	    this.layoutHandler = void 0;
	  }
	  clipsContentX(e) {
	    const { overflow, overflowX } = e.style;
	    return _FmmFormHTML.CLIP.includes(overflow) || _FmmFormHTML.CLIP.includes(overflowX);
	  }
	  clipsContentY(e) {
	    const { overflow, overflowY } = e.style;
	    return _FmmFormHTML.CLIP.includes(overflow) || _FmmFormHTML.CLIP.includes(overflowY);
	  }
	  getDisplayLabel(e, label) {
	    return label?.getAttribute("aria-label") || label?.textContent || e.getAttribute("aria-label") || e.id;
	  }
	  getDisplayValue(e, label, value) {
	    const tag = e.tagName;
	    if (tag === "INPUT") {
	      const ie = e;
	      if (ie.type === "checkbox" || ie.type === "radio")
	        return ie.checked ? label : "";
	      return ie.type === "password" ? "*****" : String(value);
	    }
	    if (tag === "SELECT") {
	      const values = Array.isArray(value) ? value : [value];
	      if (!values.length)
	        return String(value);
	      const options = e.options;
	      if (typeof values[0] === "number")
	        return values.map((i) => options[i].text).join("\n");
	      const sel = Array.from(options).filter((o) => values.includes(o.value));
	      return sel.map((o) => o.text).join("\n");
	    }
	    return String(value);
	  }
	  getElements(customElementIds) {
	    const elements = Array.from(this.form.elements);
	    if (customElementIds.length)
	      elements.push(...Array.from(this.page.querySelectorAll("#" + customElementIds.join(",#"))));
	    return elements;
	  }
	  getLabelFor(e) {
	    let label = e.id ? this.page.querySelector("label[for=" + e.id + "]") : void 0;
	    if (!label && e.parentElement?.tagName === "LABEL")
	      label = e.parentElement;
	    if (!label && e.previousElementSibling?.tagName === "LABEL")
	      label = e.previousElementSibling;
	    return label;
	  }
	  getParent(e) {
	    return e.parentElement;
	  }
	  getPlaceholder(e) {
	    return e.getAttribute("placeholder") || "";
	  }
	  getRect(e) {
	    return (e || this.page).getBoundingClientRect();
	  }
	  getStoreKeys(e) {
	    const name = e.getAttribute("name");
	    return name ? [name, e.id] : [e.id];
	  }
	  isDisabled(e) {
	    if (e.tagName !== "TEXTAREA")
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
	};
	let FmmFormHTML = _FmmFormHTML;
	FmmFormHTML.CLIP = ["auto", "hidden", "scroll"];
	class FmmFrameworkItemHTML {
	  constructor(wrapperClass) {
	    this.wrapperClass = wrapperClass;
	    if (!wrapperClass)
	      throw new Error("FmmFrameworkItemBase requires wrapperClass");
	  }
	  destructor() {
	  }
	  getEnvelope(_, e, label) {
	    let p = e.parentElement;
	    while (p && p.tagName !== "FORM" && !p.classList.contains(this.wrapperClass))
	      p = p.parentElement;
	    if (p && p.tagName !== "FORM")
	      return p;
	    if (!label)
	      return void 0;
	    p = label.parentElement;
	    while (p && p.tagName !== "FORM" && !p.classList.contains(this.wrapperClass))
	      p = p.parentElement;
	    return p && p.tagName !== "FORM" ? p : void 0;
	  }
	  getError(_, _e, _n, _v) {
	    return "";
	  }
	  getLabel(_, envelope) {
	    return envelope.querySelector("LABEL") || envelope.querySelector("[aria-label]");
	  }
	  getValue(_, _e, _n, _l) {
	    return "";
	  }
	}
	const _FmmStoreHTML = class extends FmmStoreBase {
	  constructor() {
	    super(...arguments);
	    this.listener = this.notifyMinimaps.bind(this);
	  }
	  createStoreItem(_, e) {
	    const tag = e.tagName;
	    if (tag === "INPUT") {
	      const ie = e;
	      return _FmmStoreHTML.INPUTTYPES.includes(ie.type) ? new StoreItemInput(ie, this.listener) : void 0;
	    }
	    if (tag === "SELECT")
	      return new StoreItemSelect(e, this.listener);
	    if (tag === "TEXTAREA")
	      return new StoreItemTextArea(e, this.listener);
	    return void 0;
	  }
	  getError(_, i, _hasValue) {
	    return i.fe.validationMessage || i.fe.required && !i.fe.value && "Required" || "";
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
	};
	let FmmStoreHTML = _FmmStoreHTML;
	FmmStoreHTML.INPUTTYPES = [
	  "checkbox",
	  "color",
	  "date",
	  "datetime",
	  "datetime-local",
	  "email",
	  "month",
	  "number",
	  "password",
	  "radio",
	  "range",
	  "search",
	  "tel",
	  "text",
	  "time",
	  "url",
	  "week"
	];
	class FrameworkItemB4 extends FmmFrameworkItemHTML {
	  constructor(wrapperClass) {
	    super(wrapperClass);
	  }
	  getError(_, e, _n, _v) {
	    if (!e.classList.contains("is-invalid"))
	      return "";
	    for (let s = e.nextElementSibling; s && s !== e; s = s.nextElementSibling) {
	      if (s.classList.contains("invalid-feedback"))
	        return s.textContent || "";
	    }
	    return "";
	  }
	}
	const G$1 = {
	  B4_Check: new FrameworkItemB4("form-check"),
	  B4_Other: new FrameworkItemB4("form-group")
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
	    return this.fe.value || void 0;
	  }
	  isDisabled() {
	    return this.fe.disabled;
	  }
	}
	class StoreItemInput extends StoreItem {
	  constructor(e, listener) {
	    super(e, "input", listener);
	  }
	}
	class StoreItemSelect extends StoreItem {
	  constructor(e, listener) {
	    super(e, "change", listener);
	    this.e = e;
	    this.isMultiple = e.multiple;
	  }
	  getValue() {
	    const index = this.e.selectedIndex;
	    if (index < 0)
	      return void 0;
	    if (!this.isMultiple)
	      return [index];
	    const indexes = [];
	    const options = this.e.options;
	    for (let i = options.length; --i >= index; )
	      if (options[i].selected)
	        indexes.push(i);
	    return indexes.reverse();
	  }
	}
	class StoreItemTextArea extends StoreItem {
	  constructor(e, listener) {
	    super(e, "input", listener);
	    this.e = e;
	  }
	}

	class Fmm {
	  static createMinimap(p, parent, ef) {
	    const err = "FmmMinimap not created: invalid ";
	    if (parent) {
	      const panel = new Panel(ef || G.EF, true, parent);
	      return panel.createMinimap({ ...p, anchor: void 0, usePanelDetail: true });
	    } else {
	      if (!p.anchor)
	        throw new Error(err + "anchor");
	      const panel = new Panel(ef || G.EF, false);
	      return panel.createMinimap({ ...p, usePanelDetail: false });
	    }
	  }
	  static createPanel(parent, detailParent, vertical, ef) {
	    const err = "FmmPanel not created: invalid ";
	    if (!parent)
	      throw new Error(err + "parent");
	    return new Panel(ef || G.EF, !!vertical, parent, detailParent);
	  }
	  static trim(s) {
	    return s?.trim().replace(/\u200B/g, "");
	  }
	}
	Fmm.CLASS = Object.freeze({
	  Detached: "fmm-detached",
	  DetailPopup: "fmm-detail",
	  Disabled: "fmm-disabled",
	  Error: "fmm-error",
	  Fieldset: "fmm-fieldset",
	  Header: "fmm-header",
	  Invalid: "fmm-invalid",
	  Legend: "fmm-legend",
	  MinimapFrame: "fmm-frame",
	  MinimapPopup: "fmm-popup",
	  Optional: "fmm-optional",
	  Pushpin: "fmm-pushpin",
	  Required: "fmm-required",
	  Title: "fmm-title",
	  Valid: "fmm-valid",
	  Value: "fmm-value"
	});
	Fmm.CSS = `
	circle.fmm-pushpin {
		fill: blue;
	}
	div.fmm-detail,
	div.fmm-popup {
		background-color: darkgray;
		border: 1px solid black;
		box-shadow: 5px 5px lightgray;
		padding-top: 10px;
		z-index: 1;
	}
	div.fmm-disabled {
		background-color: darkgray;
	}
	div.fmm-disabled,
	div.fmm-invalid,
	div.fmm-optional,
	div.fmm-required,
	div.fmm-valid {
		border: 1px solid transparent;
	}
	div.fmm-frame {
		background-color: white;
	}
	div.fmm-header {
		border-bottom: 5px groove;
		margin: 0;
	}
	div.fmm-invalid {
		background-color: red;
	}
	div.fmm-optional {
		border-color: black;
	}
	div.fmm-required {
		border-color: red;
	}
	div.fmm-valid {
		background-color: green;
	}
	fieldset.fmm-fieldset {
		background-color: white;
		border-top: 5px groove;
		min-width: 0;
		padding: 5px 10px;
	}
	fieldset.fmm-fieldset div.fmm-disabled,
	fieldset.fmm-fieldset div.fmm-invalid,
	fieldset.fmm-fieldset div.fmm-optional,
	fieldset.fmm-fieldset div.fmm-required,
	fieldset.fmm-fieldset div.fmm-valid {
		border-width: 2px;
	}
	label.fmm-title {
		font-size: smaller;
		padding: 2px;
	}
	legend.fmm-legend {
		background-color: white;
		margin: 5px;
		max-width: 100%;
		padding-right: 5px;
	}
	textarea.fmm-value {
		height: 3em;
		width: 100%;
	}
	div.fmm-detached.fmm-popup,
	div.fmm-detached div.fmm-detail {
		background-color: lightgray;
	}
	div.fmm-detached.fmm-frame,
	div.fmm-detached div.fmm-frame,
	div.fmm-detached fieldset.fmm-fieldset,
	iv.fmm-detached legend.fmm-legend {
		background-color: lightgray !important;
	}
	`;
	Fmm.STATUS_CLASS = Object.freeze({
	  Disabled: "fmm-disabled",
	  Invalid: "fmm-invalid",
	  Optional: "fmm-optional",
	  Required: "fmm-required",
	  Valid: "fmm-valid"
	});
	class ClipContext {
	  constructor(form, e, parent) {
	    this.parent = parent;
	    this.clip = parent?.clipRect(form.getRect(e)) || form.getRect(e);
	    this.clipX = form.clipsContentX(e);
	    this.clipY = form.clipsContentY(e);
	  }
	  clipRect(rect) {
	    const left = Math.max(rect.left, this.clip.left);
	    const top = Math.max(rect.top, this.clip.top);
	    const width = Math.max(0, (this.clipX ? Math.min(rect.right, this.clip.right) : rect.right) - left);
	    const height = Math.max(0, (this.clipY ? Math.min(rect.bottom, this.clip.bottom) : rect.bottom) - top);
	    const clipped = { left, top, width, height, right: left + width, bottom: top + height };
	    return width && height && this.parent ? this.parent.clipRect(clipped) : clipped;
	  }
	}
	class Debouncer {
	  constructor(debounceMsec, task) {
	    this.debounceMsec = debounceMsec;
	    this.task = task;
	    this._doTask = this.doTask.bind(this);
	    this.notBeforeMsec = 0;
	  }
	  destructor() {
	    if (!this.task)
	      return;
	    if (this.timer)
	      window.clearTimeout(this.timer);
	    this.timer = void 0;
	  }
	  cancel() {
	    if (!this.timer)
	      return false;
	    window.clearTimeout(this.timer);
	    this.timer = void 0;
	    return true;
	  }
	  doNow() {
	    if (!this.task)
	      return;
	    this.cancel();
	    this.task();
	  }
	  schedule() {
	    if (!this.task)
	      return;
	    this.notBeforeMsec = Date.now() + this.debounceMsec;
	    if (!this.timer)
	      this.timer = window.setTimeout(this._doTask, this.debounceMsec);
	  }
	  doTask() {
	    const tooEarlyMsec = this.notBeforeMsec - Date.now();
	    if (tooEarlyMsec > 0) {
	      this.timer = window.setTimeout(this._doTask, tooEarlyMsec);
	    } else {
	      this.timer = void 0;
	      this.task();
	    }
	  }
	}
	class Detail {
	  constructor(ef, parent) {
	    this.data = Snapshot.NULLDATA;
	    this.minimapId = 0;
	    const fieldset = this.e = ef.createElement("FIELDSET");
	    fieldset.className = Fmm.CLASS.Fieldset;
	    const legend = G.ELLIPSIS(ef.createElement("LEGEND"));
	    legend.className = Fmm.CLASS.Legend;
	    this.status = legend.appendChild(ef.createElement("DIV"));
	    this.status.style.display = "inline-block";
	    this.status.style.margin = "3px 6px 0 3px";
	    this.status.style.height = "0.7em";
	    this.status.style.width = "1em";
	    this.label = legend.appendChild(ef.createElement("SPAN"));
	    this.label.textContent = G.NBSP;
	    fieldset.appendChild(legend);
	    this.value = fieldset.appendChild(ef.createElement("TEXTAREA"));
	    this.value.className = Fmm.CLASS.Value;
	    this.value.readOnly = true;
	    this.error = G.ELLIPSIS(fieldset.appendChild(ef.createElement("DIV")));
	    this.error.className = Fmm.CLASS.Error;
	    this.error.textContent = G.NBSP;
	    if (parent)
	      parent.appendChild(fieldset);
	  }
	  destructor() {
	    if (this.e.parentElement)
	      this.e.parentElement.removeChild(this.e);
	  }
	  clear(onlyIfShowingThisData) {
	    if (onlyIfShowingThisData && onlyIfShowingThisData !== this.data)
	      return;
	    this.error.textContent = this.label.textContent = G.NBSP;
	    this.status.className = this.value.placeholder = this.value.value = "";
	    this.data = Snapshot.NULLDATA;
	  }
	  refreshDisplay(minimapId) {
	    if (minimapId !== this.minimapId)
	      return;
	    const data = this.data;
	    const labelPrefix = data.aggregateLabel?.concat(": ") || "";
	    this.error.textContent = this.error.title = data.error || G.NBSP;
	    this.label.textContent = this.label.title = labelPrefix + data.label || G.NBSP;
	    this.status.className = Fmm.STATUS_CLASS[data.status];
	    this.value.placeholder = data.placeholder || "";
	    this.value.value = data.aggregateValues?.join("\n") || data.value || "";
	  }
	  setDisplay(minimapId, newData) {
	    this.data = newData || Snapshot.NULLDATA;
	    this.refreshDisplay(this.minimapId = minimapId);
	  }
	}
	const _FormStoreItem = class {
	  constructor(name, e, storeItem, p) {
	    this.e = e;
	    this.storeItem = storeItem;
	    const label = p.form.getLabelFor(e);
	    this.dynamicLabel = p.dynamicLabels.includes(name);
	    this.form = p.form;
	    this.framework = p.framework?.createFrameworkItem(name, e) || _FormStoreItem.DEFAULT_FRAMEWORK;
	    this.envelope = this.framework.getEnvelope(name, e, label) || this.getCommonAncestor(e, label) || e;
	    this.label = label || this.framework.getLabel(name, this.envelope);
	    this.snapshot = new Snapshot(name, p);
	  }
	  destructor() {
	    this.framework.destructor();
	    this.storeItem.destructor();
	  }
	  layoutSnapshot(ancestors, pageRect, scale) {
	    const parent = this.form.getParent(this.envelope);
	    if (!parent)
	      return this.snapshot.setRect();
	    const clipContext = ancestors.get(parent) || this.getClipContext(parent, ancestors);
	    const rect = clipContext.clipRect(this.form.getRect(this.envelope));
	    if (!rect.width || !rect.height)
	      return this.snapshot.setRect();
	    const left = Math.floor((rect.left - pageRect.left) * scale);
	    const top = Math.floor((rect.top - pageRect.top) * scale);
	    const height = Math.max(2, Math.floor(rect.height * scale));
	    const width = Math.max(2, Math.floor(rect.width * scale));
	    return this.snapshot.setRect(new DOMRectReadOnly(left, top, width, height));
	  }
	  removeIfDetached() {
	    if (this.form.getParent(this.envelope)) {
	      for (let e = this.e; e; e = this.form.getParent(e))
	        if (e === this.envelope)
	          return false;
	    }
	    this.snapshot.destructor();
	    this.destructor();
	    return true;
	  }
	  takeSnapshot(form, store) {
	    const data = this.snapshot.data;
	    const name = data.name;
	    if (data.label === void 0 || this.dynamicLabel) {
	      data.label = Fmm.trim(form.getDisplayLabel(this.e, this.label) || name);
	      data.placeholder = Fmm.trim(this.form.getPlaceholder(this.e));
	    }
	    let displayValue = Fmm.trim(this.framework.getValue(name, this.e, this.envelope, data.label));
	    if (!displayValue) {
	      const rawValue = store.getValue(form, this.storeItem);
	      if (rawValue)
	        displayValue = Fmm.trim(form.getDisplayValue(this.e, data.label, rawValue));
	    }
	    data.value = displayValue;
	    const hasValue = !!displayValue;
	    if (hasValue && data.aggregateValues)
	      data.aggregateValues.push(displayValue);
	    data.error = Fmm.trim(this.framework.getError(name, this.e, this.envelope, hasValue) || store.getError(form, this.storeItem, hasValue));
	    if (store.isDisabled(form, this.storeItem)) {
	      this.snapshot.setStatus("Disabled");
	    } else if (hasValue) {
	      this.snapshot.setStatus(data.error ? "Invalid" : "Valid");
	    } else {
	      this.snapshot.setStatus(data.error ? "Required" : "Optional");
	    }
	    return data;
	  }
	  getClipContext(e, ancestors) {
	    const parent = this.form.getParent(e);
	    const parentContext = parent ? ancestors.get(parent) || this.getClipContext(parent, ancestors) : void 0;
	    const clipContext = new ClipContext(this.form, e, parentContext);
	    ancestors.set(e, clipContext);
	    return clipContext;
	  }
	  getCommonAncestor(e, label) {
	    const labelAncestors = [];
	    for (; label; label = this.form.getParent(label))
	      labelAncestors.push(label);
	    while (e && !labelAncestors.includes(e))
	      e = this.form.getParent(e);
	    return e;
	  }
	};
	let FormStoreItem = _FormStoreItem;
	FormStoreItem.DEFAULT_FRAMEWORK = {
	  destructor: () => void 0,
	  getEnvelope: (_, _e, _l) => void 0,
	  getError: (_, _e, _n, _v) => "",
	  getLabel: (_, _e) => void 0,
	  getValue: (_, _e, _n, _l) => ""
	};
	const _FormStoreItems = class {
	  constructor() {
	    this.list = [];
	    this.ignore = new WeakSet();
	    this.nameCounter = 0;
	  }
	  destructor() {
	    this.ignore = new WeakSet();
	    this.list.splice(0).forEach((fw) => fw.destructor());
	  }
	  compose(p) {
	    const elements = p.form.getElements(p.customElementIds);
	    const prev = this.list.splice(0);
	    prev.forEach((fw) => fw.removeIfDetached() || this.list.push(fw));
	    const processed = new WeakSet();
	    this.list.forEach((fw) => processed.add(fw.e));
	    elements.forEach((e) => {
	      if (processed.has(e) || this.ignore.has(e))
	        return void 0;
	      if (p.form.isHidden(e))
	        return this.ignore.add(e);
	      const storeItem = p.store.createStoreItem(p.form, e);
	      if (storeItem) {
	        const name = p.store.getName(p.form, storeItem) || _FormStoreItems.NAMEPREFIX + String(this.nameCounter++);
	        this.list.push(new FormStoreItem(name, e, storeItem, p));
	      }
	      processed.add(e);
	    });
	  }
	  layoutSnapshots(ancestors, pageRect, scale) {
	    this.list.forEach((fw) => fw.layoutSnapshot(ancestors, pageRect, scale));
	  }
	  takeSnapshots(form, store) {
	    return this.list.map((fw) => fw.takeSnapshot(form, store));
	  }
	};
	let FormStoreItems = _FormStoreItems;
	FormStoreItems.NAMEPREFIX = "$FmmFSI";
	const _Frame = class {
	  constructor(ef, status, minimapTitle, anchor) {
	    this.dragData = "";
	    const div = this.div = ef.createElement("DIV");
	    div.className = Fmm.CLASS.MinimapFrame;
	    div.draggable = true;
	    div.ondragstart = this.onDragStart.bind(this);
	    div.style.cursor = "grab";
	    div.style.position = "relative";
	    const header = this.header = div.appendChild(ef.createElement("DIV"));
	    header.className = Fmm.CLASS.Header;
	    header.style.overflow = "hidden";
	    header.style.whiteSpace = "nowrap";
	    const title = G.ELLIPSIS(ef.createElement("LABEL"));
	    title.className = Fmm.CLASS.Title;
	    title.style.cursor = "inherit";
	    title.textContent = title.title = minimapTitle;
	    const statusStyle = status.style;
	    if (anchor) {
	      statusStyle.position = "absolute";
	      statusStyle.top = statusStyle.bottom = statusStyle.left = statusStyle.right = "0";
	      if (!_Frame.POSITIONS.includes(anchor.style.position))
	        anchor.style.position = "relative";
	      anchor.appendChild(status);
	      this.popup = new Popup(ef, Fmm.CLASS.MinimapPopup, this.div, status);
	      let prev = status.previousElementSibling;
	      while (prev && !prev.className.includes("fmm-"))
	        prev = prev.previousElementSibling;
	      if (prev)
	        anchor.removeChild(prev);
	      this.setDestroyOnDetachFromDOM(anchor, status);
	    } else {
	      header.appendChild(status);
	      statusStyle.display = "inline-block";
	      statusStyle.margin = "1px 2px 0 1px";
	      statusStyle.height = "0.5em";
	      statusStyle.width = "0.8em";
	    }
	    header.appendChild(title);
	  }
	  destructor() {
	    if (!this.div.parentElement)
	      return;
	    this.detach();
	    if (this.popup)
	      this.popup.destructor();
	    this.popup = void 0;
	    this.div.onmouseenter = this.div.onmouseleave = null;
	    this.div.parentElement?.removeChild(this.div);
	  }
	  detach() {
	    if (this.popup)
	      this.div.parentElement?.classList.add(Fmm.CLASS.Detached);
	    else
	      this.div.classList.add(Fmm.CLASS.Detached);
	  }
	  newDetailPopup(ef, detail) {
	    return new Popup(ef, Fmm.CLASS.DetailPopup, detail.e, this.div);
	  }
	  setSnapshotResult(result) {
	    this.dragData = JSON.stringify(result);
	  }
	  onDragStart(ev) {
	    ev.dataTransfer?.setData("text/plain", this.dragData);
	  }
	  setDestroyOnDetachFromDOM(anchor, status) {
	    new MutationObserver((_, observer) => {
	      if (status.parentElement === anchor)
	        return;
	      observer.disconnect();
	      this.destructor();
	    }).observe(anchor, { childList: true });
	  }
	};
	let Frame = _Frame;
	Frame.POSITIONS = ["absolute", "fixed", "relative", "sticky"];
	const G = {
	  EF: {
	    createElement: (t) => document.createElement(t),
	    createElementNS: (n, q) => document.createElementNS(n, q)
	  },
	  ELLIPSIS: (e) => {
	    e.style.overflow = "hidden";
	    e.style.textOverflow = "ellipsis";
	    e.style.whiteSpace = "nowrap";
	    return e;
	  },
	  NBSP: "\xA0",
	  NOP: () => {
	  }
	};
	const _Minimap = class {
	  constructor(p, panel) {
	    this.onUpdateBeingCalled = false;
	    this.pendingCompose = false;
	    this.pendingLayout = false;
	    this.pendingSnapshot = false;
	    const ef = panel.ef;
	    this.anchored = !!p.anchor;
	    const status = ef.createElement("DIV");
	    this.summaryData = { ...Snapshot.NULLDATA, label: p.title };
	    this.title = p.title;
	    const frame = new Frame(ef, status, this.title, p.anchor);
	    if (this.anchored)
	      panel.add(this, frame.div);
	    frame.div.onmouseenter = this.onFrameEnter.bind(this);
	    frame.div.onmouseleave = this.onFrameLeave.bind(this);
	    if (this.anchored && p.zoomFactor && frame.popup)
	      frame.popup.setZoomable(this, frame.header, Math.min(_Minimap.MAX_ZOOMFACTOR, Math.max(0, p.zoomFactor)));
	    frame.header.onmouseenter = this.onHeaderEnter.bind(this);
	    const snapshotsPanel = new SnapshotsPanel(ef, frame.div);
	    this.minimapId = _Minimap.idCounter++;
	    this.useWidthToScale = !!p.useWidthToScale;
	    this.verbosity = p.verbosity || 0;
	    this.d = {
	      clipContextAncestors: new WeakMap(),
	      doUpdates: new Debouncer(p.debounceMsec || _Minimap.DEFAULT_DEBOUNCEMSEC, () => this.doPendingUpdates()),
	      onUpdate: p.onUpdate || _Minimap.ONUPDATE,
	      paramUpdates: {
	        aggregateLabels: p.aggregateLabels || {},
	        aggregateValuesMap: {},
	        customElementIds: [],
	        dynamicLabels: p.dynamicLabels || [],
	        ef: panel.ef,
	        form: p.form,
	        framework: p.framework,
	        snapshotUpcall: {
	          hideDetail: this.snapshotHidden.bind(this),
	          showDetail: this.snapshotActive.bind(this)
	        },
	        snapshotsPanel,
	        store: p.store || new FmmStoreHTML()
	      },
	      storeItems: new FormStoreItems()
	    };
	    const detail = p.usePanelDetail && panel.detail || new Detail(ef);
	    this.z = {
	      detail,
	      detailPopup: detail === panel.detail ? void 0 : this.anchored ? frame.newDetailPopup(ef, detail) : panel.newDetailPopup(detail),
	      frame,
	      panel,
	      pin: new PushPin(ef, frame.div),
	      snapshotsPanel,
	      status
	    };
	    status.onmouseover = this.onStatusEnter.bind(this);
	    this.d.paramUpdates.store.notifyMinimapOnUpdate(this, true);
	    this.d.paramUpdates.form.setLayoutHandler(this);
	  }
	  static ONUPDATE(_) {
	  }
	  destructor() {
	    this.detach();
	    const z = this.z;
	    if (!z)
	      return;
	    this.z = void 0;
	    z.status.parentElement?.removeChild(z.status);
	    z.snapshotsPanel.destructor();
	    z.pin.destructor();
	    z.frame.destructor();
	    if (z.detail !== z.panel.detail)
	      z.detail.destructor();
	    if (z.detailPopup)
	      z.detailPopup.destructor();
	    z.panel.remove(this);
	  }
	  compose(customElementIds) {
	    if (!this.d)
	      return;
	    this.d.paramUpdates.customElementIds = customElementIds || [];
	    this.pendingCompose = this.pendingLayout = true;
	    this.takeSnapshot();
	  }
	  get isDetached() {
	    return this.d === void 0;
	  }
	  get isPinned() {
	    return this.z?.pin.isPinned;
	  }
	  get isPinnedToPanelDetail() {
	    return this.isPinned && this.z?.detail === this.z?.panel.detail;
	  }
	  detach() {
	    const d = this.d;
	    const z = this.z;
	    if (!d || !z)
	      return;
	    this.d = void 0;
	    d.doUpdates.destructor();
	    this.pendingCompose = this.pendingLayout = false;
	    this.pendingSnapshot = true;
	    this.doPendingUpdates();
	    z.frame.detach();
	    d.paramUpdates.form.clearLayoutHandler();
	    d.paramUpdates.store.notifyMinimapOnUpdate(this, false);
	    d.storeItems.destructor();
	  }
	  handleLayout(e) {
	    if (!e || this.d?.clipContextAncestors.has(e)) {
	      this.pendingLayout = true;
	      this.d?.doUpdates.schedule();
	    }
	  }
	  layout(zoomEvent) {
	    const d = this.d;
	    const z = this.z;
	    if (!d || !z)
	      return;
	    const tStart = zoomEvent && this.verbosity ? Date.now() : 0;
	    const pageRect = d.paramUpdates.form.getRect();
	    if (pageRect?.height && pageRect.width) {
	      d.clipContextAncestors = new WeakMap();
	      const scale = z.snapshotsPanel.computeScale(pageRect, z.frame, this.useWidthToScale);
	      z.snapshotsPanel.show(false);
	      d.storeItems.layoutSnapshots(d.clipContextAncestors, pageRect, scale);
	      z.snapshotsPanel.show(true);
	      if (zoomEvent) {
	        z.pin.trackOff(z.frame);
	        z.pin.trackOn(z.snapshotsPanel, zoomEvent);
	      }
	    }
	    if (zoomEvent && this.verbosity)
	      console.log("FormMinimap[" + this.title + "] Layout(ms)=" + String(Date.now() - tStart));
	  }
	  notifyMinimap(_, _on) {
	  }
	  onFrameEnter(ev) {
	    const z = this.z;
	    if (!z)
	      return;
	    if (!this.isPinned)
	      z.pin.trackOn(z.snapshotsPanel, ev);
	    if (this.activeSnapshot)
	      z.detail.setDisplay(this.minimapId, this.activeSnapshot);
	    if (!this.anchored)
	      this.showPopups();
	  }
	  onFrameLeave() {
	    const z = this.z;
	    if (!z || this.isPinned)
	      return;
	    z.pin.trackOff(z.frame);
	    z.detail.clear(this.activeSnapshot);
	    if (z.detailPopup)
	      z.detailPopup.hide();
	    else
	      z.panel.hideDetailPopup();
	    if (z.frame.popup)
	      z.frame.popup.hide();
	  }
	  onHeaderEnter(ev) {
	    ev.stopPropagation();
	    if (!this.z || this.isPinned)
	      return;
	    this.activeSnapshot = void 0;
	    this.z.detail.setDisplay(this.minimapId, this.summaryData);
	  }
	  onStatusEnter(ev) {
	    ev.stopPropagation();
	    if (this.anchored && !this.z?.frame.popup?.isShowing)
	      this.showPopups();
	  }
	  takeSnapshot() {
	    if (!this.d)
	      return false;
	    this.pendingSnapshot = true;
	    this.d.doUpdates.schedule();
	    return true;
	  }
	  doTakeSnapshot() {
	    const d = this.d;
	    const z = this.z;
	    if (!d || !z)
	      return { snapshots: [], status: "Disabled", title: this.title };
	    const p = d.paramUpdates;
	    const aggregateValues = Object.values(p.aggregateValuesMap);
	    aggregateValues.forEach((v) => v.splice(0));
	    const snapshots = d.storeItems.takeSnapshots(p.form, p.store);
	    aggregateValues.forEach((v) => v.sort());
	    const status = z.snapshotsPanel.computeStatus();
	    z.status.className = Fmm.STATUS_CLASS[status];
	    const errorsSummary = {};
	    if (status !== "Disabled")
	      snapshots.filter((s) => s.error && s.status === status).forEach((s) => errorsSummary[s.aggregateLabel || s.label] = s.error);
	    this.summaryData.aggregateValues = Object.keys(errorsSummary).sort().map((key) => key + ": " + errorsSummary[key]);
	    this.summaryData.status = status;
	    return { snapshots, status, title: this.title };
	  }
	  doPendingUpdates() {
	    const d = this.d;
	    const z = this.z;
	    if (!d || !z)
	      return;
	    const tStart = this.verbosity ? Date.now() : 0;
	    if (this.pendingCompose)
	      d.storeItems.compose(d.paramUpdates);
	    const tCompose = this.verbosity ? Date.now() : 0;
	    if (this.pendingLayout)
	      this.layout();
	    const tLayout = this.verbosity ? Date.now() : 0;
	    let tUpdate = tLayout;
	    if (this.pendingSnapshot) {
	      const result = this.doTakeSnapshot();
	      z.frame.setSnapshotResult(result);
	      if (this.verbosity)
	        tUpdate = Date.now();
	      z.detail.refreshDisplay(this.minimapId);
	      if (!this.onUpdateBeingCalled) {
	        this.onUpdateBeingCalled = true;
	        d.onUpdate(result);
	        this.onUpdateBeingCalled = false;
	      }
	    }
	    if (this.verbosity) {
	      const lCompose = this.pendingCompose ? " Compose(ms)=" + String(tCompose - tStart) : "";
	      const lLayout = this.pendingLayout ? " Layout(ms)=" + String(tLayout - tCompose) : "";
	      const lSnapshot = this.pendingSnapshot ? " Snapshot(ms)=" + String(tUpdate - tLayout) : "";
	      if (lCompose || lLayout || lSnapshot)
	        console.log("FormMinimap[" + this.title + "]" + lCompose + lLayout + lSnapshot);
	    }
	    this.pendingCompose = this.pendingLayout = this.pendingSnapshot = false;
	  }
	  showPopups() {
	    const z = this.z;
	    if (!z)
	      return;
	    if (this.d)
	      this.d.doUpdates.doNow();
	    if (z.frame.popup)
	      z.frame.popup.show(true);
	    if (z.detailPopup)
	      z.detailPopup.show(false);
	    else
	      z.panel.showDetailPopup();
	  }
	  snapshotActive(data) {
	    if (!this.isPinned)
	      this.z?.detail.setDisplay(this.minimapId, this.activeSnapshot = data);
	  }
	  snapshotHidden(e, data) {
	    const z = this.z;
	    if (!z)
	      return;
	    if (this.activeSnapshot === data)
	      this.activeSnapshot = void 0;
	    z.detail.clear(data);
	    z.pin.trackOff(z.frame, e);
	  }
	};
	let Minimap = _Minimap;
	Minimap.DEFAULT_DEBOUNCEMSEC = 200;
	Minimap.MAX_ZOOMFACTOR = 5;
	Minimap.idCounter = 0;
	class Panel {
	  constructor(ef, vertical, parent, detailParent) {
	    this.ef = ef;
	    this.vertical = vertical;
	    this.minimaps = [];
	    if (parent) {
	      this.detail = new Detail(this.ef, detailParent);
	      this.popupParent = parent.appendChild(this.ef.createElement("DIV"));
	      const popupParentStyle = this.popupParent.style;
	      popupParentStyle.position = "relative";
	      if (!detailParent)
	        this.detailPopup = this.newDetailPopup(this.detail);
	      this.div = parent.appendChild(this.ef.createElement("DIV"));
	      const divStyle = this.div.style;
	      divStyle.height = divStyle.width = "100%";
	      divStyle.overflowX = vertical ? "hidden" : "scroll";
	      divStyle.overflowY = vertical ? "scroll" : "hidden";
	      divStyle.whiteSpace = vertical ? "none" : "nowrap";
	    }
	  }
	  destructor() {
	    if (this.detail)
	      this.detail.destructor();
	    if (this.detailPopup)
	      this.detailPopup.destructor();
	    this.minimaps.splice(0).forEach((m) => m.destructor());
	  }
	  add(minimap, frame) {
	    if (frame && this.div) {
	      this.div.appendChild(frame);
	      frame.style.height = frame.style.width = "100%";
	      frame.style.display = this.vertical ? "block" : "inline-block";
	      frame.scrollIntoView();
	    }
	    this.minimaps.push(minimap);
	  }
	  createMinimap(p) {
	    const err = "FmmMinimap <" + p.title + "> not created: invalid ";
	    if (!p.form)
	      throw new Error(err + "form");
	    return new Minimap(p, this);
	  }
	  destroyDetached() {
	    this.minimaps.filter((m) => m.isDetached).forEach((m) => m.destructor());
	  }
	  hideDetailPopup() {
	    if (this.detailPopup && !this.minimaps.find((m) => m.isPinnedToPanelDetail))
	      this.detailPopup.hide();
	  }
	  newDetailPopup(detail) {
	    return this.popupParent ? new Popup(this.ef, Fmm.CLASS.DetailPopup, detail.e, this.popupParent) : void 0;
	  }
	  remove(minimap) {
	    const index = this.minimaps.findIndex((m) => m === minimap);
	    if (index >= 0)
	      this.minimaps.splice(index, 1);
	  }
	  showDetailPopup() {
	    if (this.detailPopup)
	      this.detailPopup.show(false);
	  }
	}
	class Popup {
	  constructor(ef, className, content, parent) {
	    this.div = parent.appendChild(ef.createElement("DIV"));
	    this.div.className = className;
	    this.div.style.display = "none";
	    this.div.style.position = "absolute";
	    this.div.appendChild(content);
	    parent.style.overflow = "visible";
	    content.style.display = "block";
	    content.style.position = "relative";
	  }
	  destructor() {
	    if (this.div.parentElement)
	      this.div.parentElement.removeChild(this.div);
	  }
	  get isShowing() {
	    return this.div.style.display !== "none";
	  }
	  getElementSize(e) {
	    const style = this.div.style;
	    if (style.display !== "none") {
	      const rect = this.div.getBoundingClientRect();
	      const eRect = e.getBoundingClientRect();
	      return [rect.height - (eRect.top - rect.top), rect.width - (eRect.left - rect.left)];
	    }
	    style.visibility = "hidden";
	    style.display = "block";
	    const rect1 = this.div.getBoundingClientRect();
	    const eRect1 = e.getBoundingClientRect();
	    style.display = "none";
	    style.visibility = "visible";
	    return [rect1.height - (eRect1.top - rect1.top), rect1.width - (eRect1.left - rect1.left)];
	  }
	  hide() {
	    this.div.style.display = "none";
	  }
	  setZoomable(minimap, trigger, zoomFactor) {
	    let isZoomed = false;
	    let unzoomedHeight = 0;
	    let unzoomedWidth = 0;
	    trigger.style.cursor = "zoom-in";
	    trigger.onclick = (ev) => {
	      if (ev.button !== 0)
	        return;
	      ev.stopPropagation();
	      if (!unzoomedHeight) {
	        const rect = this.div.getBoundingClientRect();
	        unzoomedHeight = rect.height;
	        unzoomedWidth = rect.width;
	      }
	      if (minimap.useWidthToScale)
	        this.div.style.width = String(isZoomed ? unzoomedWidth : unzoomedWidth * zoomFactor) + "px";
	      else
	        this.div.style.height = String(isZoomed ? unzoomedHeight : unzoomedHeight * zoomFactor) + "px";
	      minimap.layout(ev);
	      isZoomed = !isZoomed;
	      trigger.style.cursor = isZoomed ? "zoom-out" : "zoom-in";
	    };
	  }
	  show(anchoredAtParentCenter) {
	    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	    const style = this.div.style;
	    if (style.display !== "none")
	      return;
	    style.left = style.bottom = "auto";
	    style.right = anchoredAtParentCenter ? "50%" : "105%";
	    style.top = anchoredAtParentCenter ? "50%" : "0";
	    style.visibility = "hidden";
	    style.display = "block";
	    const rect = this.div.getBoundingClientRect();
	    if (rect.left < 0) {
	      style.left = anchoredAtParentCenter ? "50%" : "105%";
	      style.right = "auto";
	      const rectL = this.div.getBoundingClientRect();
	      if (viewportWidth - rectL.left - rectL.width < rect.left) {
	        style.left = "auto";
	        style.right = anchoredAtParentCenter ? "50%" : "105%";
	      }
	    }
	    if (rect.bottom > viewportHeight) {
	      style.bottom = anchoredAtParentCenter ? "50%" : "0";
	      style.top = "auto";
	      const rectB = this.div.getBoundingClientRect();
	      if (rectB.top + rectB.height - viewportHeight > rect.bottom) {
	        style.bottom = "auto";
	        style.top = anchoredAtParentCenter ? "50%" : "0";
	      }
	    }
	    style.visibility = "visible";
	  }
	}
	class PushPin {
	  constructor(ef, parent) {
	    this.SIZE = 24;
	    this.parentCursor = "none";
	    this.pinned = false;
	    const uri = "http://www.w3.org/2000/svg";
	    const svg = parent.appendChild(ef.createElementNS(uri, "svg"));
	    this.svg = svg;
	    parent.style.overflow = "visible";
	    svg.setAttribute("height", String(this.SIZE));
	    svg.setAttribute("width", String(this.SIZE));
	    const radius = this.SIZE / 4;
	    const circle = svg.appendChild(ef.createElementNS(uri, "circle"));
	    circle.setAttribute("class", Fmm.CLASS.Pushpin);
	    circle.setAttribute("cx", String(this.SIZE - radius));
	    circle.setAttribute("cy", String(radius));
	    circle.setAttribute("r", String(radius));
	    const polygon = svg.appendChild(ef.createElementNS(uri, "polygon"));
	    [
	      [this.SIZE / 2 + 1, Math.ceil(radius * 1.5)],
	      [0, this.SIZE],
	      [Math.ceil(this.SIZE * 0.6), radius * 2 - 1]
	    ].forEach(([x, y]) => {
	      const point = this.svg.createSVGPoint();
	      point.x = x;
	      point.y = y;
	      polygon.points.appendItem(point);
	    });
	    polygon.setAttribute("style", "fill:black");
	    svg.style.display = "none";
	    svg.style.position = "absolute";
	  }
	  destructor() {
	    this.trackOff();
	  }
	  get isPinned() {
	    return this.pinned;
	  }
	  trackOff(frame, onlyIfParentedByE) {
	    const parent = this.svg.parentNode;
	    if (onlyIfParentedByE && onlyIfParentedByE !== parent)
	      return;
	    this.pinned = false;
	    this.svg.style.display = "none";
	    parent.onclick = parent.onmousemove = null;
	    parent.style.cursor = this.parentCursor;
	    if (frame)
	      frame.div.appendChild(this.svg);
	    else
	      parent.removeChild(this.svg);
	  }
	  trackOn(snapshots, mev) {
	    const parent = this.svg.parentNode;
	    const rect = parent.getBoundingClientRect();
	    parent.appendChild(this.svg);
	    this.parentCursor = parent.style.cursor;
	    this.svg.style.zIndex = String(+parent.style.zIndex + 1);
	    parent.onclick = (ev) => {
	      if (ev.button !== 0)
	        return;
	      if (this.pinned) {
	        this.pinned = false;
	        parent.style.cursor = "none";
	        parent.appendChild(this.svg);
	        this.move(ev, rect);
	      } else {
	        this.pinned = true;
	        parent.style.cursor = this.parentCursor;
	        if (snapshots.reparentPushPinToSnapshot(this.svg, ev))
	          return;
	        const left = Math.max(1, (ev.clientX - rect.left) * 100 / rect.width);
	        this.svg.style.left = String(left) + "%";
	        const bottom = Math.min(95, (rect.top + rect.height - ev.clientY) * 100 / rect.height);
	        this.svg.style.bottom = String(bottom) + "%";
	      }
	    };
	    parent.onmousemove = (ev) => this.move(ev, rect);
	    this.move(mev, rect);
	    parent.style.cursor = "none";
	    this.svg.style.display = "block";
	  }
	  move(ev, rect) {
	    if (this.pinned)
	      return;
	    const left = ev.clientX - rect.left;
	    const bottom = rect.top + rect.height - ev.clientY;
	    this.svg.style.left = String(Math.min(rect.width, Math.max(left, 0))) + "px";
	    this.svg.style.bottom = String(Math.min(rect.height, Math.max(bottom, 0))) + "px";
	  }
	}
	const _Snapshot = class {
	  constructor(name, p) {
	    const aggregateLabel = p.aggregateLabels[name];
	    if (aggregateLabel && !(name in p.aggregateValuesMap))
	      p.aggregateValuesMap[name] = [];
	    this.data = {
	      ..._Snapshot.NULLDATA,
	      aggregateLabel,
	      aggregateValues: p.aggregateValuesMap[name],
	      name
	    };
	    this.upcall = p.snapshotUpcall;
	    this.div = p.ef.createElement("DIV");
	    this.div.style.position = "absolute";
	    this.div.onmouseover = (ev) => {
	      ev.stopPropagation();
	      this.upcall.showDetail(this.data);
	    };
	    p.snapshotsPanel.addSnapshot(this, this.div);
	    this.destructor = () => {
	      this.div.onmouseover = null;
	      this.upcall.hideDetail(this.div, this.data);
	      p.snapshotsPanel.removeSnapshot(this, this.div);
	      this.destructor = G.NOP;
	    };
	  }
	  destructor() {
	  }
	  reparentPushPin(svg, x, y) {
	    const rect = this.rect;
	    if (!rect || x < rect.left || x > rect.left + rect.width)
	      return false;
	    if (y < rect.top || y > rect.top + rect.height)
	      return false;
	    this.div.appendChild(svg);
	    svg.style.left = String((x - rect.left) * 100 / rect.width) + "%";
	    svg.style.bottom = String((rect.top + rect.height - y) * 100 / rect.height) + "%";
	    return true;
	  }
	  setRect(rect) {
	    if (this.rect && rect && this.rect.left === rect.left && this.rect.top === rect.top && this.rect.right === rect.right && this.rect.bottom === rect.bottom)
	      return void 0;
	    this.rect = rect;
	    const style = this.div.style;
	    if (!rect) {
	      this.upcall.hideDetail(this.div, this.data);
	      return style.display = "none";
	    }
	    style.left = String(rect.left) + "px";
	    style.top = String(rect.top) + "px";
	    style.height = String(rect.height) + "px";
	    style.width = String(rect.width) + "px";
	    return style.display = "block";
	  }
	  setStatus(status) {
	    this.div.className = Fmm.STATUS_CLASS[this.data.status = status];
	  }
	};
	let Snapshot = _Snapshot;
	Snapshot.NULLDATA = {
	  aggregateLabel: "",
	  aggregateValues: void 0,
	  error: "",
	  label: "",
	  name: "",
	  placeholder: "",
	  status: "Optional",
	  value: ""
	};
	class SnapshotsPanel {
	  constructor(ef, parent) {
	    this.list = [];
	    this.div = parent.appendChild(ef.createElement("DIV"));
	    this.div.style.position = "relative";
	  }
	  destructor() {
	    if (this.div.parentElement)
	      this.div.parentElement.removeChild(this.div);
	    this.list.splice(0).forEach((snapshot) => snapshot.destructor());
	  }
	  addSnapshot(snapshot, snapshotDiv) {
	    this.list.push(snapshot);
	    this.div.appendChild(snapshotDiv);
	  }
	  computeScale(pageRect, frame, useWidthToScale) {
	    if (!this.div.parentElement)
	      return 0;
	    const [height, width] = frame.popup ? frame.popup.getElementSize(this.div) : this.getSize();
	    const hscale = height / pageRect.height;
	    const wscale = width / pageRect.width;
	    const pstyle = this.div.parentElement.style;
	    const style = this.div.style;
	    if (useWidthToScale) {
	      const heightpx = String(Math.round(pageRect.height * wscale)) + "px";
	      pstyle.width = style.width = String(width) + "px";
	      style.height = heightpx;
	      if (style.height === heightpx)
	        return wscale;
	    } else {
	      const widthpx = String(Math.round(pageRect.width * hscale)) + "px";
	      style.height = String(height) + "px";
	      pstyle.width = style.width = widthpx;
	      if (pstyle.width === widthpx && style.width === widthpx)
	        return hscale;
	    }
	    const scale = Math.min(hscale, wscale);
	    style.height = String(Math.round(pageRect.height * scale)) + "px";
	    pstyle.width = style.width = String(Math.round(pageRect.width * scale)) + "px";
	    return scale;
	  }
	  computeStatus() {
	    let allDisabled = "Disabled";
	    let anyRequired;
	    let anyValid;
	    const snapshots = this.list;
	    for (let i = snapshots.length; --i >= 0; ) {
	      const status = snapshots[i].data.status;
	      if (status === "Invalid")
	        return status;
	      if (status !== "Disabled")
	        allDisabled = void 0;
	      if (status === "Required")
	        anyRequired = status;
	      if (status === "Valid")
	        anyValid = status;
	    }
	    return anyRequired || allDisabled || anyValid || "Optional";
	  }
	  removeSnapshot(snapshot, snapshotDiv) {
	    const ix = this.list.findIndex((s) => s === snapshot);
	    if (ix < 0)
	      return;
	    this.list.splice(ix, 1);
	    this.div.removeChild(snapshotDiv);
	  }
	  reparentPushPinToSnapshot(svg, ev) {
	    const rect = this.div.getBoundingClientRect();
	    const x = ev.clientX - rect.left;
	    const y = ev.clientY - rect.top;
	    return !!this.list.find((snapshot) => snapshot.reparentPushPin(svg, x, y));
	  }
	  show(on) {
	    this.div.style.display = on ? "block" : "none";
	  }
	  getSize() {
	    const rect = this.div.getBoundingClientRect();
	    if (!this.div.parentElement)
	      return [rect.height, rect.width];
	    const pRect = this.div.parentElement.getBoundingClientRect();
	    return [pRect.height - (rect.top - pRect.top), pRect.width - (rect.left - pRect.left)];
	  }
	}

	exports.Fmm = Fmm;
	exports.FmmBootstrap4 = FmmBootstrap4;
	exports.FmmFormHTML = FmmFormHTML;
	exports.FmmFrameworkItemHTML = FmmFrameworkItemHTML;
	exports.FmmStoreBase = FmmStoreBase;
	exports.FmmStoreHTML = FmmStoreHTML;
	exports.FmmStoreImpl = FmmStoreImpl;

}));
