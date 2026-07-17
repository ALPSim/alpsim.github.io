
---
title: Introduction
toc: true
weight: 1
---

## Specifying lattices and graphs within the ALPS framework

This section explains how lattices and graphs are specified within the ALPS framework. Specifying the lattice as part of the input file, rather than hard-coding it into the simulation program, means the same application can be reused unchanged across many different lattice geometries.

This page covers the following topics:

- [How to specify a simple graph in terms of vertices and edges](../simplegraph)
- [How to specify lattices and unit cells](../unitcell)
- [How to specify graphs corresponding to a lattice with a unit cell](../latticegraph)
- [How to create a library of lattices and graphs](../library)
- [How to check a graph generated from a lattice definition](../checklattice), using the `printgraph` tool, which regenerates a graph from a lattice definition exactly as an ALPS application would internally, so you can confirm it is what you intended

## Existing lattices (graphs) in the ALPS lattice library

### Most common lattices (graphs) at a glance

The nine most commonly used lattices are already built into the library and can be selected directly by name via the `LATTICE` parameter, without writing any XML yourself:

| # | `LATTICE` | Parameters | Remark |
| :- | :-------- | :--------- | :----- |
| 1 | `chain lattice` | `L` (length) | periodic, homogeneous |
| 2 | `open chain lattice` | `L` (length) | open, homogeneous |
| 3 | `square lattice` | `L` (length), `W` (width, default `L`) | periodic, homogeneous |
| 4 | `open square lattice` | `L` (length), `W` (width, default `L`) | open, homogeneous |
| 5 | `Kagome lattice` | `L` (length), `W` (width, default `L`) | periodic, homogeneous |
| 6 | `honeycomb lattice` | `L` (length), `W` (width, default `L`) | periodic, homogeneous |
| 7 | `inhomogeneous square lattice` | `L` (length), `W` (width, default `L`) | open, inhomogeneous |
| 8 | `simple cubic lattice` | `L` (length), `W` (width, default `L`), `H` (height, default `W`) | periodic, homogeneous |
| 9 | `inhomogeneous simple cubic lattice` | `L` (length), `W` (width, default `L`), `H` (height, default `W`) | open, inhomogeneous |

![Common lattices (graphs) in ALPS](../figs/commonalpslattices.jpg)

### Entire archive of lattices (graphs)

The entire archive of the ALPS lattice library can be found in the XML file `$ALPSPATH/lib/xml/lattices.xml`.

---

For the `LATTICE`/`GRAPH` input parameters that select one of these lattices in a simulation, see [Common Parameters](../../parameters). For an overview of the rest of this section, see [Lattice Definitions](..). For the other ALPS documentation sections, see the [General Introduction](../..).


