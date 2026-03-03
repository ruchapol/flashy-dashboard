## Flashy Dashboard — Wireframes (MVP)

This file describes the high-level wireframes for the main screens.

---

## 1. Timeline (`/`)

```
+------------------------------------------------------+
| Logo          [Create Equation]        [User avatar] |
+------------------------------------------------------+
|                                                    ↑ |
|  Post card                                         | |
|  ------------------------------------------------  | |
|  [avatar] username · 3m ago                        | |
|  y = sin(x) / x                                    | |
|  [   graph preview canvas (fixed height)        ]  | |
|  "My cool sinc function"                           | |
|  ♥ 12   💬 3              [Share]   [⋮ (Admin del)] |
|  ------------------------------------------------  | |
|                                                    | |
|  ... more posts ...                                | |
|                                                    ↓ |
+------------------------------------------------------+
|                [ Load more posts ]                  |
+------------------------------------------------------+
```

- Top bar: logo, main CTA **Create Equation**, user menu (avatar).
- Main content: list of post cards, newest first.
- Bottom: **Load more posts** for pagination.

---

## 2. Create Equation (`/create`)

```
+------------------------------------------------------+
| ← Back                   Create Equation        [U]  |
+------------------------------------------------------+
| Equation (y = f(x))                                  |
|  y = [ sin(x) / x______________________________ ]    |
|  [sin] [cos] [tan] [^] [sqrt] [π] [e]               |
|                                                      |
| X range                                             |
|  X min [ -10 ]    X max [ 10 ]                      |
|                                                      |
| Y range                                             |
|  Y min [ -10 ]    Y max [ 10 ]   [ Auto Y ✓ ]       |
|                                                      |
| [ Preview graph ]   [ Reset ]                        |
|                                                      |
| +-----------------------------------------------+    |
| |              Graph preview canvas             |    |
| |      (axes, grid, line, errors)              |    |
| +-----------------------------------------------+    |
|  Error: (only if invalid) "Unknown function..."     |
|                                                      |
| Caption                                              |
|  [ My cool sinc function ______________________ ]    |
|                                                      |
|              [ Post to timeline ]                    |
+------------------------------------------------------+
```

- Equation input with helper buttons for common functions.
- Range inputs for X and Y, with optional auto-Y.
- Preview area with graph canvas and error display.
- Caption input and **Post to timeline** button.

---

## 3. Post detail (`/post/:id`)

```
+------------------------------------------------------+
| Logo                     Post                 [U]    |
+------------------------------------------------------+
| [avatar] username · 3m ago      [⋮ (Admin del)]      |
| y = sin(x) / x                                      |
| +-----------------------------------------------+   |
| |                Big graph canvas               |   |
| +-----------------------------------------------+   |
| "My cool sinc function"                          |
| ♥ 12  [Like]     💬 3                            |
+------------------------------------------------------+
| Comments                                           |
|  [avatar] other_user · 1m ago                     |
|  "Nice graph!"                                    |
|                                                   |
|  [avatar] another_user · just now                 |
|  "What if x range is bigger?"                     |
+------------------------------------------------------+
| Add a comment                                     |
| [ Write a comment...___________________________ ]  |
| [ Post comment ]                                  |
+------------------------------------------------------+
```

- Expanded post card with larger graph.
- Full comments list and add-comment form.

---

## 4. Auth — Login & Register

### Login (`/login`)

```
+----------------------+
|   Flashy Dashboard   |
+----------------------+
| Email                |
| [ you@example.com ]  |
| Password             |
| [ ************** ]   |
|                      |
| [ Log in ]           |
|                      |
| Don't have account?  |
| [ Register ]         |
+----------------------+
```

### Register (`/register`)

```
+----------------------+
|   Flashy Dashboard   |
+----------------------+
| Username             |
| [ math_nerd ]        |
| Email                |
| [ you@example.com ]  |
| Password             |
| [ ************** ]   |
|                      |
| [ Sign up ]          |
|                      |
| Already have account?|
| [ Log in ]           |
+----------------------+
```

---

These wireframes are intentionally low-fidelity and focus on layout and flows.
Visual style (colors, typography, spacing, responsiveness) can be refined during UI design.

