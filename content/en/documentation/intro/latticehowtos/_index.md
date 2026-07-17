
---
title: Lattice Definitions
toc: true
weight: 2
---

Every ALPS lattice simulation runs on a graph — a set of sites and the bonds between them — specified in XML. This section builds that XML up in stages: from an arbitrary graph with explicit vertices and edges, through the unit-cell machinery used to describe regular (finite or infinite) lattices, to combining the two into the graph ALPS actually simulates, bundling the result into a reusable library, and finally checking that what you defined is what you meant.

## [Introduction](intro)

Why lattices and graphs need to be specified in an input file at all, an overview of the five HOWTOs below, a reference figure of the most common lattices already built into ALPS, and a pointer to the full ALPS lattice library file (`lib/xml/lattices.xml`).

## [Simple Graphs](simplegraph)

How to specify an arbitrary graph directly, by listing every `<VERTEX>` and `<EDGE>` in XML — no regularity or lattice structure assumed. Covers colored graphs (vertex and edge `type` attributes, for distinguishing sublattices or bond types) and attaching spatial `<COORDINATE>`s to vertices.

## [Lattice and Unit Cells](unitcell)

How to describe a *regular* lattice compactly, as a unit cell repeated by translation, instead of listing every site by hand. Covers infinite lattices (via `<LATTICE>` and its basis vectors, which can be numeric or symbolic/parametrized), finite lattices of a given extent (via `<FINITELATTICE>` and `<EXTENT>`, with fixed, parametrized, or partially-infinite dimensions), open and periodic `<BOUNDARY>` conditions, and referencing a previously defined `<LATTICE>` by name instead of redefining it.

## [Lattices and Graphs](latticegraph)

How to turn a lattice into the actual graph ALPS simulates, by decorating each unit cell with a `<UNITCELL>` graph (its own vertices and edges, including bonds that cross into neighboring cells) and combining it with a `<LATTICE>` or `<FINITELATTICE>` inside a `<LATTICEGRAPH>` element. Walks through a minimal one-vertex chain and a more complex two-vertex unit cell on a periodic rectangular lattice.

## [A library of Lattices and Graphs](library)

How to collect named `<LATTICE>`, `<FINITELATTICE>`, `<UNITCELL>`, and `<LATTICEGRAPH>` definitions inside a single `<LATTICES>` element, so that a simulation's input file can refer to a lattice by name (e.g. `LATTICE="square lattice"`) instead of repeating its full definition every time — exactly how the built-in ALPS lattice library is organized.

## [Check Lattice Graph](checklattice)

How to sanity-check a new lattice definition with the `printgraph` tool, which generates the graph from a parameter file in exactly the way an ALPS application would generate it internally, so you can confirm it matches what you intended before running a real simulation on it.
