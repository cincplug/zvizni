export const settingsConfig = [
  {
    name: "minFrequency",
    label: "Min Frequency",
    min: 0,
    max: 512,
    step: 1,
    value: 100,
    type: "range"
  },
  {
    name: "maxFrequency",
    label: "Max Frequency",
    min: 0,
    max: 512,
    step: 1,
    value: 400,
    type: "range"
  },
  {
    name: "minRadius",
    label: "Min Radius",
    min: 1,
    max: 100,
    step: 0.1,
    value: 5,
    type: "range"
  },
  {
    name: "maxRadius",
    label: "Max Radius",
    min: 1,
    max: 10,
    step: 0.1,
    value: 4,
    type: "range"
  },
  {
    name: "colorFactor",
    label: "Color Factor",
    min: -5,
    max: 10,
    step: 0.01,
    value: 1,
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
    name: "angleModifier",
    label: "Angle Modifier",
    min: 1,
    max: 10,
    step: 0.1,
    value: 4,
    type: "range"
  },
  {
    name: "border",
    label: "Border",
    min: 0,
    max: 10,
    step: 0.1,
    value: 1,
    type: "range"
  },
  {
    name: "isFill",
    label: "Fill",
    value: true,
    type: "checkbox"
  },
  {
    name: "isMingle",
    label: "Mingle",
    value: true,
    type: "checkbox"
  },
  {
    name: "bgColor",
    label: "BG Color",
    value: "#1e293b",
    type: "color"
  }
];
