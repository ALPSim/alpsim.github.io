---
title: Hardcore Boson Model
math: true
toc: true
weight: 8
---

## Introduction

The **hardcore boson model** is what remains of the [Bose-Hubbard Model](../bhm) in the limit $U \to \infty$: bosons still hop between lattice sites, but the on-site repulsion is now so strong that double occupancy is forbidden outright, rather than merely costly. Each site can only be empty or singly occupied — exactly the same simplification the [t-J Model](../tj) makes to the fermionic Hubbard model, but applied to bosons instead of fermions.

The model, or more precisely its exact equivalence to a spin-1/2 system described below, was introduced by [Matsubara and Matsuda (1956)](https://doi.org/10.1143/PTP.16.569) as a lattice model for the superfluid transition in liquid helium — one of the earliest examples of mapping a genuine interacting quantum many-body problem onto an exactly equivalent spin model.

Because double occupancy is forbidden, the hardcore boson operators satisfy modified commutation relations:

$$
[b_i, b_j^\dagger] = \delta_{ij} (1 - 2 b_i^\dagger b_i), \qquad (b_i^\dagger)^2 = (b_i)^2 = 0,
$$

where $(b_i^\dagger)^2 = 0$ directly enforces the constraint: creating a second boson on an already-occupied site simply gives zero. Operators on different sites still commute with one another exactly as ordinary bosonic operators do — only the on-site algebra is modified. The Hamiltonian is

$$
H = -t \sum_{\langle i,j \rangle} \left( b_i^\dagger b_j + \text{h.c.} \right) + V \sum_{\langle i,j \rangle} n_i n_j - \mu \sum_i n_i,
$$

where $t$ is the hopping amplitude, $V$ is a nearest-neighbor interaction between bosons, $n_i = b_i^\dagger b_i$ is the (now strictly 0-or-1) occupation of site $i$, and $\mu$ is the chemical potential. This is exactly the running example used to introduce the ALPS model XML format on the [Site Basis](../../intro/modeldef/sitebasis) and [Hamiltonian Descriptions](../../intro/modeldef/hamiltonian) pages.

## Physics of the model

**An exact mapping to spin-1/2: the Matsubara-Matsuda transformation.** Because a hardcore boson site has exactly two states — empty or occupied — it is algebraically identical to a spin-1/2 degree of freedom, via

$$
b_i^\dagger = S_i^+, \qquad b_i = S_i^-, \qquad n_i = S_i^z + \tfrac{1}{2}.
$$

Substituting this into the Hamiltonian above turns the hopping term into the transverse (XY) exchange $-2t \sum_{\langle i,j \rangle} (S_i^x S_j^x + S_i^y S_j^y)$ and the interaction term into the Ising exchange $V \sum_{\langle i,j \rangle} S_i^z S_j^z$, plus a field term absorbing $\mu$ — in other words, exactly the anisotropic (XXZ) [Heisenberg Model](../heisenberg), in a field set by the boson density. Crucially, unlike the Jordan-Wigner transformation used for fermions on the [Spinless Fermion Model](../sfm) page, this mapping needs no nonlocal string: bosons on different sites already commute, so the Matsubara-Matsuda transformation is completely local and works in *any* number of spatial dimensions, not just one.

**Superfluidity and magnetic order are the same phenomenon.** This equivalence turns the hardcore boson model's phase diagram directly into the XXZ model's phase diagram from the [Heisenberg Model](../heisenberg) page. Superfluid order — a nonzero, phase-coherent expectation value $\langle b_i \rangle$ — is exactly transverse (XY) magnetic order, $\langle S_i^x \rangle, \langle S_i^y \rangle \neq 0$. A commensurate, checkerboard-ordered Mott/charge-density-wave insulator — bosons sitting preferentially on one sublattice — is exactly Néel order along $z$. The superfluid-insulator quantum phase transition of the boson language and the order-disorder quantum phase transition of the spin language are, on this exact mapping, the very same transition seen through two different sets of variables.

**A real material realization: field-induced magnon condensation.** This equivalence is not just formal. In real quantum magnets with a spin gap — a unique, non-degenerate ground state separated from all magnetic excitations by an energy gap — a strong-enough external magnetic field can close that gap and drive the system into a magnetically ordered state. In the hardcore boson language, the magnetic field plays the role of the chemical potential $\mu$, the gapped, unmagnetized state is the vacuum (or Mott insulator) of bosons, and the field-induced ordered state is literally a Bose-Einstein condensate of magnons — this description was used successfully by [Nikuni, Oshikawa, Oosawa, and Tanaka (2000)](https://doi.org/10.1103/PhysRevLett.84.5868) to explain the field-induced ordering observed experimentally in the quantum magnet TlCuCl$_3$.

## Phenomena

- **Superfluidity**: at low density or weak interaction $V$, hardcore bosons delocalize into a phase-coherent superfluid — equivalently, transverse (XY) magnetic order in the spin language.
- **Mott/charge-density-wave insulation**: at commensurate filling (e.g. half filling on a bipartite lattice) and large $V$, bosons localize into a checkerboard pattern — equivalently, Néel order in the spin language.
- **Quantum phase transitions**: tuning density or $V/t$ drives the same superfluid-insulator transition already discussed for the [Bose-Hubbard Model](../bhm), now exactly mappable onto the magnetic ordering transition of an anisotropic spin-1/2 model.
- **Magnon Bose-Einstein condensation**: field-induced ordering transitions in real gapped quantum magnets are described quantitatively as a Bose-Einstein condensation of hardcore-boson magnons (see above).

## Methods

Because the model maps exactly onto a spin-1/2 Hamiltonian, every method applicable to the [Heisenberg Model](../heisenberg) applies here as well, with no sign problem in any dimension:

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **Worm algorithm / SSE** — see [Worm Algorithm](../../methods/qmc/worm) / [SSE](../../methods/qmc/sse) | Sign-problem-free at any filling and in any dimension | None specific to this model | Superfluid density, phase diagrams, finite-temperature properties |
| **Loop algorithm** — see [Quantum Monte Carlo](../../methods/qmc) | Highly efficient at exactly half filling ($\mu = 0$), where the mapped spin model has no field | Away from half filling, the chemical potential becomes a field term that the loop algorithm handles poorly; use the worm/SSE codes instead | Half-filled (particle-hole symmetric) phase diagrams |
| **ED** — see [sparsediag](../../methods/ed/sparsediag) / [fulldiag](../../methods/ed/fulldiag) | Exact results for small systems; the hardcore constraint is built into the local Hilbert space at no extra cost | Limited to small systems | Small-system benchmarks |
| **DMRG** — see [Density Matrix Renormalization Group](../../methods/dmrg/dmrg) | Highly accurate for 1D chains and ladders | Less efficient for genuinely 2D/3D systems | Ground states of 1D hardcore-boson chains |

There is no dedicated ALPS tutorial for this model by name, but it is the worked example used throughout the [ALPS Model Definitions](../../intro/modeldef) pages, and the [Bose-Hubbard Model](../bhm) tutorials (MC-05, DWA-01, DWA-02) illustrate the same worm and directed-worm methods on the closely related finite-$U$ model.

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
