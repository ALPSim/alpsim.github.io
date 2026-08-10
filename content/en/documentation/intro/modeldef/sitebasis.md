
---
title: Site Basis
toc: true
weight: 2
---

Basis states of a single site are described by one or more quantum numbers as in:

    <SITEBASIS name="hardcore boson">
    <QUANTUMNUMBER name="N" min="0" max="1"/>
    </SITEBASIS>

    <SITEBASIS name="spin-1/2">
    <QUANTUMNUMBER name="S" min="1/2" max="1/2"/>
    <QUANTUMNUMBER name="Sz" min="-1/2" max="1/2"/>
    </SITEBASIS>

    <SITEBASIS name="fermion">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1" type="fermionic"/>
    </SITEBASIS>

The first example above describes a hardcore boson (one bosonic mode with occupation restricted to 0 or 1), the second a spin-1/2, and the third a spinful fermion that allows double occupancy (independent `Nup` and `Ndown`, each ranging over 0 or 1).

Note that the spin-1/2 example above declares both `S` and `Sz`, even though `Sz` alone would already distinguish the two states: the total spin `S` is needed separately because it appears in the matrix elements of the spin operators defined in [Quantum Operators](../operators).

The `<SITEBASIS>` takes a name attribute by which it can later be referenced. The `<QUANTUMNUMBER>` elements each take a name attribute, and minimum and maximum values via the min and max attributes. The quantum numbers can take values between min, min+1, min+2 ... up to max. Optionally, a type attribute can be set to bosonic (the default) or fermionic. It should be set to fermionic when the quantum number counts a fermionic degree of freedom (e.g. a fermion occupation number), so that operators built from it anticommute correctly with fermionic operators on other sites.

The range of the quantum numbers can be parametrized by input parameters, and a `default` can be specified such as in

    <SITEBASIS name="boson">
    <PARAMETER name="Nmax" default="infinity"/>
    <QUANTUMNUMBER name="N" min="0" max="Nmax"/>
    </SITEBASIS>

For more complicated models, such as a t-J model, sometimes several equivalent choices of quantum numbers are possible. We can label the states either by the particle number and spin, or by the number of up and down spins:

    <SITEBASIS name="t-J">
    <QUANTUMNUMBER name="N" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="S" min="N/2" max="N/2"/>
    <QUANTUMNUMBER name="Sz" min="-S" max="S"/>
    </SITEBASIS>

    <SITEBASIS name="alternative t-J">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1-Nup" type="fermionic"/>
    </SITEBASIS>

In the first version, `min="N/2" max="N/2"` pins `S` to exactly `N/2` rather than letting it range freely: an empty site (`N=0`) is forced to have `S=0`, and a singly occupied site (`N=1`) is forced to have `S=1/2`, which is exactly the no-double-occupancy constraint that defines the t-J model. The two site bases describe the same three physical states (empty, spin up, spin down) and are equally valid; which one is more convenient depends on the Hamiltonian: the `N`,`S` basis is natural when the total spin is a useful quantum number, while the `Nup`,`Ndown` basis is often simpler when writing operators that act separately on the up- and down-spin fermions, such as the `cdag_up`/`c_up` operators in the `fermion_hop` example in [Quantum Operators](../operators).

---

For an overview of the rest of this section, see [ALPS Model Definitions](..). For how single-site bases are combined into the basis of the whole lattice, see [Lattice Basis](../latticebasis). For the other ALPS documentation sections, see the [General Introduction](../..).
