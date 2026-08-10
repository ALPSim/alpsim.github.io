---
title: Heisenberg Model
math: true
toc: true
weight: 3
---

## Introduction

Two electrons sitting on neighboring atoms repel each other through the ordinary Coulomb interaction, which does not care about spin at all. But because electrons are fermions, the Pauli exclusion principle forces their combined spatial wavefunction to be symmetric if their two spins combine into an antisymmetric singlet, and antisymmetric if their spins combine into a symmetric triplet — and these two spatial wavefunctions have different Coulomb energies. Eliminate the spatial part of the problem and what is left is a purely spin-dependent effective interaction between the two electrons: the **exchange interaction**, introduced by Werner Heisenberg in 1928 ([Heisenberg (1928)](https://doi.org/10.1007/BF01328601)) as the microscopic origin of magnetism in solids. The interaction is a byproduct of the Coulomb interaction plus the quantum-mechanical requirement that electrons are indistinguishable fermions.

Summed over a whole lattice, this gives the **Heisenberg model**,

$$
H = J \sum_{\langle i,j \rangle} \mathbf{S}_i \cdot \mathbf{S}_j,
$$

where $\mathbf{S}_i$ is the spin at lattice site $i$, $J$ is the exchange coupling ($J<0$ favors ferromagnetic alignment, $J>0$ favors antiferromagnetic alignment), and the sum runs over nearest-neighbor pairs $\langle i,j \rangle$. This same Hamiltonian describes two rather different physical situations, depending on what $\mathbf{S}_i$ means:

- In the **classical Heisenberg model**, $\mathbf{S}_i$ is an ordinary 3-component unit vector that can point in any direction in space, and $\mathbf{S}_i \cdot \mathbf{S}_j$ is the everyday dot product. This is a model of statistical mechanics, simulated with classical Monte Carlo.
- In the **quantum Heisenberg model**, $\mathbf{S}_i = (S_i^x, S_i^y, S_i^z)$ is a vector of quantum spin operators for a spin of definite magnitude $S$ (most commonly $S = 1/2$), obeying the angular-momentum commutation relations $[S_i^x, S_i^y] = i S_i^z$ (and cyclic permutations) — components of the *same* spin do not commute with one another, so a spin can never simultaneously have a definite orientation in more than one direction.

**This site is mainly about the quantum version.** ALPS's exact diagonalization, DMRG, and quantum Monte Carlo applications all target the quantum Heisenberg model, which is the subject of most of the tutorials linked below; the classical model appears mainly as a point of comparison (see the [MC-02 tutorial](../../../tutorials/mcs/mc02) below, which simulates both side by side) and is handled by the classical Monte Carlo application `spinmc`, the same code used for the [Ising Model](../ising).

## Physics of the model

**A continuous symmetry, unlike the Ising model.** The dot product $\mathbf{S}_i \cdot \mathbf{S}_j$ is invariant under rotating *every* spin in the system by the same amount, in any direction — a continuous $SU(2)$ (or, for classical spins, $O(3)$) symmetry. This is a qualitatively different starting point from the [Ising Model](../ising), whose $J S_i^z S_j^z$ coupling only has the discrete $\mathbb{Z}_2$ symmetry of flipping every spin at once. As discussed below, this difference in symmetry has direct, dramatic consequences for whether the model can order at all in low dimensions.

**The classical model: ordering and its limits.** For $J<0$ on any lattice, the classical ground state simply aligns every spin in the same, arbitrary direction (ferromagnetism). For $J>0$ on a bipartite lattice (one that splits into two interpenetrating sublattices, like a simple square or cubic lattice), the ground state is the Néel state, with the two sublattices pointing in opposite directions (antiferromagnetism); on a non-bipartite lattice (e.g. a triangular lattice) the antiferromagnetic couplings cannot all be satisfied at once, a phenomenon called *frustration*. But whether such order survives at finite temperature depends sharply on dimensionality: because the symmetry being broken is continuous rather than discrete, the [Mermin-Wagner theorem](https://doi.org/10.1103/PhysRevLett.17.1133) rules out any spontaneous magnetic order at nonzero temperature in one or two dimensions for an isotropic Heisenberg model with short-range interactions — long-wavelength fluctuations of the order parameter's *direction* cost arbitrarily little energy and always destroy order in low dimensions. This is the opposite of the classical Ising model, whose discrete symmetry allows a genuine finite-temperature phase transition already in 2D. Classical Heisenberg order at $T>0$ therefore requires three dimensions; in 1D and 2D, the interesting physics of the classical model is confined to $T=0$ or to the character of its fluctuations rather than genuine long-range order. The low-energy excitations above an ordered classical ground state are **spin waves** (or, quantized, **magnons**): slow, long-wavelength precessions of the spins around the ordered direction, whose gaplessness is a direct consequence — a Goldstone mode — of the continuous symmetry that ordering breaks.

**The quantum model in 1D: exact solutions and the Haldane conjecture.** The one-dimensional spin-1/2 antiferromagnetic Heisenberg chain is one of the very few interacting quantum many-body models with a fully exact solution, found by Hans Bethe in 1931 using what is now called the *Bethe ansatz* ([Bethe (1931)](https://doi.org/10.1007/BF01341708)). Its ground state has no long-range order at all (consistent with Mermin-Wagner) but is *critical*: spin correlations decay algebraically (as a power law) with distance rather than exponentially, and the low-energy spectrum is gapless. It came as a considerable surprise, then, when Duncan Haldane argued in 1983 ([Haldane (1983)](https://doi.org/10.1016/0375-9601(83)90631-X)) that this gaplessness is special to *half-integer* spin: antiferromagnetic Heisenberg chains of *integer* spin ($S=1, 2, \ldots$) instead have a unique, disordered ground state separated from all excitations by a finite energy gap — the **Haldane gap** — with correlations that decay exponentially rather than as a power law. Half-integer chains ($S=1/2, 3/2, \ldots$) remain gapless. This sharp, non-obvious distinction between integer and half-integer spin chains is one of the most celebrated results in 1D quantum magnetism, and is directly visible in the ED and DMRG tutorials linked below, which compute and contrast the spin-1/2 and spin-1 chains side by side.

**Frustration and dimerization.** Adding a next-nearest-neighbor coupling $J_2$ to the spin-1/2 chain (an explicitly frustrated interaction, since it competes with the nearest-neighbor coupling $J_1$ on a non-bipartite path) can also open a gap, even though the chain is half-integer spin: at the particular ratio $J_2/J_1 = 1/2$ (the Majumdar-Ghosh point), the exact ground state is known analytically and is a simple product of singlet dimers, with a finite gap to all excitations. More generally, two coupled spin-1/2 chains (a "two-leg ladder") are *always* gapped, regardless of the rung coupling's sign or strength — a simple, robust way to realize gapped, disordered quantum magnetism starting from an otherwise gapless building block.

## Phenomena

- **Ferromagnetism and antiferromagnetism**: for $J<0$, spins favor parallel alignment, giving a macroscopic magnetic moment; for $J>0$ on a bipartite lattice, spins favor the antiparallel (Néel) arrangement, with no net moment but strong staggered order.
- **Spin waves and magnons**: the gapless, long-wavelength excitations of an ordered magnet (classical or quantum), whose existence is guaranteed by the continuous symmetry of the exchange interaction being spontaneously broken.
- **Absence of order in low dimensions**: per the Mermin-Wagner theorem, the isotropic Heisenberg model cannot order magnetically at any nonzero temperature in 1D or 2D — in sharp contrast to the Ising model, whose discrete symmetry permits ordering already in 2D.
- **Gapped vs. gapless quantum ground states**: 1D spin-1/2 chains are gapless and critical (Bethe ansatz); integer-spin chains are gapped (the Haldane gap); frustration (e.g. at the Majumdar-Ghosh point) or geometry (e.g. two-leg ladders) can open a gap even for half-integer spin. Which of these regimes a given chain or ladder falls into is often the central question addressed by the tutorials below.
- **Quantum phase transitions**: tuning a frustrating coupling, a ladder's rung strength, or an applied field can drive the quantum model between gapped and gapless (or between differently-ordered) ground states at zero temperature, the same general phenomenon introduced on the [Transverse Field Ising Model](../transising) page.

## Methods

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **ED** — see [sparsediag](../../methods/ed/sparsediag) / [fulldiag](../../methods/ed/fulldiag) | Exact results for small systems; captures the full quantum spectrum and entanglement | Limited to small systems, since the Hilbert space grows exponentially with system size | Gaps, spectra, and finite-size scaling for small chains, ladders, and clusters; benchmarking other methods |
| **DMRG** — see [Density Matrix Renormalization Group](../../methods/dmrg/dmrg) | Highly accurate ground states and low-energy excitations for 1D systems; efficient for low-entanglement states | Less efficient for 2D/3D systems or highly entangled states | Ground-state energies, gaps, local observables, and correlation functions of 1D chains and ladders |
| **QMC** — see [Stochastic Series Expansion](../../methods/qmc/sse) | Handles much larger systems than ED or DMRG; gives access to finite-temperature properties | Frustrated or fermionic Heisenberg-type models can suffer from the sign problem (unfrustrated spin models on bipartite lattices do not) | Finite-temperature thermodynamics, susceptibilities, and phase diagrams, including in 2D and 3D |

Because the quantum Heisenberg model is central to so much of ALPS, it is the subject of tutorials across every method:

**Exact diagonalization** (`sparsediag`/`fulldiag`):
- [ED-01: Sparse Diagonalization (Lanczos)](../../../tutorials/ed/ed01) — sets up a spin-1 Heisenberg chain and computes custom measurements on the ground state
- [ED-02: Spin gaps of 1D quantum systems](../../../tutorials/ed/ed02) — computes the Haldane gap of the spin-1 chain directly
- [ED-03: Spectra of 1D quantum systems](../../../tutorials/ed/ed03) — momentum-resolved spectra of a Heisenberg chain, a two-leg ladder, and isolated dimers
- [ED-04: Conformal field theory description of 1D critical spectra](../../../tutorials/ed/ed04) — the gapless, critical spin-1/2 Heisenberg chain and its CFT operator content
- [ED-05: Phase transition in a frustrated spin chain](../../../tutorials/ed/ed05) — the $J_1$–$J_2$ chain and the Majumdar-Ghosh dimerization transition
- [ED-06: Full Diagonalization](../../../tutorials/ed/ed06) — finite-temperature thermodynamics of Heisenberg chains, ladders, and magnetic molecules

**Density Matrix Renormalization Group** (`dmrg`):
- [DMRG-01: Introduction](../../../tutorials/dmrg/dmrg01) — ground states of the spin-1/2 and spin-1 Heisenberg chains
- [DMRG-02: Calculating gaps](../../../tutorials/dmrg/dmrg02) — extracting excitation gaps, including the Haldane gap
- [DMRG-03: Calculating local observables](../../../tutorials/dmrg/dmrg03) — local magnetization profiles across different magnetization sectors
- [DMRG-04: Calculating correlations](../../../tutorials/dmrg/dmrg04) — two-point spin correlation functions and correlation lengths
- [Ground State Energy of a Spin Chain (Jupyter notebook)](../../../tutorials/jupyter/dmrg/groundstatespinchain) — convergence of the ground-state energy of a spin-1/2 chain

**Quantum Monte Carlo** (`looper`, `dirloop_sse`, quantum Wang-Landau):
- [MC-02: Calculating magnetic susceptibilities by the classical MC and looper QMC codes](../../../tutorials/mcs/mc02) — directly compares the classical and quantum Heisenberg models side by side
- [MC-03: Calculating magnetization curves by the directed loop QMC code](../../../tutorials/mcs/mc03) — field-driven magnetization of a chain and a gapped ladder
- [MC-04: Custom measurements in the QMC codes](../../../tutorials/mcs/mc04) — spin-spin correlation functions and the antiferromagnetic structure factor
- [MC-06: Extended ensemble simulations (Quantum Wang-Landau)](../../../tutorials/mcs/mc06) — full finite-temperature thermodynamics of Heisenberg chains and ladders from a single simulation
- [MC-08: Quantum phase transition in a quantum spin model](../../../tutorials/mcs/mc08) — locates and characterizes a quantum phase transition in coupled Heisenberg ladders

**Jupyter notebooks:**
- [Spin Gap of the Spin-1 Heisenberg Chain](../../../tutorials/jupyter/ed/spingapspinoneheisenbergchain) — interactive version of the Haldane-gap calculation
- [Spectra of 1D Systems](../../../tutorials/jupyter/ed/spectra1dsystems) — interactive version of the momentum-resolved spectra

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
