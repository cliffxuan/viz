import { concat, zip, slice, uniq, values} from "ramda";

export interface Vertex {
  id: number;
  name: string;
  parent?: Vertex;
}

export class Tree {
  vertices: Array<Vertex>;
  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;
  }
  depth(): number {
    // const visited = {};
    // for (let v of this.vertices) {
    //   visited[v.id]
    // }
    return 2;
  }
  size(): number {
    return this.vertices.length;
  }
  spec(): Array<{id: number, name: string, parent?: number}> {
    return this.vertices.map(({id, name, parent}: Vertex) => ({id, name, parent: parent?.id}));
  }
} 

export function toPairs(chain: string): Array<Array<string>> {
  const nodes = chain.split("->").map((x: string) => x.trim());
  return zip(nodes, slice(1, Infinity, nodes));
}

export function parse(graph: string): Tree {
  const pairs = graph
    .split("\n")
    .map((row) => row.split(";"))
    .reduce(concat, [])
    .map(p => p.trim())
    .filter(p => p !== "")
    .map(toPairs)
    .reduce(concat, []);
  const nameToVertex: Record<string, Vertex> = {};
  let id = -1;
  for (const [parent, child] of uniq(pairs)) {
    let parentId = nameToVertex[parent]?.id;
    if (parentId === undefined) {
      parentId = ++id;
      nameToVertex[parent] = { id: parentId, name: parent };
    }
    const childId = nameToVertex[child]?.id ?? ++id;
    nameToVertex[child] = { id: childId, name: child, parent: nameToVertex[parent]};
  }
  return new Tree(values(nameToVertex));
}
