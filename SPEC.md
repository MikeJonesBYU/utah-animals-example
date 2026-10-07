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
- Cards are outlined boxes showing only the animal's name. Clicking a card does nothing, except during a tree test (see below).
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

## Tree test

The wireframe can run a tree test: participants try to find animals while every click is recorded, so you can later see where the organization or labels send people the wrong way.

### Tasks

Each task asks the participant to find something, e.g. "Find the red fox." The expected outcome is clicking the card of the target animal. The task list lives in `data.js` (see Data architecture).

Each task also has a **predicted first click**: the landing-page button you expect most people to choose first. A first click is **on a correct path** if it is any landing-page button whose category page contains the target. This is worked out from the data, so it stays right if animals are recategorized.

| # | Target | Predicted first click | Other correct first clicks |
|---|---|---|---|
| 1 | Red fox | Small mammals | Farms, yards, and towns; Mountains and forests |
| 2 | Mountain lion | Mountains and forests | Deserts |
| 3 | Honeybee | Insects and other small creatures | Farm animals and pets; Farms, yards, and towns |
| 4 | Bonneville cutthroat trout | Fish | Rivers and lakes |
| 5 | American bison | Deer, elk, and other antlered animals | Deserts; Mountains and forests |
| 6 | Great Basin rattlesnake | Reptiles | Deserts |
| 7 | Chicken | Farm animals and pets | Birds; Farms, yards, and towns |
| 8 | Porcupine | Small mammals | Mountains and forests |
| 9 | California gull | Birds | Rivers and lakes; Farms, yards, and towns |
| 10 | Moose | Deer, elk, and other antlered animals | Mountains and forests; Rivers and lakes |

Task wording is in `data.js`, copied from `utah-animals-tree-test-tasks.csv`.

### Starting a session

- Add `?test` to the landing page URL (`index.html?test`) to start a session. Normal browsing without `?test` is unchanged.
- Each session is one participant. Participants are numbered automatically in the order they are run: P1, P2, P3… Numbering continues across visits until results are cleared.
- A session is saved, and gets its participant number, when the participant clicks Start. Opening `?test` and leaving before Start saves nothing.
- A session belongs to the browser tab it was started in. Other tabs, and tabs opened later, show the normal site.
- Opening `?test` while a session is unfinished ends that session as incomplete and starts a new one.

### Running a session

1. The task order is shuffled randomly for each participant.
2. A modal asks whether the participant is ready to begin, with a "Start" button.
3. Each task is introduced in a modal that shows the task text and a "Start task" button. The timer for the task starts when it is clicked.
4. Every task starts on the landing page.
5. While a task is running, a plain bar fixed to the bottom of every page shows the task text and an "I give up" button.
6. During a test, cards can be clicked. Clicking a target card ends the task as a **success**. Clicking any other card is recorded, and the task continues. There is no feedback either way.
7. Clicking "I give up" ends the task as a **give up**.
8. When a task ends, the wireframe resets to the landing page with filters cleared and shows the next task's modal.
9. After the last task, a "Thank you, you're done" modal appears. The session is saved. That tab keeps showing the modal until you open `?test` (next participant) or `?results`.

There is no time limit and no click limit.

### What is recorded

Every action the participant takes during a task is recorded in order, with the time since the previous action (or, for the first action, since "Start task"):

- Landing-page category buttons
- Filter checkboxes, checked and unchecked
- "Clear filters"
- Breadcrumb links
- The browser's Back and Forward buttons
- Card clicks, right or wrong
- "I give up"
- Any other link (only the "Home" link on the "Category not found" page)

Each task also records its outcome (success or give up), total time, and number of clicks.

The test keeps running as the participant moves between pages. Progress is saved after every click, so if the browser tab is closed, the tasks finished so far are kept and the session is marked incomplete. A closed session can't be resumed.

### Results page

- Open `index.html?results` to see the results page. Participants never see it.
- It lists each saved session: participant number, date and time, tasks completed, and successes.
- "Download CSV" downloads every session in one file, named `tree-test-results-YYYY-MM-DD-HHMM.csv` so later downloads don't overwrite earlier ones.
- "Clear all results" deletes every saved session after a confirm step. Participant numbering restarts at P1.
- Results are stored in the browser on the laptop running the test. They stay there until cleared, across page reloads and browser restarts. Use the same browser and the same address (local file or live site) for every session, since each keeps its own results.

### CSV format

One row per recorded action. Columns:

| Column | Meaning |
|---|---|
| `participant` | P1, P2, … |
| `session_start` | Date and time the session started |
| `session_status` | complete or incomplete |
| `task_position` | 1, 2, 3… in the order this participant saw the tasks |
| `task_id` | Task id from `data.js` |
| `task_text` | Task text as shown |
| `target` | Correct animal name(s) |
| `task_outcome` | success or give up (blank if the session ended mid-task) |
| `task_seconds` | Total time on the task |
| `task_clicks` | Total actions on the task |
| `predicted_first_click` | The first click you predicted for this task |
| `first_click` | What the participant actually clicked first |
| `first_click_predicted` | yes if the first click matched the prediction, otherwise no |
| `first_click_correct_path` | yes if the first click was on any correct path, otherwise no (a first click of "I give up" or Back is no) |
| `click_number` | 1, 2, 3… within the task |
| `action` | category button, filter check, filter uncheck, clear filters, breadcrumb, link, back, forward, card, give up |
| `label` | What was clicked, e.g. "Birds", "Small", "Red fox" |
| `page` | The page the click happened on, e.g. Home, Birds, Deserts |
| `seconds_since_previous` | Time since the previous action |

Task-level columns repeat on each row so the file can be filtered or pivoted without joining.

In an incomplete session, the task that was interrupted has a blank `task_outcome`, and its `task_seconds` runs to its last recorded action. Tasks the participant never reached, or started without clicking anything, have no rows.

## Data architecture

- **`data.js` is the single source of truth.** No categories, filters, or results are hard-coded in the pages. Everything is rebuilt from `data.js` each time a page loads.
- **Attributes** (schemes and filters) are defined in `data.js`. Each one has an `id`, a `label`, `multiple` (one value or several), `required`, `onHome` (shown as landing-page buttons), `asFilter` (shown as a category-page filter), and its `values` in display order. To add a new scheme or filter, add an attribute and give each animal a value for it.
- **Animals** are the information blocks. Each is one record: a `name` plus a value for every attribute id. To add or remove an animal, add or remove one line.
- **Tasks** for the tree test are defined in `data.js`. Each has an `id`, the `text` shown to the participant, `targets` (the name of the animal, or a list of names if more than one card counts as correct), `predictedFirstClick` (a landing-page button label), and a `rationale` note for your reference that participants never see.
- **Validation:** If a task target isn't the name of an animal, or a predicted first click isn't a landing-page button, the validation banner lists it. If an animal is missing a required value, uses a value that isn't defined, uses a list where a single value belongs (or the reverse), or has a duplicate name, a visible banner on the page lists the problem.

## Files

| File | Purpose |
|---|---|
| `index.html` | Landing page shell |
| `category.html` | Category page shell |
| `data.js` | Attributes and animals |
| `app.js` | Builds the pages from the data, runs the filters, checks the data |
| `tree-test.js` | Runs the tree test, records clicks, shows the results page and builds the CSV |
| `style.css` | Wireframe styles |

## Animals

28 animals from the card sort deck, plus 20 more common Utah animals (48 total). Black bear and mountain lion have no kind and are reached through location only.

