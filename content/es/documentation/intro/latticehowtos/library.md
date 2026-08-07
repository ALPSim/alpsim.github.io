
---
title: Una Biblioteca de Redes y Grafos
toc: true
weight: 5
---

Como redes y grafos similares, redes finitas aparecerán en muchos modelos y simulaciones, es ventajoso definir las redes y grafos de uso común en una "biblioteca", y simplemente referenciarlos por nombre, por ejemplo, como parámetro de entrada de una simulación. El primer paso es dividir la definición del `<LATTICEGRAPH>` en cuatro partes:

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
    
Aquí hicimos uso de la predefinición de redes y celdas unitarias con nombre (por ejemplo, en una biblioteca), que luego podemos combinar referenciándolas en el elemento `<LATTICEGRAPH>`. Ahora podemos definir un elemento `<LATTICES>`, que puede contener cualquier número de elementos `<LATTICE>`, `<FINITELATTICE>`, `<UNITCELL>`, `<GRAPH>` y `<LATTICEGRAPH>`. Por ejemplo

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
