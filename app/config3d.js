export const config3d = [
  {
    name: "sphereAddInterval",
    label: "Interval",
    min: 10,
    max: 3000,
    step: 1,
    value: 1000,
    type: "range"
  },
  {
    name: "shininess",
    label: "Shine",
    min: 0,
    max: 100,
    step: 1,
    value: 70,
    type: "range"
  },
  {
    name: "specular",
    label: "Spec",
    value: "#ffffff",
    type: "color"
  },
  {
    name: "color",
    label: "Color",
    value: "#00aaff",
    type: "color"
  },
  {
    name: "vertDispLimit",
    label: "VertDisp",
    min: 0,
    max: 500,
    step: 1,
    value: 200,
    type: "range"
  },
  {
    name: "vertexChangeLimit",
    label: "VertexChange",
    min: 0,
    max: 50,
    step: 1,
    value: 10,
    type: "range"
  },
  {
    name: "maxVertices",
    label: "MaxVertices",
    min: 1000,
    max: 20000,
    step: 100,
    value: 15000,
    type: "range"
  },
  {
    name: "spacing",
    label: "Spacing",
    min: 3,
    max: 7,
    step: 0.1,
    value: 5,
    type: "range"
  },
  {
    name: "sphereRadius",
    label: "Radius",
    min: 1,
    max: 50,
    step: 0.1,
    value: 5,
    type: "range"
  },
  {
    name: "sphereWidthSegments",
    label: "WidthSeg",
    min: 8,
    max: 64,
    step: 1,
    value: 32,
    type: "range"
  },
  {
    name: "sphereHeightSegments",
    label: "HeightSeg",
    min: 8,
    max: 64,
    step: 1,
    value: 32,
    type: "range"
  }
];
