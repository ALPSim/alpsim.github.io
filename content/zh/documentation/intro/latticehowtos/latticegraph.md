
---
title: Lattices and Graphs
toc: true
weight: 4
---

In the simulation of lattice models, one usually considers a model defined on an infinite or finite lattice. Here, we explain how to specify both in XML format.

## A simple graph

The graphs in most physics simulations are not irregular graphs, but built up regularly, like a lattice

![The first simple graph.](../figs/tutoriallatticehowtolatticegraph1.gif)

We can capture the regularity of this graph by putting it down onto a lattice:

![The graph on a lattice.](../figs/tutoriallatticehowtolatticegraph2.gif)

This lattice can be described by a unit cell, and the graph built up from a "unit cell graph" on the unit cell:

![Unit cell graph.](../figs/tutoriallatticehowtolatticegraph3.gif)

The "unit cell graph" consists of a single vertex, and there is a edge to the same vertex in the neighboring cell. We can describe such a graph on a lattice in XML, by combining a LATTICE or FINITELATTICE with a UNITCELL element describing the graph on the unit cell from which the full graph is created:

    <LATTICEGRAPH>
        <FINITELATTICE>
        <LATTICE dimension="1"/>
            <EXTENT size="6"/>
            <BOUNDARY type="open"/>
        </LATTICE>
        </FINITELATTICE>
        <UNITCELL dimension="1" vertices="1">
        <VERTEX/>
        <EDGE>
            <SOURCE vertex="1"/>
            <TARGET vertex="1" offset="1"/>
        </EDGE>
        </UNITCELL>
    </LATTICEGRAPH>
  
The edge in the unit cell goes from vertex 1 in the cell to vertex 1 in the cell to the right (with an offset +1), as described in the EDGE element. The offet of 0 in the SOURCE element was omitted, as 0 is the default value for the offet.

To describe an infinite chain we would use a LATTICE element instead of the FINITELATTICE one.

## A complex example

We can again describe graphs with colored edges and vertices, or add other attributes like coordinates to the vertices. Also, for the description of the lattice the full machinery described for the lattice is available. We will show one example for a complex periodic graph on an L x W rectangular lattice:

![A complex periodic graph on a lattice.](../figs/tutoriallatticehowtolatticegraph4.jpg)

This graph on a lattice can be built from this complex unit cell graph decorating the rectangular lattice:

![A complex graph in a unit cell.](../figs/tutoriallatticehowtolatticegraph5.jpg)

The XML description is:

    <LATTICE name="square" dimension="2">
        <BASIS>
        <VECTOR> 1 0 </VECTOR>
        <VECTOR> 0 1 </VECTOR>
        </BASIS>
    </LATTICE>
    <FINITELATTICE name="rectangular periodic" dimension="2">
        <LATTICE ref="square"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W,L"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL name="complex example" dimension="2" vertices="2">
        <VERTEX id="1" type="0"><COORDINATE> 0.3 0.7 </COORDINATE></VERTEX>
        <VERTEX id="2" type="1"><COORDINATE> 0.6 0.3 </COORDINATE></VERTEX>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="1 0"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 1"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="2"/></EDGE>
    </UNITCELL>
    <LATTICEGRAPH>
        <FINITELATTICE ref="rectangular periodic"/>
        <UNITCELL ref="complex example"/>
    </LATTICEGRAPH>
    
Here we made us of the predefinition of named lattices and unit cells (e.g. in a library), which we can then combine by referencing them in the LATTICEGRAPH element. Alternatively we could have defined everything in the LATTICEGRAPH element:

    <LATTICEGRAPH>
        <FINITELATTICE dimension="2">
        <LATTICE dimension="2">
            <BASIS>
            <VECTOR> 1 0 </VECTOR>
            <VECTOR> 0 1 </VECTOR>
            </BASIS>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W,L"/>
        <BOUNDARY type="periodic"/>
        </FINITELATTICE>
        <UNITCELL dimension="2" vertices="2">
        <VERTEX id="1" type="0"><COORDINATE> 0.3 0.7 </COORDINATE></VERTEX>
        <VERTEX id="2" type="1"><COORDINATE> 0.6 0.3 </COORDINATE></VERTEX>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="1 0"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 1"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="2"/></EDGE>
        </UNITCELL>
    </LATTICEGRAPH>
  
Since both coordinates for the vertices in the unit cell, as well as basis vectors for the lattice are given, the coordinates of all vertices can be calculated.

  
