export const configCommon = [
  {
    name: "loopType",
    label: "Loop type",
    value: "hue",
    type: "select",
    options: []
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
    name: "bgColor",
    label: "BG Color",
    value: "#1e293b",
    type: "color"
  }
];
