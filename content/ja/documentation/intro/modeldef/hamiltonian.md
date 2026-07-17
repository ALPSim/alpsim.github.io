
---
title: Hamiltonian Descriptions
toc: true
weight: 5
---

With these elements we can now describe the Hamiltonian of a model. A simple hardcore boson model could be:

    <HAMILTONIAN name="hardcore boson">
    <PARAMETER name="mu" default="0"/>
    <PARAMETER name="t" default="1"/>
    <PARAMETER name="t'" default="1"/>
    <BASIS ref="hardcore boson"/>
    <SITETERM type="0">
        -mu*n
    </SITETERM>
    <BONDTERM type="0" source="i" target="j">
        -t*(bdag(i)*b(j)+bdag(j)*b(i))
    </BONDTERM>
    <BONDTERM type="1" source="i" target="j">
        -t'*(bdag(i)*b(j)+bdag(j)*b(i))
    </BONDTERM>
    </HAMILTONIAN>

First, default values can be specified for parameters such as coupling constants by using `<PARAMETER>` elements. Next, one `<BASIS>` element specifies the basis used for the model, either fully specified inline or by a reference (using the `ref` attribute).

The terms of the Hamiltonian are next specified by site terms, associated with the sites of the lattice, and bond terms, associated with the bonds. Each of the `<SITETERM>` and `<BONDTERM>` elements can optionally take a type attribute, specifying which type of site (or bond) the term applies to — the same types specified in the lattice description. Omitting the type attribute applies the term to all sites or bonds for which no other term is explicitly specified.

The `<SITETERM>` elements contain terms of the Hamiltonian associated with a single site. In the above example the term `mu` refers to the parameter `mu` while the term `n` refers to the operator `n` described in [Quantum Operators](../operators). In the `<BONDTERM>` elements, the operators must refer to two different sites; this is done by adding the site index in parentheses after the operator, e.g. as in `n(i)` to act on site `i`. The source and target attributes name the variables used to refer to the two sites (`i` and `j` in the example).

To simplify writing Hamiltonians, previously defined site and bond operators can be reused instead of writing out matrix elements again. For a transverse field spin model we can use the `Sx` and `exchange` operators defined in [Quantum Operators](../operators):

    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
        -h*Sz(i)-Gamma*Sx(i)
    </SITETERM>
    <BONDTERM source="i" target="j">
        J*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>

Site-type dependent coupling terms can either be specified as in the first example, giving a type attribute restricting the applicability of a site or bond term, or by using the `#` wildcard character in the name of coupling constants, which will be replaced by the type of the site or bond as in:

    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
        <PARAMETER name="h#" default="h"/>
        <PARAMETER name="Gamma#" default="Gamma"/>
        -h#*Sz(i)-Gamma#*Sx(i)
    </SITETERM>
    <BONDTERM source="i" target="j">
        <PARAMETER name="J#" default="J"/>
        J#*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>

We can now specify `h0` and `Gamma0` on sites of type 0 and `J0` on bonds of type 0, `h1`, `Gamma1`, and `J1` for type 1, and so on — this is exactly how, e.g., the `anisotropic2d` unit cell (see [A Library of Lattices and Graphs](../../latticehowtos/library)) lets a model assign different couplings `J0`/`J1` to bonds along each lattice direction. `J`, `h`, and `Gamma` here are the same parameters described in [ALPS Model Definitions](..).

Extensions to more complex terms, such as 3- and 4-site terms, are in preparation and will be included here as soon as the ALPS libraries support such terms.

---

For an overview of the rest of this section, see [ALPS Model Definitions](..). For the operators used in these Hamiltonian terms, see [Quantum Operators](../operators). For the other ALPS documentation sections, see the [General Introduction](../..).
