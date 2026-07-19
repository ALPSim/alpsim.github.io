---
title: Models in ALPS
math: true
weight: 4
---

ALPS provides built-in support for a range of standard quantum lattice models used throughout condensed matter physics, from simple classical spin models to strongly correlated fermion and boson models. Each page below introduces the model's Hamiltonian, the phenomena it captures, and the numerical methods commonly used to solve it.

## [Ising Model](ising)

The classical Ising model describes spins that can point up or down, coupled to their nearest neighbors and to an external field. It is one of the simplest models exhibiting a finite-temperature phase transition between ordered (ferro- or antiferromagnetic) and disordered phases, and is exactly solvable in one and two dimensions.

## [Transverse Field Ising Model](transising)

Adding a transverse magnetic field to the Ising model introduces quantum fluctuations that compete with the classical Ising exchange, driving a zero-temperature quantum phase transition. The transverse field Ising model is a paradigmatic testbed for quantum criticality and universal scaling behavior.

## [Heisenberg Model](heisenberg)

The Heisenberg model couples full spin vectors — rather than just their z-components — on neighboring lattice sites through an isotropic exchange interaction. It is the archetypal model of quantum magnetism, capturing ferro- and antiferromagnetism, spin waves, and quantum phase transitions.

## [Spinless Fermion Model](sfm)

This model describes fermions hopping on a lattice with a nearest-neighbor density-density interaction, but without any spin degree of freedom. Stripped of spin physics, it isolates the effects of particle statistics, interactions, and lattice geometry, and serves as a building block for richer fermionic models.

## [Hubbard Model](hubbard)

The Hubbard model adds an on-site interaction between opposite-spin fermions to nearest-neighbor hopping, making it the canonical model of strongly correlated electrons. It captures the Mott metal-insulator transition, magnetism, and, in some regimes, superconductivity, and underlies much of the theory of high-temperature superconductors.

## [t-J Model](tj)

Derived from the Hubbard model in the limit of strong on-site repulsion, the t-J model describes electrons hopping on a lattice where double occupancy of any site is forbidden, combined with an antiferromagnetic exchange between neighboring spins. It is widely used to study the low-energy physics of doped Mott insulators, including high-temperature superconductivity.

## [Hardcore Boson Model](hardcorebm)

The hardcore boson model describes bosons hopping on a lattice with an infinite on-site repulsion that restricts occupation of each site to 0 or 1 particle — a bosonic analogue of the Pauli exclusion principle. It connects naturally to quantum spin-1/2 models and arises as a limit of the Bose-Hubbard model.

## [Bose-Hubbard Model](bhm)

The Bose-Hubbard model describes interacting bosons on a lattice, balancing hopping — which favors delocalization — against an on-site interaction that favors localization. Its phase diagram features a superfluid phase and a gapped Mott-insulating phase, connected by a quantum phase transition realized experimentally with ultracold atoms in optical lattices.

## [Kondo Lattice Model](kondo)

The Kondo lattice model couples a lattice of localized magnetic moments to a sea of itinerant conduction electrons through an antiferromagnetic exchange interaction. It is the standard model for heavy-fermion materials, giving rise to Kondo screening, heavy quasiparticles, magnetic ordering, and unconventional superconductivity.
