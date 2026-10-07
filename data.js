// Utah Animals: the single source of data for the whole site.
//
// ATTRIBUTES are the organization schemes and filters. Each one:
//   id        short key used on every animal record and in page URLs
//   label     text people see
//   multiple  true = an animal can have several values (a list); false = exactly one
//   required  true = every animal must have at least one value
//   onHome    true = shown as a group of buttons on the landing page
//   asFilter  true = shown as a checkbox filter on category pages
//             (hidden automatically on pages of that same attribute)
//   values    [id, label] pairs, in display order
// To add a new scheme or filter, add an entry here and give each animal a value for it.
//
// ANIMALS are the information blocks. Each has a name plus a value for every attribute id.
// An empty kind list ([]) means the animal is found only through location.

window.SITE_DATA = {
  attributes: [
    {
      id: "kind",
      label: "Kind of animal",
      multiple: true,
      required: false,
      onHome: true,
      asFilter: false,
      values: [
        ["farm-pets", "Farm animals and pets"],
        ["birds", "Birds"],
        ["antlered", "Deer, elk, and other antlered animals"],
        ["small-mammals", "Small mammals"],
        ["reptiles", "Reptiles"],
        ["fish", "Fish"],
        ["insects", "Insects and other small creatures"],
      ],
    },
    {
      id: "where",
      label: "Where you'd find it",
      multiple: true,
      required: true,
      onHome: true,
      asFilter: true,
      values: [
        ["deserts", "Deserts"],
        ["mountains-forests", "Mountains and forests"],
        ["rivers-lakes", "Rivers and lakes"],
        ["farms-towns", "Farms, yards, and towns"],
      ],
    },
    {
      id: "size",
      label: "Size",
      multiple: false,
      required: true,
      onHome: false,
      asFilter: true,
      values: [
        ["small", "Small"],
        ["medium", "Medium"],
        ["large", "Large"],
      ],
    },
    {
      id: "feature",
      label: "Visible feature",
      multiple: true,
      required: true,
      onHome: false,
      asFilter: true,
      values: [
        ["feathers", "Feathers"],
        ["scales", "Scales"],
        ["fur", "Fur"],
        ["horns", "Horns"],
        ["antlers", "Antlers"],
        ["none", "None of these"],
      ],
    },
  ],

  animals: [
    { name: "American bison", kind: ["antlered"], where: ["deserts", "mountains-forests"], size: "large", feature: ["fur", "horns"] },
    { name: "Bald eagle", kind: ["birds"], where: ["rivers-lakes", "mountains-forests"], size: "medium", feature: ["feathers"] },
    { name: "Black bear", kind: [], where: ["mountains-forests"], size: "large", feature: ["fur"] },
    { name: "Black-billed magpie", kind: ["birds"], where: ["farms-towns"], size: "small", feature: ["feathers"] },
    { name: "Black-tailed jackrabbit", kind: ["small-mammals"], where: ["deserts"], size: "small", feature: ["fur"] },
    { name: "Bonneville cutthroat trout", kind: ["fish"], where: ["rivers-lakes"], size: "small", feature: ["scales"] },
    { name: "California gull", kind: ["birds"], where: ["rivers-lakes", "farms-towns"], size: "small", feature: ["feathers"] },
    { name: "Cat", kind: ["farm-pets"], where: ["farms-towns"], size: "small", feature: ["fur"] },
    { name: "Chicken", kind: ["farm-pets", "birds"], where: ["farms-towns"], size: "small", feature: ["feathers"] },
    { name: "Cow", kind: ["farm-pets"], where: ["farms-towns"], size: "large", feature: ["fur"] },
    { name: "Coyote", kind: ["small-mammals"], where: ["deserts", "mountains-forests", "farms-towns"], size: "medium", feature: ["fur"] },
    { name: "Desert tortoise", kind: ["reptiles"], where: ["deserts"], size: "small", feature: ["scales"] },
    { name: "Dog", kind: ["farm-pets"], where: ["farms-towns"], size: "medium", feature: ["fur"] },
    { name: "Elk", kind: ["antlered"], where: ["mountains-forests"], size: "large", feature: ["fur", "antlers"] },
    { name: "Great Basin rattlesnake", kind: ["reptiles"], where: ["deserts"], size: "medium", feature: ["scales"] },
    { name: "Great horned owl", kind: ["birds"], where: ["mountains-forests", "deserts", "farms-towns"], size: "small", feature: ["feathers"] },
    { name: "Honeybee", kind: ["insects", "farm-pets"], where: ["farms-towns"], size: "small", feature: ["none"] },
    { name: "Horse", kind: ["farm-pets"], where: ["farms-towns"], size: "large", feature: ["fur"] },
    { name: "Moose", kind: ["antlered"], where: ["mountains-forests", "rivers-lakes"], size: "large", feature: ["fur", "antlers"] },
    { name: "Mountain lion", kind: [], where: ["mountains-forests", "deserts"], size: "large", feature: ["fur"] },
    { name: "Mule deer", kind: ["antlered"], where: ["mountains-forests", "deserts", "farms-towns"], size: "large", feature: ["fur", "antlers"] },
    { name: "Pet rabbit", kind: ["farm-pets"], where: ["farms-towns"], size: "small", feature: ["fur"] },
    { name: "Porcupine", kind: ["small-mammals"], where: ["mountains-forests"], size: "medium", feature: ["fur"] },
    { name: "Pronghorn", kind: ["antlered"], where: ["deserts"], size: "medium", feature: ["fur", "horns"] },
    { name: "Raccoon", kind: ["small-mammals"], where: ["farms-towns", "rivers-lakes"], size: "medium", feature: ["fur"] },
    { name: "Red fox", kind: ["small-mammals"], where: ["farms-towns", "mountains-forests"], size: "small", feature: ["fur"] },
    { name: "Striped skunk", kind: ["small-mammals"], where: ["farms-towns"], size: "small", feature: ["fur"] },
    { name: "American beaver", kind: ["small-mammals"], where: ["rivers-lakes"], size: "medium", feature: ["fur"] },
    { name: "American robin", kind: ["birds"], where: ["farms-towns", "mountains-forests"], size: "small", feature: ["feathers"] },
    { name: "Bighorn sheep", kind: ["antlered"], where: ["deserts", "mountains-forests"], size: "large", feature: ["fur", "horns"] },
    { name: "Black widow spider", kind: ["insects"], where: ["farms-towns", "deserts"], size: "small", feature: ["none"] },
    { name: "California quail", kind: ["birds"], where: ["farms-towns"], size: "small", feature: ["feathers"] },
    { name: "Channel catfish", kind: ["fish"], where: ["rivers-lakes"], size: "small", feature: ["none"] },
    { name: "Common carp", kind: ["fish"], where: ["rivers-lakes"], size: "medium", feature: ["scales"] },
    { name: "Desert cottontail", kind: ["small-mammals"], where: ["deserts", "farms-towns"], size: "small", feature: ["fur"] },
    { name: "Desert tarantula", kind: ["insects"], where: ["deserts"], size: "small", feature: ["none"] },
    { name: "Gila monster", kind: ["reptiles"], where: ["deserts"], size: "small", feature: ["scales"] },
    { name: "Gopher snake", kind: ["reptiles"], where: ["deserts", "farms-towns", "mountains-forests"], size: "medium", feature: ["scales"] },
    { name: "Mallard", kind: ["birds"], where: ["rivers-lakes", "farms-towns"], size: "small", feature: ["feathers"] },
    { name: "Monarch butterfly", kind: ["insects"], where: ["farms-towns"], size: "small", feature: ["none"] },
    { name: "Mormon cricket", kind: ["insects"], where: ["deserts", "farms-towns"], size: "small", feature: ["none"] },
    { name: "Mountain goat", kind: ["antlered"], where: ["mountains-forests"], size: "large", feature: ["fur", "horns"] },
    { name: "Rainbow trout", kind: ["fish"], where: ["rivers-lakes"], size: "small", feature: ["scales"] },
    { name: "Red-tailed hawk", kind: ["birds"], where: ["deserts", "farms-towns", "mountains-forests"], size: "small", feature: ["feathers"] },
    { name: "Sheep", kind: ["farm-pets"], where: ["farms-towns"], size: "medium", feature: ["fur"] },
    { name: "Uinta ground squirrel", kind: ["small-mammals"], where: ["mountains-forests", "farms-towns"], size: "small", feature: ["fur"] },
    { name: "Western fence lizard", kind: ["reptiles"], where: ["deserts", "mountains-forests"], size: "small", feature: ["scales"] },
    { name: "Yellow-bellied marmot", kind: ["small-mammals"], where: ["mountains-forests"], size: "small", feature: ["fur"] },
  ],

  // TASKS for the tree test (index.html?test). Each one:
  //   id                   short key, shown in the results
  //   text                 what the participant is asked to do
  //   targets              animal name(s); clicking any of these cards completes the task
  //   predictedFirstClick  the landing-page button you expect most people to click first
  //   rationale            your note on why the task is in the test (participants never see it)
  // Copied from utah-animals-tree-test-tasks.csv.
  tasks: [
    {
      id: "1",
      text: "A red fox has been trotting through your neighborhood at dusk. Find out more about it.",
      targets: ["Red fox"],
      predictedFirstClick: "Small mammals",
      rationale: "Card sort's systematic splitter (2 sorts by kind, 2 by role). Does Small mammals hold it, or does location win?",
    },
    {
      id: "2",
      text: "Your family is camping in the Uintas this weekend and you heard cougars live there. Find out more about cougars.",
      targets: ["Mountain lion"],
      predictedFirstClick: "Mountains and forests",
      rationale: "Mountain lion has no kind, so only location reaches it. Tests the missing Predators view; uses the user's word 'cougar'.",
    },
    {
      id: "3",
      text: "A neighbor who keeps beehives gave you a jar of honey. Find the animal that made it.",
      targets: ["Honeybee"],
      predictedFirstClick: "Insects and other small creatures",
      rationale: "Biggest scatter card (5 homes in 6 sorts). Tests whether 'kept' or 'kind' pulls harder.",
    },
    {
      id: "4",
      text: "You caught a cutthroat at Strawberry Reservoir and want to know if it's the native kind. Find it.",
      targets: ["Bonneville cutthroat trout"],
      predictedFirstClick: "Fish",
      rationale: "Second scatter card; joined reptiles under 'scales' twice. Baseline for a one-path kind category.",
    },
    {
      id: "5",
      text: "You're planning a trip to Antelope Island to see the buffalo herd. Find out more about them.",
      targets: ["American bison"],
      predictedFirstClick: "Deer, elk, and other antlered animals",
      rationale: "Bison has horns, not antlers. Tests whether the antlered label still works and whether 'island' lures people to Rivers and lakes.",
    },
    {
      id: "6",
      text: "You heard a buzzing rattle under a bush while hiking near Moab. Find the animal that made the sound.",
      targets: ["Great Basin rattlesnake"],
      predictedFirstClick: "Reptiles",
      rationale: "Polyhierarchy check: kind (Reptiles) vs. place (Deserts) as first click; both are correct paths.",
    },
    {
      id: "7",
      text: "You're thinking about keeping a few hens at home for fresh eggs. Find out more about them.",
      targets: ["Chicken"],
      predictedFirstClick: "Farm animals and pets",
      rationale: "Domestic was the loudest group (9 of 10). Chicken is filed under two kinds; tests which one people expect.",
    },
    {
      id: "8",
      text: "Your dog came back from a Wasatch hike with quills stuck in its nose. Find the animal that did it.",
      targets: ["Porcupine"],
      predictedFirstClick: "Small mammals",
      rationale: "Card sort's vocabulary casualty (orphaned by 'rodents'). Tests whether Small mammals is the home people expect.",
    },
    {
      id: "9",
      text: "Seagulls keep swooping at your lunch at Liberty Park. Find out more about them.",
      targets: ["California gull"],
      predictedFirstClick: "Birds",
      rationale: "Strong cluster (8 of 10 made Birds). Expected easy win; a control task that uses everyday 'seagull' language.",
    },
    {
      id: "10",
      text: "Your brother-in-law drew a moose tag this fall. Find out more about the animal he'll be hunting.",
      targets: ["Moose"],
      predictedFirstClick: "Deer, elk, and other antlered animals",
      rationale: "Core of a 6/6 cluster. Contrast with task 5: same category, an animal that actually has antlers.",
    },
  ],
};
