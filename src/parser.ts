import { concat, apply, zip, slice, uniq, values } from "ramda";

export class Vertex {
  constructor(public id: number, public name: string, public parent?: Vertex) {}
  depth(cache?: Record<number, number>): number {
    if (cache !== undefined) {
      const cachedValue = cache[this.id];
      if (cachedValue !== undefined) {
        return cachedValue;
      }
    }
    // TODO cyclic
    const result = this.parent ? this.parent.depth(cache) + 1: 1;
    if (cache !== undefined) {
      cache[this.id] = result;
    }
    return result;
  }
}

export class Tree {
  vertices: Array<Vertex>;
  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;
  }
  get depth(): number {
    const cache = {};
    return apply(Math.max, this.vertices.map(v => v.depth(cache)));
  }
  get size(): number {
    // TODO number of leaves only
    return this.vertices.length;
  }
  get data(): Array<{ id: number; name: string; parent?: number }> {
    return this.vertices.map((v: Vertex) => ({
      id: v.id,
      name: v.name,
      parent: v.parent?.id,
    }));
  }
  get roots(): Array<Vertex> {
    return this.vertices.filter(v => v.parent === undefined);
  }
  get isAcyclic(): boolean {
    if (this.roots.length === 0) {
      return true
    }
    // TODO implement
    return false
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
