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
    { name: "Yellow-bellied marmot", kind: ["small-mammals"], where: ["mountains-forests"], size: "small", feature: ["fur"] },
  ],
};
