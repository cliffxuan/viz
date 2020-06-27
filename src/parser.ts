import {concat, zip, slice, uniq} from 'ramda';

export interface Vertex {
  id: number;
  name: string;
  parent?: number;
}

export type Tree = {
  tree: Array<Vertex>;
}

export function toPairs(chain: string): Array<Array<string>> {
  const nodes = chain.split("->").map(x => x.trim());
  return zip(nodes, slice(1, Infinity, nodes));
}

export function parse(graph: string): Tree {
  const nameToId: Record<string, number> = {};
  let id = -1;
  const chains = graph
    .split("\n")
    .map(row => row.split(";"))
    .reduce(concat, [])
    .map(p => p.trim())
    .filter(p => p !== "");
  const pairs = chains.map(chain => toPairs(chain)).reduce(concat, []);
  const tree: Array<Vertex> = [];
  for (const [parent, child] of uniq(pairs)) {
    let parentId = nameToId[parent];
    if (parentId === undefined) {
      nameToId[parent] = parentId = ++id;
      tree.push({ id: parentId, name: parent });
    }
    const childId = ++id;
    nameToId[child] = childId;
    tree.push({ id: childId, name: child, parent: parentId });
  }
  return { tree };
}
