# Form Minimap

This library displays a minimap for an HTML form.
It shows the location, value, and status message for each field in the form.
It also tries to compute the overall form status based on the constituent field statuses.

![Screenshot](docs/fmmp-react-demo.png)

The minimap is especially useful for long forms which may not fit in the viewport and require scrolling to see the whole form itself.
Most pages would have only one minimap for the form, but multiple minimaps may be useful in a wizard, for example, where previous step minimaps can be left visible (but detached) so the user can see the values entered in those steps.
The ability to see off-screen form fields and their values can be useful for context, as well as cutting and pasting.

The minimap can be set permanently visible in a panel DIV or popped up on mouse enter in a per-minimap DIV.
The details for each field can be shown in a permanently visible shared DIV or in a popup per minimap.

When a form is destroyed, its corresponding minimap should be detached or destroyed.
The <a href="https://www.npmjs.com/package/@fmmp/ng">Angular</a>, <a href="https://www.npmjs.com/package/@fmmp/react">React</a>, and <a href="https://www.npmjs.com/package/@fmmp/vue">Vue</a> components will detach the minimap when the component is destroyed.  This will happen when the component tag is placed within the form.

Please feel free to play around with the <a href="https://www.npmjs.com/package/@fmmp/ng-demo">Angular</a>, <a href="https://www.npmjs.com/package/@fmmp/react-demo">React</a>, and <a href="https://www.npmjs.com/package/@fmmp/vue-demo">Vue</a> demos.  Feedback is always welcome, but no pull requests (sorry).

Limitations:
- Only form input fields with an ID or NAME attribute, which are not HIDDEN, are shown.
- Only bootstrap4, material-ui, and angular material handlers are supplied with the library, although it should be easy enough to use these as a starting point to write your own handler for other layout frameworks.
- May not handle complicated forms, although it tries to handle css display change to some extent.
- No documentation yet.  Use the source, Luke!
- No automated testing yet.
- No WCAG accessibility yet.  It might even be better to hide the minimap from screen readers since it duplicates information already in the form.

If you find this software useful, please feel free to <a href="https://www.buymeacoffee.com/sparrowhawkea"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

Thank you.
