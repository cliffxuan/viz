import { concat, apply, zip, slice, uniq, values } from "ramda";

export class Vertex {
  constructor(public id: number, public name: string, public parent?: Vertex) {}
  depth(): number {
    return this.parent ? this.parent.depth() + 1: 1;
  }
}

export class Tree {
  vertices: Array<Vertex>;
  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;
  }
  depth(): number {
    return apply(Math.max, this.vertices.map(v => v.depth()));
  }
  size(): number {
    return this.vertices.length;
  }
  data(): Array<{ id: number; name: string; parent?: number }> {
    return this.vertices.map((v: Vertex) => ({
      id: v.id,
      name: v.name,
      parent: v.parent?.id,
    }));
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
    .map((p) => p.trim())
    .filter((p) => p !== "")
    .map(toPairs)
    .reduce(concat, []);
  const nameToVertex: Record<string, Vertex> = {};
  let id = -1;
  for (const [parent, child] of uniq(pairs)) {
    let parentId = nameToVertex[parent]?.id;
    if (parentId === undefined) {
      parentId = ++id;
      nameToVertex[parent] = new Vertex(parentId, parent);
    }
    let childId = nameToVertex[child]?.id;
    if (childId === undefined) {
      childId = ++id;
      nameToVertex[child] = new Vertex(childId, child, nameToVertex[parent]);
    } else {
      nameToVertex[child].parent = nameToVertex[parent];
    }
  }
  return new Tree(values(nameToVertex));
}
