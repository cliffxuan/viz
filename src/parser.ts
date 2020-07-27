import { apply, flatten } from "ramda";
import { tokenize, Pair, groupByPair } from "./tokenizer";

export class Vertex {
  id: number;
  name: string;
  predecessors: Array<Vertex>;
  successors: Array<Vertex>;

  constructor(
    id: number,
    name: string,
    predecessors?: Array<Vertex>,
    successors?: Array<Vertex>
  ) {
    this.id = id;
    this.name = name;
    this.predecessors = predecessors ?? ([] as Vertex[]);
    this.successors = successors ?? ([] as Vertex[]);
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
    const result =
      this.predecessors.length > 0
        ? apply(
            Math.min,
            this.predecessors.map((v) => v.depth(cache))
          ) + 1
        : 1;
    if (cache !== undefined) {
      cache[this.id] = result;
    }
    return result;
  }

  pathTo(vertex: Vertex, visited?: Array<Vertex>): Array<Vertex> | null {
    if (visited === undefined) {
      visited = [] as Vertex[];
    }
    if (this.successors.length === 0) {
      return null;
    }
    for (let successor of this.successors) {
      if (successor === vertex) {
        return [this, successor] as Vertex[];
      }
      if (visited.includes(successor)) {
        return null;
      }
      visited.push(successor);
      const successorPath = successor.pathTo(vertex, visited); // recursive
      if (successorPath === null) {
        continue;
      } else {
        return [this as Vertex].concat(successorPath);
      }
    }
    return null;
  }

  isDescendant(vertex: Vertex): boolean {
    if (vertex === this) {
      return true;
    }
    if (
      vertex.successors.filter((successor) => this.isDescendant(successor))
        .length > 0
    ) {
      return true;
    }
    return false;
  }

  get descendants(): Array<Vertex> {
    // TODO too much recursion
    return this.successors.concat(
      flatten(this.successors.map((successor) => successor.descendants))
    );
  }

  get isAcyclic(): boolean {
    if (this.pathTo(this) !== null) {
      return false;
    }
    for (let successor of this.successors) {
      if (!successor.isAcyclic) {
        return false;
      }
    }
    return true;
  }
}

export class Arrow {
  constructor(public start: Vertex, public end: Vertex) {}

  toString(): string {
    return `${this.start.name} -> ${this.end.name}`;
  }

  toPair(): [string, string] {
    return [this.start.name, this.end.name];
  }
}

export class DirectedGraph {
  vertices: Array<Vertex>;

  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;
  }

  get arrows(): Array<Arrow> {
    return flatten(
      this.vertices.map((v) => v.successors.map((e) => new Arrow(v, e)))
    );
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
    return this.vertices.filter((v) => v.successors.length === 0).length;
  }

  get data(): Array<any> {
    if (this.isTree || this.isMultiTree) {
      return this.roots.map((root) =>
        this.vertices
          .filter((v) => v.isDescendant(root))
          .map((v: Vertex) => ({
            id: v.id,
            name: v.name,
            parent: v.predecessors[0]?.id,
          }))
      );
    }
    return []; // TODO find sub graph
  }

  get roots(): Array<Vertex> {
    return this.vertices.filter((v) => v.predecessors.length === 0);
  }

  get isTree(): boolean {
    if (this.roots.length !== 1) {
      return false;
    }
    if (this.vertices.filter((v) => v.predecessors.length > 1).length > 0) {
      return false;
    }
    if (this.vertices.filter((v) => v.predecessors.includes(v)).length > 0) {
      return false;
    }
    return true;
  }

  get isMultiTree(): boolean {
    if (this.roots.length < 2) {
      return false;
    }
    if (this.vertices.filter((v) => v.predecessors.length > 1).length > 0) {
      return false;
    }
    if (this.vertices.filter((v) => v.predecessors.includes(v)).length > 0) {
      return false;
    }
    return true;
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

  findTree(): [DirectedGraph, Array<[string, string]>] {
    if (this.isTree || this.isMultiTree) {
      return [this, []];
    }
    const treePairs = [];
    const restPairs = [];
    let graph = new DirectedGraph([]);
    for (let arrow of this.arrows) {
      treePairs.push(arrow.toPair());
      let newGraph = DirectedGraph.fromPairs(treePairs);
      if (!(newGraph.isMultiTree || newGraph.isTree)) {
        treePairs.pop();
        restPairs.push(arrow.toPair());
      } else {
        graph = newGraph;
      }
    }
    return [graph, restPairs];
  }

  static fromPairs(pairs: Array<[string, string]>): DirectedGraph {
    const nameToVertex: Record<string, Vertex> = {};
    let id = -1;
    for (const [predecessorName, successorName] of pairs) {
      let predecessorId = nameToVertex[predecessorName]?.id;
      let successorId = nameToVertex[successorName]?.id;

      if (predecessorId === undefined) {
        predecessorId = ++id;
        nameToVertex[predecessorName] = new Vertex(
          predecessorId,
          predecessorName
        );
      }
      if (successorId === undefined) {
        successorId = ++id;
        nameToVertex[successorName] = new Vertex(successorId, successorName);
      }
      const successor = nameToVertex[successorName];
      const predecessor = nameToVertex[predecessorName];
      successor.predecessors.push(predecessor);
      predecessor.successors.push(successor);
    }
    return new DirectedGraph(Object.values(nameToVertex));
  }
}

export class Tree {
  constructor(public vertices: Array<Vertex>) {}

  static fromRoot(root: Vertex): Tree {
    return new Tree([root].concat(root.descendants));
  }

  get root(): Vertex {
    return this.vertices.filter((v) => v.predecessors.length === 0)[0];
  }

  get data(): Array<{ id: number; name: string; predecessors?: number }> {
    return this.vertices
      .filter((v) => v.isDescendant(this.root))
      .map((v: Vertex) => ({
        id: v.id,
        name: v.name,
        parent: v.predecessors[0]?.id,
      }));
  }

  get depth(): number {
    const cache = {};
    return apply(
      Math.max,
      this.vertices.map((v) => v.depth(cache))
    );
  }

  get breadth(): number {
    return this.vertices.filter((v) => v.successors.length === 0).length;
  }
}

export function parse(graph: string): [DirectedGraph, Record<string, Pair[]>] {
  const pairToPos: Record<string, Pair[]> = groupByPair(tokenize(graph));
  const pairs = Object.values(pairToPos).map((p) => p[0].pair);
  return [DirectedGraph.fromPairs(pairs), pairToPos];
}
