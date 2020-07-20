import { flatten, zip, slice, fromPairs } from "ramda";

export function toPairs(chain: string): Array<[string, string]> {
  const nodes = chain.split("->").map((x: string) => x.trim());
  return zip(nodes, slice(1, Infinity, nodes));
}

export type Pair = {
  pair: [string, string];
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
};

export function splitWith(str: string, sep: string): Array<[string, number]> {
  const parts = str.split(sep);
  const positions = [1];
  for (let part of parts) {
    const last = positions[positions.length - 1];
    positions[positions.length - 1] = last + part.search(/\S/);
    positions.push(last + part.length + sep.length);
  }
  return zip(
    parts.map((part) => part.trim()),
    positions
  );
}

export function extractPairs(
  chain: string,
  startCol: number,
  rowNum: number
): Array<Pair> {
  const nodes = splitWith(chain, "->");
  return zip(nodes, nodes.slice(1)).map(
    ([[prev, prevPos], [next, nextPos]]) => ({
      pair: [prev, next] as [string, string],
      startCol: startCol + prevPos - 1,
      endCol: startCol + nextPos + next.length - 1,
      startRow: rowNum,
      endRow: rowNum,
    })
  );
}

export function tokenize(graph: string): Record<number, Pair> {
  const arrows = graph.split("\n").map((chain, index) =>
    splitWith(chain, ";")
      .filter(([p, _]) => p.trim() !== "")
      .map(([arrow, startCol]) => extractPairs(arrow, startCol, index + 1))
  );
  return fromPairs(flatten(arrows).map((arrow, index) => [index, arrow]));
}

export function groupByPair(pairsWithPos: Record<number, Pair>) : Record<string, Array<Pair>> {
  const pairToPos: Record<string, Array<Pair>> = {};
  for (let ps of Object.values(pairsWithPos)) {
    const { pair } = ps;
    const key = `${pair[0]} -> ${pair[1]}`;
    if (pairToPos[key] === undefined) {
      pairToPos[key] = [];
    }
    pairToPos[key].push(ps);
  }
  return pairToPos;
}