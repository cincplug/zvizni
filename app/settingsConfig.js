export const settingsConfig = [
  {
    name: "startFrequency",
    label: "Start Freq",
    min: 0,
    max: 512,
    step: 1,
    value: 60,
    type: "range"
  },
  {
    name: "endFrequency",
    label: "End Freq",
    min: 0,
    max: 2048,
    step: 1,
    value: 1974,
    type: "range"
  },
  {
    name: "thickness",
    label: "Thickness",
    min: 1,
    max: 40,
    step: 0.1,
    value: 8,
    type: "range"
  },
  {
    name: "angleRange",
    label: "Angle range",
    min: 1,
    max: 360,
    step: 1,
    value: 50,
    type: "range"
  },
  {
    name: "hue",
    label: "Hue",
    min: 0,
    max: 360,
    step: 1,
    value: 80,
    type: "range"
  },
  {
    name: "saturation",
    label: "Saturation",
    min: 0,
    max: 100,
    step: 1,
    value: 80,
    type: "range"
  },
  {
    name: "lightness",
    label: "Lightness",
    min: 0,
    max: 100,
    step: 1,
    value: 80,
    type: "range"
  },
  {
    name: "alpha",
    label: "Alpha",
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.1,
    type: "range"
  },
  {
    name: "border",
    label: "Border",
    min: 0,
    max: 5,
    step: 0.5,
    value: 0.5,
    type: "range"
  },
  {
    name: "isFill",
    label: "Fill",
    value: true,
    type: "checkbox"
  },
  {
    name: "loopType",
    label: "Loop type",
    value: "hue",
    type: "select",
    options: []
  },
  {
    name: "shapeType",
    label: "Shape type",
    value: "flowers",
    type: "select",
    options: ["flowers", "squares", "triangles", "circles", "hexagons", "stars"]
  },
  {
    name: "dimensionMode",
    label: "Dimensions",
    value: "2d",
    type: "select",
    options: ["2d", "3d"]
  },
  {
    name: "bgColor",
    label: "BG Color",
    value: "#1e293b",
    type: "color"
  },
  {
    name: "composite",
    label: "Composite",
    value: "source-over",
    type: "select",
    options: [
      "source-over",
      "destination-out",
      "destination-atop",
      "lighter",
      "copy",
      "xor",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color"
    ]
  }
];
