# Utah Animals: Wireframe Specification

A low-fi clickable wireframe for usability testing. It presents animals that live in Utah, organized by the information architecture from the class card sort.

Live site: https://mikejonesbyu.github.io/utah-animals-example/

## Visual design

A low-fi clickable wireframe uses boxes for content, real labels for navigation, and no styling, no real images, and no brand.

- Black and white only.
- One font: Arial / Helvetica.
- Headings are larger than body text. Size is their only difference: no bold, italics, or other styling.
- Plain outlined boxes. No images and no logo. "Utah Animals" appears in plain text at the top of every page.
- Designed for desktop and usable at phone width, where the category page's filters stack above the cards.

## Information architecture

### Organization scheme 1 (primary): Kind of animal

1. Farm animals and pets
2. Birds
3. Deer, elk, and other antlered animals
4. Small mammals
5. Reptiles
6. Fish
7. Insects and other small creatures

An animal can have more than one kind (e.g. Chicken: Farm animals and pets + Birds). An animal can also have no kind. That animal is found only through location. There is no "None" button.

### Organization scheme 2 (secondary): Where you'd find it

1. Deserts
2. Mountains and forests
3. Rivers and lakes
4. Farms, yards, and towns

An animal can have more than one location. Every animal has at least one.

### Filters (facets)

| Filter | Values | Per animal |
|---|---|---|
| Where you'd find it | Deserts, Mountains and forests, Rivers and lakes, Farms, yards, and towns | One or more |
| Size | Small, Medium, Large | Exactly one |
| Visible feature | Feathers, Scales, Fur, Horns, Antlers, None of these | One or more |

Size rule: **Small** = cat-sized or smaller; **Medium** = bigger than a cat, smaller than a person; **Large** = person-sized or bigger.

## Pages

### Landing page (`index.html`)

- Two groups of buttons, stacked: "Kind of animal" on top, "Where you'd find it" below. Each group has a heading and no surrounding box.
- Within each group, the buttons run horizontally in a row and wrap onto the next line when they run out of room.
- One button per category. Each opens that category's page.

### Category page (`category.html?<scheme>=<value>`)

- One shared page template. It reads the category from the URL, e.g. `category.html?kind=birds` or `category.html?where=deserts`.
- Header: "Utah Animals" and a breadcrumb (Home > Category name).
- Left sidebar: checkbox filters for Where you'd find it, Size, and Visible feature. A filter is hidden on pages of its own scheme, so location pages show only Size and Visible feature.
- A filter is also hidden when it can't narrow that page's list, meaning every animal on the page has the same value for it. Example: every fish is in "Rivers and lakes," so the Fish page has no "Where you'd find it" filter. This is worked out from the data each time the page loads. If no filters are left, the sidebar is hidden.
- Main area: a result count ("Showing X of Y animals") and a grid of animal cards, sorted A to Z.
- Cards are outlined boxes showing only the animal's name. Clicking a card does nothing.
- An unknown category in the URL shows "Category not found" with a link home.

### Filter behavior

- Checkboxes. Several values can be selected within one filter.
- Within one filter, an animal matches if it has **any** checked value.
- Across filters, an animal must match **every** filter that has a checked value.
- Each option shows a count, e.g. "Small (3)". The count is how many animals in the category would match if that option were checked, given what's already selected in the other filters. Counts update as filters change.
- The list updates instantly whenever a box is checked or unchecked.
- A "Clear filters" button unchecks everything.
- Filters are not saved in the URL. Reloading or going back starts from a clean page.
- No special message is shown when nothing matches. The count reads "Showing 0 of Y."

## Data architecture

- **`data.js` is the single source of truth.** No categories, filters, or results are hard-coded in the pages. Everything is rebuilt from `data.js` each time a page loads.
- **Attributes** (schemes and filters) are defined in `data.js`. Each one has an `id`, a `label`, `multiple` (one value or several), `required`, `onHome` (shown as landing-page buttons), `asFilter` (shown as a category-page filter), and its `values` in display order. To add a new scheme or filter, add an attribute and give each animal a value for it.
- **Animals** are the information blocks. Each is one record: a `name` plus a value for every attribute id. To add or remove an animal, add or remove one line.
- **Validation:** If an animal is missing a required value, uses a value that isn't defined, uses a list where a single value belongs (or the reverse), or has a duplicate name, a visible banner on the page lists the problem.

## Files

| File | Purpose |
|---|---|
| `index.html` | Landing page shell |
| `category.html` | Category page shell |
| `data.js` | Attributes and animals |
| `app.js` | Builds the pages from the data, runs the filters, checks the data |
| `style.css` | Wireframe styles |

## Animals

28 animals from the card sort deck, plus 20 more common Utah animals (48 total). Black bear and mountain lion have no kind and are reached through location only.
