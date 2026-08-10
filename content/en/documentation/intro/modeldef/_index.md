
---
title: ALPS Model Definitions
toc: true
weight: 5
---

As part of the ALPS project we need to describe quantum lattice models in a common XML format, independent of the lattice they run on (see [Lattice Definitions](../latticehowtos) for that half of an ALPS input file). This section builds that format up in stages: from the model library file and its overall `<MODEL>`/`<SITEBASIS>`/`<BASIS>`/`<HAMILTONIAN>` structure, through the basis of a single site and of the full lattice, to the quantum operators and Hamiltonian terms built from them.

## [Introduction](intro)

An overview of the ALPS model library file (`lib/xml/models.xml`), the built-in models it provides (spin, boson/fermion Hubbard, t-J, Kondo lattice, and more) with a glossary of their parameters and citations to the original papers, and the four-part `<MODEL>`/`<SITEBASIS>`/`<BASIS>`/`<HAMILTONIAN>` structure used to define a custom model.

## [Site Basis](sitebasis)

How to describe the Hilbert space of a single site with one or more `<QUANTUMNUMBER>` elements, including fermionic vs. bosonic quantum numbers, parametrized ranges and defaults, and models such as the t-J model where several equivalent choices of quantum numbers are possible.

## [Lattice Basis](latticebasis)

How to combine single-site bases into the basis of the whole lattice with `<BASIS>`, covering lattices with more than one site per unit cell (including the `#` wildcard shortcut for per-type parameters), and how to restrict the basis with a `<CONSTRAINT>` on a summed quantum number (e.g. total `Sz`).

## [Quantum Operators](operators)

How to define the operators the Hamiltonian is built from: simple site operators with an explicit matrix element and quantum-number `<CHANGE>` (e.g. `Splus`, `bdag`, `cdag_up`), complex `<SITEOPERATOR>`s built from simpler ones (e.g. `Sx`), and two-site `<BONDOPERATOR>`s (e.g. `exchange`, `fermion_hop`).

## [Hamiltonian Descriptions](hamiltonian)

How to assemble a `<HAMILTONIAN>` from `<PARAMETER>` defaults, a `<BASIS>` reference, and `<SITETERM>`/`<BONDTERM>` elements — including type-dependent couplings, either via an explicit `type` attribute or the `#` wildcard.
