
---
title: A Library of Lattices and Graphs
toc: true
weight: 5
---

As similar lattices, finite lattices and graphs will appear in many models and simulations, it is of advantage to define commonly used lattices and graphs in a "library", and just refer to them by name, e.g. as input parameter to a simulation. The first step is to divide the definition of the `<LATTICEGRAPH>` into four parts:

    <verbatim>
    <LATTICE name="square" dimension="2">
    <BASIS>
        <VECTOR> 1 0 </VECTOR>
        <VECTOR> 0 1 </VECTOR>
    </BASIS>
    </LATTICE>

    <FINITELATTICE name="rectangular periodic" dimension="2">
    <LATTICE ref="square"/>
    <PARAMETER name="L" />
    <PARAMETER name="W" default="L" />
    <EXTENT dimension="1" size="L"/>
    <EXTENT dimension="2" size="W"/>
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
    
Here we made use of the predefinition of named lattices and unit cells (e.g. in a library), which we can then combine be referencing them in the `<LATTICEGRAPH>` element. Now we can define a `<LATTICES>` element, which can contain any number of `<LATTICE>`, `<FINITELATTICE>`, `<UNITCELL>`, `<GRAPH>` and `<LATTICEGRAPH>` elements. For example

    <LATTICES>
    <LATTICE name="chain lattice" dimension="1">
    <BASIS><VECTOR>1</VECTOR></BASIS>
    </LATTICE>
    <LATTICE name="square lattice" dimension="2">
    <PARAMETER name="a" default="1"/>
    <BASIS><VECTOR>a 0</VECTOR><VECTOR>0 a</VECTOR></BASIS>
    </LATTICE>
    <LATTICE name="simple cubic lattice" dimension="3">
    <PARAMETER name="a" default="1"/>
    <BASIS>
        <VECTOR>a 0 0</VECTOR>
        <VECTOR>0 a 0</VECTOR>
        <VECTOR>0 0 a</VECTOR>
    </BASIS>
    </LATTICE>
    <UNITCELL name="simple1d" dimension="1">
    <VERTEX/>
    <EDGE><SOURCE vertex="1" offset="0"/><TARGET vertex="1" offset="1"/></EDGE>
    </UNITCELL>
    <UNITCELL name="simple2d" dimension="2">
    <VERTEX/>
    <EDGE><SOURCE vertex="1" offset="0 0"/><TARGET vertex="1" offset="0 1"/></EDGE>
    <EDGE><SOURCE vertex="1" offset="0 0"/><TARGET vertex="1" offset="1 0"/></EDGE>
    </UNITCELL>
    <UNITCELL name="simple3d" dimension="3" vertices="1">
    <VERTEX/>
    <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="1 0 0"/></EDGE>
    <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 1 0"/></EDGE>
    <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 0 1"/></EDGE>
    </UNITCELL>
    <LATTICEGRAPH name = "square lattice 3x3">
    <FINITELATTICE>
        <LATTICE ref="square lattice"/>
        <EXTENT dimension="1" size="3"/>
        <EXTENT dimension="2" size="3"/>
        <BOUNDARY dimension="1" type="periodic"/>
        <BOUNDARY dimension="2" type="open"/>
    </FINITELATTICE>
    <UNITCELL ref="simple2d"/>
    </LATTICEGRAPH>
    <LATTICEGRAPH name = "dimer">
    <FINITELATTICE>
        <LATTICE ref="chain lattice"/>
        <EXTENT dimension="1" size="2"/>
        <BOUNDARY type="open"/>
    </FINITELATTICE>
    <UNITCELL ref="simple1d"/>
    </LATTICEGRAPH>
    <LATTICEGRAPH name = "simple cubic lattice">
    <FINITELATTICE>
        <LATTICE ref="simple cubic lattice"/>
        <PARAMETER name="W" default="L"/>
        <PARAMETER name="H" default="W"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W"/>
        <EXTENT dimension="3" size="H"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL ref="simple3d"/>
    </LATTICEGRAPH>
    <LATTICEGRAPH name = "chain lattice">
    <FINITELATTICE>
        <LATTICE ref="chain lattice"/>
        <EXTENT dimension="1" size ="L"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL ref="simple1d"/>
    </LATTICEGRAPH>
    <LATTICEGRAPH name = "anisotropic square lattice">
    <FINITELATTICE>
        <LATTICE ref="square lattice"/>
        <PARAMETER name="W" default="L"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL ref="anisotropic2d"/>
    </LATTICEGRAPH>
    </LATTICES>
