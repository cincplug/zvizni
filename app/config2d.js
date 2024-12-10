export const config2d = [
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
    name: "shapeType",
    label: "Shape type",
    value: "flowers",
    type: "select",
    options: ["flowers", "squares", "triangles", "circles", "hexagons", "stars"]
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
