# Form Minimap
This library displays a minimap for an HTML form.
It shows the location, value, and status message for each element in the form.
It also tries to compute the overall form status based on the constituent element statuses.

![Screenshot](docs/fmm-react-demo.png)

The minimap is especially useful for long forms which may not fit in the viewport and require scrolling to see the whole form itself.
Most pages would have only one minimap for the form, but multiple minimaps may be useful in a wizard, for example, one for each step of the wizard.
This would allow users to see the values entered in previous steps.
The ability to see off-screen form element values can be useful for context, as well as cutting and pasting.

The minimap can be set permanently visible in a panel DIV or popped up on mouse enter in a per-minimap DIV.
The details for each form element can be shown in a permanently visible shared DIV or in a popup per minimap.

The minimap reflects the aspect ratio of the form.
The height and width are adjusted to fit the dimension of the parent [panel](#fmmpanel).
When creating anchored minimaps, the boolean-valued property [useWidthToScale](#mcp-usewidthtoscale) determines whether height or width is adjusted for aspect ratio, the other value being set in CSS using the selector **.fmm-popup**.

The size of popup minimaps may be toggle zoomed by [zoomFactor](#mcp-zoomfactor) by clicking on the popup's title bar.
A popup minimap will hide itself when the mouse leaves the popup unless pinned down with the pushpin.
Hint:  when zooming back in, it may be advisable to pin the pushpin first since the mouse pointer may end up outside the popup upon resize and the popup may therefore hide itself.

When a form is destroyed, its corresponding minimap should be detached or destroyed.
The [Angular](https://www.npmjs.com/package/@eafmm/ng), [React](https://www.npmjs.com/package/@eafmm/react), and [Vue](https://www.npmjs.com/package/@eafmm/vue) components supplied with this library will detach the minimap when the component is destroyed.  This will happen when the component tag is placed inside the form.

Please feel free to play around with the [Angular](https://www.npmjs.com/package/@eafmm/ng-demo), [React](https://www.npmjs.com/package/@eafmm/react-demo), and [Vue](https://www.npmjs.com/package/@eafmm/vue-demo) demos.  Feedback is always welcome.

Limitations:
- Only form elements with an ID or NAME attribute, which are not HIDDEN, are monitored.
- Only bootstrap4, material-ui, and angular material handlers are supplied with the library, although it should be easy enough to use these as a starting point to write your own handler for other layout frameworks.
- Complicated forms may not be supported, although css display changes are handled to some extent.
- No automated testing yet.
- No WCAG accessibility yet.  It might even be better to hide the minimap and panel from screen readers since they duplicate information already in the form.

If you find this software useful, please feel free to <a href="https://www.buymeacoffee.com/sparrowhawkea"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

Thank you.

***
# Getting Started
## Installation
```bash
npm install --save @eafmm/core
```

## Example Popup Minimap
1. Create a popup [minimap](#fmmminimap) specifying an anchor DIV.
1. Destroy the minimap when its corresponding form is destroyed.

```ts
import { Fmm, FmmMinimap } from '@eafmm/core';

const p: FmmMinimapCreateParam = {
   anchor: anchorDiv,
   form: myForm,
   title: 'Important Info'
};
const minimap = Fmm.createMinimap(p);

...

minimap.destructor();
```

## Example Wizard Panel With Always-Visible Minimaps
1. Create a [panel](#fmmpanel) soecifying the number of wizard steps, i.e. the number of minimaps expected.
1. Use the panel to create a [minimap](#fmmminimap) for the form in each step of the wizard.
1. Detach the minimap when a step is navigated away and its corresponding form is destroyed.  The minimap will be shown greyed out so it can still be used for context and cut-and-paste.
1. Destroy the panel when the wizard is no longer needed.  All detached minimaps in this panel will be destroyed.
1. A 'wizard' with only one step is a perfectly legitimate use case to show an always-visible minimap.

```ts
import { Fmm, FmmMinimap, FmmPanel } from '@eafmm/core';

const panel = Fmm.createPanel(parentDiv, 2, detailParentDiv);
const p1: FmmMinimapCreateParam = {
   form: myForm1,
   ordinal: 0,
   title: 'Step 1',
   usePanelDetail: true
};
const minimap1 = panel.createMinimap(p1);

...

minimap1.detach();
const p2: FmmMinimapCreateParam = {
   form: myForm2,
   ordinal: 1,
   title: 'Step 2',
   usePanelDetail: true
};
const minimap2 = panel.createMinimap(p2);

...

panel.destructor();
```

***
# API
## Fmm

Static Method | Parameter/Returns | Description
--- | --- | ---
createMinimap | ( | Create a minimap.
&nbsp;| p: [FmmMinimapCreateParam](#fmmminimapcreateparam)
&nbsp;| ef?: [FmmElementFactory](#fmmelementfactory) | Advanced usage.  Can be undefined for most cases.
&nbsp;| ): [FmmMinimap](#fmmminimap)
createPanel | ( | Create a panel to hold multiple minimaps.
&nbsp;| parent: HTMLElement | Parent for the panel.
&nbsp;| <a name='pcp-minimapscount'></a>minimapsCount: number | Number of child minimaps expected.
&nbsp;| <a name='pcp-detailparent'></a>detailParent?: HTMLElement | Parent for the detail area.  If undefined, details will be shown in a popup.
&nbsp;| <a name='pcp-vertical'></a>vertical?: boolean | Stack minimaps vertically in the panel.
&nbsp;| ef?: [FmmElementFactory](#fmmelementfactory) | Advanced usage.  Can be undefined for most cases.
&nbsp;| ): [FmmPanel](#fmmpanel)

## FmmElementFactory

## FmmForm

Constructor Parameter | Type | Description
--- | --- | ---
form | HTMLFormElement | The form.
<a name='fmmform-page'></a>page | HTMElement | | Optional alternative element to use instead of the form to determine the bounding rectangle containing all form elements.

## FmmFramework

## FmmMapString

## FmmMinimap

Method | Parameter/Returns | Description
--- | --- | ---
compose | ( | Sync the minimap with changes in form composition if elements were added or removed.
&nbsp;| <a name='mm-compose-customelementids'></a>customElementIds?: string[] | List of non-standard form elements by ID or NAME attribute.
&nbsp;| ): void
<a name='mm-destructor'></a>destructor | (): void | Destroy this minimap and remove it from the DOM.
detach | (): void | Detach this minimap.  Detached minimaps will be shown grayed out.
<a name='mm-takesnapshot'></a>takeSnapshot | (): boolean | Sync the minimap with the values and statuses of form elements.  Returns false if minimap was detached or destroyed.

## FmmMinimapCreateParam

Property | Type | Default | Description
--- | --- | --- | ---
<a name='mcp-aggregatelabels'></a>aggregateLabels | [FmmMapString](#fmmmapstring)
<a name='mcp-anchor'></a>anchor | HTMLElement | | The element whose mouse enter event will show the minimap as a popup.  If undefined, the minimap will be shown in the panel.
<a name='mcp-debouncemsec'></a>debounceMsec | number | 200 | Delay for responding to form changes.
<a name='mcp-dynamiclabels'></a>dynamicLabels | string[] | | List of ID or NAME of form elements whose label may change after creation.
<a name='mcp-form'></a>form | [FmmForm](#fmmform) | **Required**
<a name='mcp-framework'></a>framework | [FmmFramework](#fmmframework)
<a name='mcp-onupdate'></a>onUpdate | [FmmOnUpdate](#fmmonupdate) | | Callback when the minimap updates itself for whatever reason.
<a name='mcp-ordinal'></a>ordinal | number | 0 | This minimap's ordinal place in the panel's list of minimaps.
<a name='mcp-store'></a>store | [FmmStore](#fmmstore)
<a name='mcp-title'></a>title | string | **Required** | Minimap title.
<a name='mcp-usepaneldetail'></a>usePanelDetail | boolean | false | Show details in panel instead of creating a popup per minimap.
<a name='mcp-usewidthtoscale'></a>useWidthToScale | boolean | false | Use width rather than height to size the minimap, maintaining aspect ratio of the form (or **page** if specified).
<a name='mcp-verbosity'></a>verbosity | number | 0 | Set to 1 to see processing times in console.
<a name='mcp-zoomfactor'></a>zoomFactor | number | | Zoom factor of anchored minimap (capped at 5.0 times).

## FmmOnUpdate

## FmmPanel

Method | Parameter/Returns | Description
--- | --- | ---
createMinimap | ( | Create a mininap in this panel.
&nbsp;| p: [FmmMinimapCreateParam](#fmmminimapcreateparam)
&nbsp;| ): [FmmMinimap](#fmmminimap)
<a name='pm-destroydetached'></a>destroyDetached | (): void | Destroy all detached minimaps in this panel.
destructor | (): void | Destroy this panel and remove it from the DOM.

## FmmStore
Constructs a store as a single source of truth (SSOT) for form values and errors.  Without a store, the form elements will be monitored directly.
