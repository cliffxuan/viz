import { flatten, zip, slice, fromPairs } from "ramda";

export function toPairs(chain: string): Array<[string, string]> {
  const nodes = chain.split("->").map((x: string) => x.trim());
  return zip(nodes, slice(1, Infinity, nodes));
}

export class Arrow {
  constructor(public start: string, public end: string) {}

  toString(): string {
    return `${this.start} -> ${this.end}`;
  }

  toPair(): [string, string] {
    return [this.start, this.end];
  }
}

export type ArrowWithPosition = {
  arrow: Arrow;
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
): Array<ArrowWithPosition> {
  const nodes = splitWith(chain, "->");
  return zip(nodes, nodes.slice(1)).map(
    ([[prev, prevPos], [next, nextPos]]) => ({
      arrow: new Arrow(prev, next),
      startCol: startCol + prevPos - 1,
      endCol: startCol + nextPos + next.length - 1,
      startRow: rowNum,
      endRow: rowNum,
    })
  );
}

export function tokenize(graph: string): Record<number, ArrowWithPosition> {
  const arrows = graph.split("\n").map((chain, index) =>
    splitWith(chain, ";")
      .filter(([p, _]) => p.trim() !== "")
      .map(([arrow, startCol]) => extractPairs(arrow, startCol, index + 1))
  );
  return fromPairs(flatten(arrows).map((arrow, index) => [index, arrow]));
}

export function groupByArrow(
  arrowsWithPos: Record<number, ArrowWithPosition>
): Record<string, Array<ArrowWithPosition>> {
  const arrowToPositions: Record<string, Array<ArrowWithPosition>> = {};
  for (let ps of Object.values(arrowsWithPos)) {
    const { arrow } = ps;
    const key = arrow.toString()
    if (arrowToPositions[key] === undefined) {
      arrowToPositions[key] = [];
    }
    arrowToPositions[key].push(ps);
  }
  return arrowToPositions;
}
