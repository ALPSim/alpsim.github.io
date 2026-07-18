
---
title: Check Lattice Graph
toc: true
weight: 6
---

After writing a new lattice definition, you will want to check that it is correct before running a real simulation on it. ALPS provides the `printgraph` tool for this: it reads a parameter file, builds the graph from the `LATTICE` (or `GRAPH`) it specifies — exactly the way an ALPS application would build it internally — and prints the resulting graph as `<GRAPH>` XML, listing every `<VERTEX>` and `<EDGE>`. Comparing this output against what you intended is a quick way to catch mistakes such as a wrong extent, a missing bond, or an incorrect boundary condition.

To run it, type:

    printgraph parameter_file

`parameter_file` is a plain ALPS parameter file — the same format used as input to `parameter2xml` — so no conversion step is needed first. If no file name is given, `printgraph` reads the parameter file from standard input instead; if the file name ends in `.xml`, it is read as an XML parameter file.

For example, the parameter file

    LATTICE = "square lattice"
    L = 2

selects the built-in `square lattice` (see [A Library of Lattices and Graphs](../library)) with a 2 x 2 periodic extent. Running `printgraph` on it produces:

    <GRAPH dimension="2" vertices="4" edges="8">
      <VERTEX id="1" type="0"><COORDINATE>0 0</COORDINATE></VERTEX>
      <VERTEX id="2" type="0"><COORDINATE>0 1</COORDINATE></VERTEX>
      <VERTEX id="3" type="0"><COORDINATE>1 0</COORDINATE></VERTEX>
      <VERTEX id="4" type="0"><COORDINATE>1 1</COORDINATE></VERTEX>
      <EDGE source="1" target="2" id="1" type="0" vector="0 1"/>
      <EDGE source="1" target="3" id="2" type="0" vector="1 0"/>
      <EDGE source="2" target="1" id="3" type="0" vector="0 1"/>
      <EDGE source="2" target="4" id="4" type="0" vector="1 0"/>
      <EDGE source="3" target="4" id="5" type="0" vector="0 1"/>
      <EDGE source="3" target="1" id="6" type="0" vector="1 0"/>
      <EDGE source="4" target="3" id="7" type="0" vector="0 1"/>
      <EDGE source="4" target="2" id="8" type="0" vector="1 0"/>
    </GRAPH>

Each of the 4 sites appears once as a `<VERTEX>`, with its Cartesian coordinates; each of the 8 bonds appears once as an `<EDGE>`, with periodic boundary conditions producing the wrap-around bonds (e.g. `source="2" target="1"`) alongside the "straight" ones. For a larger or unfamiliar lattice, redirecting the output to a file (`printgraph parameter_file > graph.xml`) makes it easier to inspect.

---

For an overview of the rest of this section, see [Lattice Definitions](..). For the `LATTICE`/`GRAPH` input parameters used to select a lattice or graph by name in a simulation, see [Common Parameters](../../parameters). For the other ALPS documentation sections, see the [General Introduction](../..).
