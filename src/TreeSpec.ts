import { Spec } from "vega";

const spec: Spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description:
    "An example of Cartesian layouts for a node-link diagram of hierarchical data.",
  width: 600,
  height: 1600,
  padding: 5,

  signals: [],

  data: [
    {
      name: "tree",
      transform: [
        {
          type: "stratify",
          key: "id",
          parentKey: "parent",
        },
        {
          type: "tree",
          method: "tidy",
          size: [{ signal: "height" }, { signal: "width - 100" }],
          separation: false,
          as: ["y", "x", "depth", "children"],
        },
      ],
    },
    {
      name: "links",
      source: "tree",
      transform: [
        { type: "treelinks" },
        {
          type: "linkpath",
          orient: "horizontal",
          shape: "diagonal",
        },
      ],
    },
  ],

  scales: [
    {
      name: "color",
      type: "linear",
      range: { scheme: "magma" },
      domain: { data: "tree", field: "depth" },
      zero: true,
    },
  ],

  marks: [
    {
      type: "path",
      from: { data: "links" },
      encode: {
        update: {
          path: { field: "path" },
          stroke: { value: "#ccc" },
        },
      },
    },
    {
      type: "symbol",
      from: { data: "tree" },
      encode: {
        enter: {
          size: { value: 100 },
          stroke: { value: "#fff" },
        },
        update: {
          x: { field: "x" },
          y: { field: "y" },
          fill: { scale: "color", field: "depth" },
        },
      },
    },
    {
      type: "text",
      from: { data: "tree" },
      encode: {
        enter: {
          text: { field: "name" },
          fontSize: { value: 9 },
          baseline: { value: "middle" },
        },
        update: {
          x: { field: "x" },
          y: { field: "y" },
          dx: { signal: "datum.children ? -7 : 7" },
          align: { signal: "datum.children ? 'right' : 'left'" },
        },
      },
    },
  ],
};

export default spec;
