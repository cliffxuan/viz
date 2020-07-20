import { tokenize, splitWith, extractPairs, groupByPair } from "./tokenizer";
import each from "jest-each";

describe("tokenize", () => {
  each([
    [
      ["a -> b;"],
      {
        0: { pair: ["a", "b"], startRow: 1, endRow: 1, startCol: 1, endCol: 7 },
      },
    ],
    [
      ["a -> b -> c;"],
      {
        0: { pair: ["a", "b"], startRow: 1, endRow: 1, startCol: 1, endCol: 7 },
        1: {
          pair: ["b", "c"],
          startRow: 1,
          endRow: 1,
          startCol: 6,
          endCol: 12,
        },
      },
    ],
    [
      ["a -> b;", "b -> c;"],
      {
        0: { pair: ["a", "b"], startRow: 1, endRow: 1, startCol: 1, endCol: 7 },
        1: { pair: ["b", "c"], startRow: 2, endRow: 2, startCol: 1, endCol: 7 },
      },
    ],
  ]).test("tokenize %s into %s", (rows, tokens) => {
    expect(tokenize(rows.join("\n"))).toEqual(tokens);
  });
});

describe("splitWith", () => {
  each([
    ["abc", ";", [["abc", 1]]],
    [
      "abc ; def",
      ";",
      [
        ["abc", 1],
        ["def", 7],
      ],
    ],
    [
      "abc -> def",
      "->",
      [
        ["abc", 1],
        ["def", 8],
      ],
    ],
    [
      "abc -> def -> ghi",
      "->",
      [
        ["abc", 1],
        ["def", 8],
        ["ghi", 15],
      ],
    ],
  ]).test("split %s by %s into %s", (str, sep, result) => {
    expect(splitWith(str, sep)).toEqual(result);
  });
});

describe("extractPairs", () => {
  each([
    [
      "abc -> def",
      1,
      1,
      [
        {
          pair: ["abc", "def"],
          startCol: 1,
          endCol: 11,
          startRow: 1,
          endRow: 1,
        },
      ],
    ],
    [
      "abc -> def -> ghi",
      5,
      2,
      [
        {
          pair: ["abc", "def"],
          startCol: 5,
          endCol: 15,
          startRow: 2,
          endRow: 2,
        },
        {
          pair: ["def", "ghi"],
          startCol: 12,
          endCol: 22,
          startRow: 2,
          endRow: 2,
        },
      ],
    ],
  ]).test(
    "extract pairs from %s from col %s and row %s gets %s",
    (str, startCol, colNum, result) => {
      expect(extractPairs(str, startCol, colNum)).toEqual(result);
    }
  );
});

describe("groupByPair", () => {
  each([
    [
      {
        0: { pair: ["a", "b"], startRow: 1, endRow: 1, startCol: 1, endCol: 7 },
      },
      {
        "a -> b": [
          {
            pair: ["a", "b"],
            startRow: 1,
            endRow: 1,
            startCol: 1,
            endCol: 7,
          },
        ],
      },
    ],
    [
      {
        0: { pair: ["a", "b"], startRow: 1, endRow: 1, startCol: 1, endCol: 7 },
        1: { pair: ["b", "c"], startRow: 2, endRow: 2, startCol: 1, endCol: 7 },
        2: { pair: ["a", "b"], startRow: 3, endRow: 3, startCol: 4, endCol: 9 },
      },
      {
        "a -> b": [
          {
            pair: ["a", "b"],
            startRow: 1,
            endRow: 1,
            startCol: 1,
            endCol: 7,
          },
          {
            pair: ["a", "b"],
            startRow: 3,
            endRow: 3,
            startCol: 4,
            endCol: 9,
          },
        ],
        "b -> c": [
          {
            pair: ["b", "c"],
            startRow: 2,
            endRow: 2,
            startCol: 1,
            endCol: 7,
          },
        ],
      },
    ],
  ]).test("groupByPair %s into %s", (pairsWithPos, result) => {
    expect(groupByPair(pairsWithPos)).toEqual(result);
  });
});

test("foo", () => {
  expect(new Map([[1, 2]])).toEqual(new Map([[1, 2]]));
});
