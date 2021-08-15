import { FmmElementFactory, FmmMinimap, FmmMinimapCreateParam, FmmPanel, FmmStatus } from './fmm';
export declare class Fmm {
    static readonly CLASS: Readonly<{
        Detached: string;
        DetailPopup: string;
        Disabled: string;
        Error: string;
        Fieldset: string;
        Header: string;
        Invalid: string;
        Legend: string;
        MinimapFrame: string;
        MinimapPopup: string;
        Optional: string;
        Pushpin: string;
        Required: string;
        Title: string;
        Valid: string;
        Value: string;
    }>;
    static readonly CSS = "\n\tcircle.fmm-pushpin {\n\t\tfill: blue;\n\t}\n\tdiv.fmm-detail,\n\tdiv.fmm-popup {\n\t\tbackground-color: darkgray;\n\t\tborder: 1px solid black;\n\t\tbox-shadow: 5px 5px lightgray;\n\t\tpadding-top: 10px;\n\t\tz-index: 1;\n\t}\n\tdiv.fmm-disabled {\n\t\tbackground-color: darkgray;\n\t}\n\tdiv.fmm-disabled,\n\tdiv.fmm-invalid,\n\tdiv.fmm-optional,\n\tdiv.fmm-required,\n\tdiv.fmm-valid {\n\t\tborder: 1px solid transparent;\n\t}\n\tdiv.fmm-frame {\n\t\tbackground-color: white;\n\t}\n\tdiv.fmm-header {\n\t\tborder-bottom: 5px groove;\n\t\tmargin: 0;\n\t}\n\tdiv.fmm-invalid {\n\t\tbackground-color: red;\n\t}\n\tdiv.fmm-optional {\n\t\tborder-color: black;\n\t}\n\tdiv.fmm-required {\n\t\tborder-color: red;\n\t}\n\tdiv.fmm-valid {\n\t\tbackground-color: green;\n\t}\n\tfieldset.fmm-fieldset {\n\t\tbackground-color: white;\n\t\tborder-top: 5px groove;\n\t\tmin-width: 0;\n\t\tpadding: 5px 10px;\n\t}\n\tfieldset.fmm-fieldset div.fmm-disabled,\n\tfieldset.fmm-fieldset div.fmm-invalid,\n\tfieldset.fmm-fieldset div.fmm-optional,\n\tfieldset.fmm-fieldset div.fmm-required,\n\tfieldset.fmm-fieldset div.fmm-valid {\n\t\tborder-width: 2px;\n\t}\n\tlabel.fmm-title {\n\t\tfont-size: smaller;\n\t\tpadding: 2px;\n\t}\n\tlegend.fmm-legend {\n\t\tbackground-color: white;\n\t\tmargin: 5px;\n\t\tmax-width: 100%;\n\t\tpadding-right: 5px;\n\t}\n\ttextarea.fmm-value {\n\t\theight: 3em;\n\t\twidth: 100%;\n\t}\n\tdiv.fmm-detached.fmm-popup,\n\tdiv.fmm-detached div.fmm-detail {\n\t\tbackground-color: lightgray;\n\t}\n\tdiv.fmm-detached.fmm-frame,\n\tdiv.fmm-detached div.fmm-frame,\n\tdiv.fmm-detached fieldset.fmm-fieldset,\n\tiv.fmm-detached legend.fmm-legend {\n\t\tbackground-color: lightgray !important;\n\t}\n\t";
    static readonly STATUS_CLASS: Record<FmmStatus, string>;
    static createMinimap(p: Readonly<FmmMinimapCreateParam>, parent?: HTMLElement, ef?: FmmElementFactory): FmmMinimap;
    static createPanel(parent: HTMLElement, detailParent?: HTMLElement, vertical?: boolean, ef?: FmmElementFactory): FmmPanel;
    static trim(s: string): string;
}
