import { parse } from "./parser";
import each from "jest-each";

test("parse graph basic", () => {
  const tree = parse("A -> B");
  expect(tree.data[0]).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
  ]);
  expect(tree.breadth).toEqual(1);
  expect(tree.depth).toEqual(2);
  expect(tree.roots.map((v) => v.name)).toEqual(["A"]);
});

test("parse graph basic with semi colon", () => {
  const tree = parse("A -> B;");
  expect(tree.data[0]).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
  ]);
  expect(tree.breadth).toEqual(1);
  expect(tree.depth).toEqual(2);
  expect(tree.roots.map((v) => v.name)).toEqual(["A"]);
});

test("parse graph two pairs", () => {
  const tree = parse(["A -> B;", "A -> C;"].join("\n"));
  expect(tree.data[0]).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
    { id: 2, name: "C", parent: 0 },
  ]);
  expect(tree.breadth).toEqual(2);
  expect(tree.depth).toEqual(2);
  expect(tree.roots.map((v) => v.name)).toEqual(["A"]);
});

test("parse graph two levels", () => {
  const tree = parse(["A -> B;", "B -> C;"].join("\n"));
  expect(tree.data[0]).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
    { id: 2, name: "C", parent: 1 },
  ]);
  expect(tree.breadth).toEqual(1);
  expect(tree.depth).toEqual(3);
  expect(tree.roots.map((v) => v.name)).toEqual(["A"]);
});

test("parse graph two levels reversed", () => {
  const tree = parse(["B -> C;", "A -> B;"].join("\n"));
  expect(tree.data[0]).toEqual([
    { id: 0, name: "B", parent: 2 },
    { id: 1, name: "C", parent: 0 },
    { id: 2, name: "A" },
  ]);
  expect(tree.breadth).toEqual(1);
  expect(tree.depth).toEqual(3);
  expect(tree.roots.map((v) => v.name)).toEqual(["A"]);
});

test("parse graph two levels chained", () => {
  const tree = parse(["A -> B -> C;"].join("\n"));
  expect(tree.data[0]).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
    { id: 2, name: "C", parent: 1 },
  ]);
  expect(tree.breadth).toEqual(1);
  expect(tree.depth).toEqual(3);
  expect(tree.roots.map((v) => v.name)).toEqual(["A"]);
});

test("parse graph no semi colon", () => {
  const tree = parse(["A -> B", "B -> C"].join("\n"));
  expect(tree.data[0]).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
    { id: 2, name: "C", parent: 1 },
  ]);
  expect(tree.breadth).toEqual(1);
  expect(tree.depth).toEqual(3);
  expect(tree.roots.map((v) => v.name)).toEqual(["A"]);
});

test("parse graph repeated link", () => {
  const tree = parse(
    [
      "Root -> A -> A0;",
      "Root -> A -> A1;",
      "Root -> B -> B0;",
      "Root -> B -> B1;",
    ].join("\n")
  );
  expect(tree.data[0]).toEqual([
    { id: 0, name: "Root" },
    { id: 1, name: "A", parent: 0 },
    { id: 2, name: "A0", parent: 1 },
    { id: 3, name: "A1", parent: 1 },
    { id: 4, name: "B", parent: 0 },
    { id: 5, name: "B0", parent: 4 },
    { id: 6, name: "B1", parent: 4 },
  ]);
  expect(tree.breadth).toEqual(4);
  expect(tree.depth).toEqual(3);
  expect(tree.roots.map((v) => v.name)).toEqual(["Root"]);
});

test("parse cycle", () => {
  const cycle = parse(["A -> B;", "B -> A;"].join("\n"));
  expect(cycle.breadth).toEqual(0);
  expect(cycle.depth).toEqual(Infinity);
  expect(cycle.data).toEqual([]);  // temp
});

test("parse cycle 2", () => {
  const cycle = parse(["A -> B -> C;", "C -> B;"].join("\n"));
  expect(cycle.breadth).toEqual(0);
  expect(cycle.depth).toEqual(Infinity);
  expect(cycle.data).toEqual([]);  // temp
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
    const tree = parse(edges.join("\n"));
    expect(tree.isAcyclic).toBe(isAcyclic);
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
      const tree = parse(edges.join("\n"));
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
    [["A -> B;"], true],
    [["A -> B -> C;"], true],
    [["A -> B -> C;", "B -> D;"], true],
    [["A0 -> B -> C;", "A1 -> C;"], false],
    [["A -> B -> C;", "C -> B;"], false],
    [["A -> B;", "B -> A;"], false],
    [["A -> B;", "C -> D;"], false],
  ]).test("directed graph %s is a tree? %s", (arrows, isTree) => {
    const graph = parse(arrows.join("\n"));
    expect(graph.isTree).toBe(isTree);
  });
});

describe("isMultiTree", () => {
  each([
    [["A -> B;"], false],
    [["A -> B -> C;"], false],
    [["A -> B -> C;", "B -> D;"], false],
    [["A0 -> B -> C;", "A1 -> C;"], false],
    [["A -> B -> C;", "C -> B;"], false],
    [["A -> B;", "B -> A;"], false],
    [["A -> B;", "C -> D;"], true],
    [["A -> B;", "A -> C", "D -> E;"], true],
  ]).test("directed graph %s has multiple trees? %s", (arrows, isMultiTree) => {
    const graph = parse(arrows.join("\n"));
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
    const graph = parse(arrows.join("\n"));
    const vX = graph.vertices.filter((v) => v.name === vx)[0];
    const vY = graph.vertices.filter((v) => v.name === vy)[0];
    expect(vX.isDescendant(vY)).toBe(isDescendant);
  });
});
