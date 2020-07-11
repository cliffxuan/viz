import { concat, apply, zip, slice, uniq, values } from "ramda";

export class Vertex {
  id: number;
  name: string;
  parent: Vertex | null;
  children: Array<Vertex>;

  constructor(
    id: number,
    name: string,
    parent?: Vertex,
    children?: Array<Vertex>
  ) {
    this.id = id;
    this.name = name;
    this.parent = parent ?? null;
    this.children = children ?? ([] as Vertex[]);
  }

  depth(cache?: Record<number, number>): number {
    if (!this.isAcyclic) {
      return Infinity;
    }
    if (cache !== undefined) {
      const cachedValue = cache[this.id];
      if (cachedValue !== undefined) {
        return cachedValue;
      }
    }
    // TODO cyclic
    const result = this.parent ? this.parent.depth(cache) + 1 : 1;
    if (cache !== undefined) {
      cache[this.id] = result;
    }
    return result;
  }

  pathTo(vertex: Vertex, visited?: Array<Vertex>): Array<Vertex> | null {
    if (visited === undefined) {
      visited = [] as Vertex[];
    }
    if (this.children.length === 0) {
      return null;
    }
    for (let child of this.children) {
      if (child === vertex) {
        return [this, child] as Vertex[];
      }
      if (visited.includes(child)) {
        return null;
      }
      visited.push(child);
      const childPath = child.pathTo(vertex, visited); // recursive
      if (childPath === null) {
        continue;
      } else {
        return [this as Vertex].concat(childPath);
      }
    }
    return null;
  }

  get isAcyclic(): boolean {
    if (this.pathTo(this) !== null) {
      return false;
    }
    for (let child of this.children) {
      if (!child.isAcyclic) {
        return false;
      }
    }
    return true;
  }
}

export class Tree {
  vertices: Array<Vertex>;

  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;
  }

  get depth(): number {
    if (!this.isAcyclic) {
      return Infinity;
    }
    const cache = {};
    return apply(
      Math.max,
      this.vertices.map((v) => v.depth(cache))
    );
  }

  get breadth(): number {
    return this.vertices.filter((v) => v.children.length === 0).length;
  }

  get data(): Array<{ id: number; name: string; parent?: number }> {
    return this.vertices.map((v: Vertex) => ({
      id: v.id,
      name: v.name,
      parent: v.parent?.id,
    }));
  }

  get roots(): Array<Vertex> {
    return this.vertices.filter((v) => v.parent === null);
  }

  get isAcyclic(): boolean {
    if (this.vertices.length === 0) {
      return true;
    }
    if (this.roots.length === 0) {
      return false;
    }
    if (this.roots.length === 1) {
      return this.roots[0].isAcyclic;
    }
    return true;
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
  for (const [parentName, childName] of uniq(pairs)) {
    let parentId = nameToVertex[parentName]?.id;
    let childId = nameToVertex[childName]?.id;

    if (parentId === undefined) {
      parentId = ++id;
      nameToVertex[parentName] = new Vertex(parentId, parentName);
    }
    if (childId === undefined) {
      childId = ++id;
      nameToVertex[childName] = new Vertex(
        childId,
        childName,
        nameToVertex[parentName]
      );
    } else {
      nameToVertex[childName].parent = nameToVertex[parentName];
    }
    nameToVertex[parentName].children.push(nameToVertex[childName]);
  }
  return new Tree(values(nameToVertex));
}
