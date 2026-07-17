
---
title: Lattice Basis
toc: true
weight: 3
---

The basis of a lattice model is specified by giving a site basis for each type of site (vertex) in the lattice. If there is just one type of site, only one site basis needs to be given, either by referencing a previously defined [site basis](../sitebasis) or by declaring it inline:

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    </BASIS>

    <BASIS name="spin-1">
    <SITEBASIS name="spin-1">
        <QUANTUMNUMBER name="S" min="1" max="1"/>
        <QUANTUMNUMBER name="Sz" min="-1" max="1"/>
    </SITEBASIS>
    </BASIS>

Like `<SITEBASIS>`, the `<BASIS>` element takes a name attribute, by which it can later be referenced from a `<HAMILTONIAN>` (see [Hamiltonian Descriptions](../hamiltonian)). It contains a `<SITEBASIS>` element which is used as the default for all sites, either referencing a previously defined one by a ref attribute, as in the first example, or declaring the full site basis inline, as in the second. (The first example's `ref="spin"` points to the parametrized `spin` site basis defined in [Quantum Operators](../operators), used throughout the rest of this page.)

## Lattices with more than one site per unit cell

If the lattice contains more than one site per unit cell, the `<BASIS>` command should contain one `<SITEBASIS>` entry for each site of the unit cell. Each entry should have a different type, corresponding to the definitions given in the lattice library file (see [Lattice Definitions](../../latticehowtos)).

The following basis is a valid example for the Hilbert space of a bipartite lattice:

    <BASIS name="Kondo lattice">
    <SITEBASIS type="0" ref="fermion"/>
    <SITEBASIS type="1" ref="spin-1/2"/>
    </BASIS>

In some spin models we might have the same local site basis but with the magnitude of the spin varying by site type. For example, we can set the value of the spin on sites of type 0 and 1 through the parameters `local_S0` and `local_S1`, while still providing suitable defaults:

    <BASIS name="spin">
    <SITEBASIS type="0" ref="spin">
        <PARAMETER name="local_spin" value="local_S0"/>
        <PARAMETER name="local_S0" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    <SITEBASIS type="1" ref="spin">
        <PARAMETER name="local_spin" value="local_S1"/>
        <PARAMETER name="local_S1" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>

Here `local_spin` is the parameter the `spin` site basis itself uses internally to set `S` (see [Quantum Operators](../operators)); the chain of defaults means a user gets a sensible fallback at every level: leave everything unset and both site types get spin 1/2 from `local_S`; set `local_S=1` and both types become spin-1; or override `local_S0`/`local_S1` directly to give the two site types different spins.

When adding more site types this can become cumbersome, and the ALPS format allows a shortcut. If no `type` is specified, the `<SITEBASIS>` matches any site, and the wildcard character `#` in any parameter name is replaced by the site type. That way the above example can be extended to an infinite number of site types and written more compactly as:

    <BASIS name="spin">
    <SITEBASIS ref="spin">
        <PARAMETER name="local_spin" value="local_S#"/>
        <PARAMETER name="local_S#" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>

## Constraints

Finally, the basis can be restricted to a sector where a quantum number, summed over all sites, takes a fixed value. For example, to restrict a spin basis to a fixed total `Sz` equal to the parameter `Sz_total`, a `<CONSTRAINT>` element can be added:

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    <CONSTRAINT quantumnumber="Sz" value="Sz_total"/>
    </BASIS>

Restricting to a sector like this reduces the size of the Hilbert space, which matters most for methods that work with the full Hilbert space directly, such as exact diagonalization.

---

For an overview of the rest of this section, see [ALPS Model Definitions](..). For the single-site bases combined here, see [Site Basis](../sitebasis). For the other ALPS documentation sections, see the [General Introduction](../..).
