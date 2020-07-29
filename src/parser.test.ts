import { parse, Tree } from "./parser";
import each from "jest-each";

describe("parse tree", () => {
  each([
    [
      ["A -> B"],
      [
        { id: 0, name: "A" },
        { id: 1, name: "B", parent: 0 },
      ],
      1,
      2,
      "A",
    ],
    [
      ["A -> B;"],
      [
        { id: 0, name: "A" },
        { id: 1, name: "B", parent: 0 },
      ],
      1,
      2,
      "A",
    ],
    [
      ["A -> B;", "A -> C;"],
      [
        { id: 0, name: "A" },
        { id: 1, name: "B", parent: 0 },
        { id: 2, name: "C", parent: 0 },
      ],
      2,
      2,
      "A",
    ],
    [
      ["A -> B;", "B -> C;"],
      [
        { id: 0, name: "A" },
        { id: 1, name: "B", parent: 0 },
        { id: 2, name: "C", parent: 1 },
      ],
      1,
      3,
      "A",
    ],
    [
      ["B -> C;", "A -> B;"],
      [
        { id: 0, name: "B", parent: 2 },
        { id: 1, name: "C", parent: 0 },
        { id: 2, name: "A" },
      ],
      1,
      3,
      "A",
    ],
    [
      ["A -> B -> C;"],
      [
        { id: 0, name: "A" },
        { id: 1, name: "B", parent: 0 },
        { id: 2, name: "C", parent: 1 },
      ],
      1,
      3,
      "A",
    ],
    [
      ["A -> B", "B -> C;"],
      [
        { id: 0, name: "A" },
        { id: 1, name: "B", parent: 0 },
        { id: 2, name: "C", parent: 1 },
      ],
      1,
      3,
      "A",
    ],
    [
      [
        "Root -> A -> A0;",
        "Root -> A -> A1;",
        "Root -> B -> B0;",
        "Root -> B -> B1;",
      ],
      [
        { id: 0, name: "Root" },
        { id: 1, name: "A", parent: 0 },
        { id: 2, name: "A0", parent: 1 },
        { id: 3, name: "A1", parent: 1 },
        { id: 4, name: "B", parent: 0 },
        { id: 5, name: "B0", parent: 4 },
        { id: 6, name: "B1", parent: 4 },
      ],
      4,
      3,
      "Root",
    ],
  ]).test(
    "%s is parsed as %s, breadth=%s, depth=%s, roots=%s",
    (graph, data, breadth, depth, root) => {
      const dGraph = parse(graph.join("\n"))[0];
      expect(dGraph.isTree).toBe(true);
      const tree = new Tree(dGraph.vertices);
      expect(tree.data).toEqual(data);
      expect(tree.breadth).toEqual(breadth);
      expect(tree.depth).toEqual(depth);
      expect(tree.root.name).toBe(root);
    }
  );
});

describe("is acyclic", () => {
  each([
    [[], true],
    [["A -> B;", "B -> A;"], false],
    [["A -> B;"], true],
    [["A -> B;", "B -> C;", "C -> B;"], false],
    [["A -> B;", "A -> C;", "B -> C;"], true],
    [["A -> B;", "B -> C;", "C -> A;"], false],
  ]).test("%s is acyclic? %s", (edges, isAcyclic) => {
    const dGraph = parse(edges.join("\n"))[0];
    expect(dGraph.isAcyclic).toBe(isAcyclic);
    if (!isAcyclic) {
      expect(dGraph.breadth).toEqual(0);
      expect(dGraph.depth).toEqual(Infinity)
    }
  });
});

describe("pathTo", () => {
  each([
    [["A -> B;"], "A", "B", ["A", "B"]],
    [["A -> B -> C;"], "A", "C", ["A", "B", "C"]],
    [["A -> B -> C;"], "A", "C", ["A", "B", "C"]],
    [["A -> B -> A;"], "A", "A", ["A", "B", "A"]],
    [["A -> B;", "A -> C;"], "B", "C", null],
  ]).test(
    "in graph %s start from %s to %s with path %s",
    (edges, start, end, path) => {
      const tree = parse(edges.join("\n"))[0];
      const firstV = tree.vertices.filter((v) => v.name === start)[0];
      const lastV = tree.vertices.filter((v) => v.name === end)[0];
      if (path === null) {
        expect(firstV.pathTo(lastV)).toEqual(null);
      } else {
        expect((firstV.pathTo(lastV) ?? []).map((v) => v.name)).toEqual(path);
      }
    }
  );
});

describe("isTree", () => {
  each([
    [["A -> A;"], false],
    [["A -> B;"], true],
    [["A -> B;", "A -> A;"], false],
    [["A -> B;", "A -> A;", "C -> D;"], false],
    [["A -> B -> C;"], true],
    [["A -> B -> C;", "B -> D;"], true],
    [["A0 -> B -> C;", "A1 -> C;"], false],
    [["A -> B -> C;", "C -> B;"], false],
    [["A -> B;", "B -> A;"], false],
    [["A -> B;", "C -> D;"], false],
  ]).test("directed graph %s is a tree? %s", (arrows, isTree) => {
    const graph = parse(arrows.join("\n"))[0];
    expect(graph.isTree).toBe(isTree);
  });
});

describe("isMultiTree", () => {
  each([
    [["A -> A;"], false],
    [["A -> B;"], false],
    [["A -> B -> C;"], false],
    [["A -> B -> C;", "B -> D;"], false],
    [["A0 -> B -> C;", "A1 -> C;"], false],
    [["A -> B -> C;", "C -> B;"], false],
    [["A -> B;", "B -> A;"], false],
    [["A -> B;", "C -> D;"], true],
    [["A -> B;", "A -> C", "D -> E;"], true],
  ]).test("directed graph %s has multiple trees? %s", (arrows, isMultiTree) => {
    const graph = parse(arrows.join("\n"))[0];
    expect(graph.isMultiTree).toBe(isMultiTree);
  });
});

describe("isDescendant", () => {
  each([
    ["Root", "Root", true],
    ["A", "Root", true],
    ["A0", "Root", true],
  ]).test("%s is a descendant of %s? %s", (vx, vy, isDescendant) => {
    const arrows = [
      "Root -> A -> A0;",
      "A -> A1;",
      "Root -> B -> B0;",
      "B -> B1;",
    ];
    const graph = parse(arrows.join("\n"))[0];
    const vX = graph.vertices.filter((v) => v.name === vx)[0];
    const vY = graph.vertices.filter((v) => v.name === vy)[0];
    expect(vX.isDescendant(vY)).toBe(isDescendant);
  });
});

describe("arrows", () => {
  each([
    [["A -> A"], ["A -> A"]],
    [["A -> B"], ["A -> B"]],
    [
      ["A -> B", "B -> C"],
      ["A -> B", "B -> C"],
    ],
    [["A -> B -> C"], ["A -> B", "B -> C"]],
    [
      ["A -> B -> C", "C -> D"],
      ["A -> B", "B -> C", "C -> D"],
    ],
  ]).test("%s %s", (input, output) => {
    const tree = parse(input.join("\n"))[0];
    expect(tree.arrows.map((a) => a.toString())).toEqual(output);
  });
});

describe("findTree", () => {
  each([
    [[], [], []],
    [["A -> B;"], ["A -> B"], []],
    [["A -> B;", "B -> A;"], ["A -> B"], [["B", "A"]]],
    [["A -> B;", "B -> C;", "C -> B;"], ["A -> B", "B -> C"], [["C", "B"]]],
    [["A -> B;", "A -> A;", "C -> D;"], ["A -> B", "C -> D"], [["A", "A"]]],
  ]).test(
    "%s is composed of tree %s and %s",
    (arrows, treeArrows, restArrows) => {
      const graph = parse(arrows.join("\n"))[0];
      const [tree, rest] = graph.findTree();
      expect(tree).toEqual(parse(treeArrows.join("\n"))[0]);
      expect(rest.map((a) => a.toPair())).toEqual(restArrows);
    }
  );
});
