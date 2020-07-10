import { parse } from "./parser";

test("parse graph basic", () => {
  const tree = parse("A -> B");
  expect(tree).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
  ]);
});

test("parse graph basic with semi colon", () => {
  const tree = parse("A -> B;");
  expect(tree).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
  ]);
});

test("parse graph two pairs", () => {
  const tree = parse(["A -> B;", "A -> C;"].join("\n"));
  expect(tree).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
    { id: 2, name: "C", parent: 0 },
  ]);
});

test("parse graph two levels", () => {
  const tree = parse(["A -> B;", "B -> C;"].join("\n"));
  expect(tree).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
    { id: 2, name: "C", parent: 1 },
  ]);
});

test("parse graph two levels chained", () => {
  const tree = parse(["A -> B -> C;"].join("\n"));
  expect(tree).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
    { id: 2, name: "C", parent: 1 },
  ]);
});

test("parse graph no semi colon", () => {
  const tree = parse(["A -> B", "B -> C"].join("\n"));
  expect(tree).toEqual([
    { id: 0, name: "A" },
    { id: 1, name: "B", parent: 0 },
    { id: 2, name: "C", parent: 1 },
  ]);
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
  expect(tree).toEqual([
    { id: 0, name: "Root" },
    { id: 1, name: "A", parent: 0 },
    { id: 2, name: "A0", parent: 1 },
    { id: 3, name: "A1", parent: 1 },
    { id: 4, name: "B", parent: 0 },
    { id: 5, name: "B0", parent: 4 },
    { id: 6, name: "B1", parent: 4 },
  ]);
});
