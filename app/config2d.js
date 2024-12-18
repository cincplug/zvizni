export const config2d = [
  {
    name: "shapeType",
    label: "Shape type",
    value: "zezni",
    type: "select",
    options: ["zezni", "lezni", "mazni", "smazni"]
  },
  {
    name: "isFill",
    label: "Fill",
    value: true,
    type: "checkbox"
  },
  {
    name: "doesRefresh",
    label: "Refreshes",
    value: false,
    type: "checkbox"
  },
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
  }
];
