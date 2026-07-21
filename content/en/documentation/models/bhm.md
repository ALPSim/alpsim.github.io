---
title: Bose-Hubbard Model
math: true
toc: true
weight: 9
---

## Introduction

The **Bose-Hubbard model** is the bosonic counterpart of the [Hubbard Model](../hubbard): instead of fermions with spin, it describes ordinary bosons hopping on a lattice and paying an energy penalty for sharing a site. Unlike fermionic creation and annihilation operators, the bosonic operators $b_i^\dagger, b_i$ obey ordinary commutation relations, $[b_i, b_j^\dagger] = \delta_{ij}$, with no Pauli exclusion principle at all — any number of bosons can, in principle, pile onto a single site, and it is purely the interaction energy $U$ that discourages them from doing so.

The model was introduced, in essentially its modern form, by [Fisher, Weichman, Grinstein, and Fisher (1989)](https://doi.org/10.1103/PhysRevB.40.546) as a generic description of interacting, lattice-confined bosons — motivated at the time by helium adsorbed in porous media, granular superconductors, and Josephson junction arrays, well before its now-dominant application. That application arrived when [Jaksch, Bruder, Cirac, Gardiner, and Zoller (1998)](https://doi.org/10.1103/PhysRevLett.81.3108) proposed that ultracold atoms trapped in an optical lattice — an egg-carton-shaped potential formed by interfering laser beams — realize this exact Hamiltonian with parameters tunable simply by changing the laser intensity, and [Greiner, Mandel, Esslinger, Hänsch, and Bloch (2002)](https://doi.org/10.1038/415039a) then observed the model's central quantum phase transition directly in the laboratory, in one of the founding experiments of the entire field of quantum simulation with cold atoms.

The Hamiltonian is

$$
H = -t \sum_{\langle i,j \rangle} \left( b_i^\dagger b_j + \text{h.c.} \right) + \frac{U}{2} \sum_i n_i (n_i - 1) - \mu \sum_i n_i,
$$

where:
- $t$ is the hopping amplitude between nearest-neighbor sites $\langle i,j \rangle$,
- $U$ is the on-site interaction strength, the energy cost of placing multiple bosons on the same site,
- $\mu$ is the chemical potential, controlling the total number of bosons in the system,
- $b_i^\dagger$ and $b_i$ are bosonic creation and annihilation operators at site $i$,
- $n_i = b_i^\dagger b_i$ is the number operator, representing the boson occupation at site $i$.

This is exactly the built-in `boson Hubbard` model in the ALPS model library — see the [model parameter glossary](../../intro/modeldef/intro) for the general parameter listing. Taking $U \to \infty$ forbids double occupancy altogether and gives the [Hardcore Boson Model](../hardcorebm) discussed elsewhere in this section.

## Physics of the model

**Two competing tendencies, one phase diagram.** The hopping term $t$ favors delocalized bosons with a well-defined, coherent quantum phase across the whole lattice — a **superfluid**. The interaction term $U$ favors exactly the opposite: a fixed, integer number of bosons pinned to each site, with no phase coherence at all — a **Mott insulator**. Which tendency wins depends on the ratio $t/U$ and on the density set by $\mu$, and mapping out this competition traces out the model's famous phase diagram of **Mott lobes**: at each integer filling $n = 1, 2, 3, \ldots$, there is a lobe-shaped region of the $(\mu/U, t/U)$ plane, extending out from $t=0$, within which the system is a gapped Mott insulator; everywhere outside the lobes, including at any non-integer filling, the ground state is a superfluid.

**Two ways to cross the same transition.** The superfluid-to-Mott-insulator transition can be reached in two physically distinct ways, and [Fisher et al. (1989)](https://doi.org/10.1103/PhysRevB.40.546) showed these are governed by different physics. Tuning $t/U$ straight through the tip of a Mott lobe, at exactly integer filling, crosses the transition at fixed density; because the transition then involves genuine quantum (particle-number) fluctuations on top of a commensurate background, it falls into the same universality class as the classical XY model in one higher dimension. Tuning the density away from a lobe's tip instead adds or removes a dilute gas of particles or holes directly, which condense into a superfluid with mean-field-like exponents essentially as soon as they appear — a qualitatively different, "generic" way of leaving the Mott phase.

**Phase fluctuations and Josephson physics.** Deep in the superfluid phase, close to the Mott boundary, amplitude fluctuations of the boson field are strongly suppressed while its phase can still fluctuate relatively freely; the resulting low-energy theory is a quantum XY model, formally identical to an array of Josephson junctions, with the hopping $t$ playing the role of the Josephson coupling between neighboring "islands." This is the same effective description that originally motivated Fisher et al.'s treatment of granular superconductors and Josephson junction arrays alongside lattice bosons.

**Adding disorder: the Bose glass.** If the chemical potential is made site-dependent and random — modeling, for instance, disorder in the underlying lattice or trap — a third phase appears between the Mott insulator and the superfluid: the **Bose glass**, a gapless but non-superfluid phase in which bosons are localized by disorder rather than pinned by interactions. [Fisher et al. (1989)](https://doi.org/10.1103/PhysRevB.40.546) showed quite generally that the Bose glass must always intervene between the Mott insulator and the superfluid once disorder is present, so that the direct Mott-to-superfluid transition is a feature specific to the clean lattice.

## Phenomena

- **Superfluidity**: at small $U/t$ (or away from integer filling), bosons delocalize across the lattice into a coherent state with long-range phase coherence and a nonzero superfluid stiffness.
- **Mott insulation**: at large $U/t$ and integer filling, interactions pin an integer number of bosons to every site, opening a gap to all excitations and producing an incompressible insulator.
- **The superfluid-Mott quantum phase transition**: driven by quantum rather than thermal fluctuations, with two distinct universality classes depending on whether the transition is crossed at fixed integer density (through a Mott lobe tip) or by changing the density itself (see above).
- **The Bose glass**: with disorder, a gapless, insulating, but non-superfluid phase intervenes between the Mott insulator and the superfluid.
- **Direct experimental realization**: the entire phase diagram above has been mapped out with ultracold atoms in optical lattices, making the Bose-Hubbard model one of the few strongly-correlated lattice models whose phase transitions have been observed directly, atom by atom, in a real experiment.

## Methods

Unlike the fermionic models elsewhere in this section, repulsive bosons have no sign problem in quantum Monte Carlo, in any dimension — there is no minus sign from particle exchange to spoil the simulation — which is why ALPS offers several dedicated QMC applications for exactly this model:

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **Worm algorithm** — see [Worm Algorithm](../../methods/qmc/worm) | Sign-problem-free in any dimension; efficient at all fillings, including the grand-canonical ensemble | Limited to models without a sign problem (satisfied here) | The reference method for the superfluid-Mott transition; see [MC-05](../../../tutorials/mcs/mc05) |
| **Directed worm algorithm** — see [DWA](../../methods/qmc/dwa) | Efficient updates for trapped, inhomogeneous systems (e.g. a harmonic trap) | This implementation is deprecated in current ALPS and restricted to on-site interactions only | Density profiles in trapped optical-lattice systems; see [DWA-01](../../../tutorials/mcs/dwa/dwa01) and [DWA-02](../../../tutorials/mcs/dwa/dwa02) |
| **Stochastic Series Expansion** — see [SSE](../../methods/qmc/sse) | Sign-problem-free finite-temperature algorithm, originally developed for spin models and extended to bosons | Same restrictions on sign-free models as other QMC methods (not a practical limitation here) | Finite-temperature thermodynamics of the Bose-Hubbard model |
| **ED** — see [sparsediag](../../methods/ed/sparsediag) / [fulldiag](../../methods/ed/fulldiag) | Exact results for small systems, after truncating the per-site occupation at a maximum `Nmax` | Limited to small clusters and modest `Nmax` | Small-system benchmarks |
| **DMRG** — see [Density Matrix Renormalization Group](../../methods/dmrg/dmrg) | Highly accurate for 1D chains | Less efficient for genuinely 2D/3D systems | Ground states of 1D Bose-Hubbard chains |

Disordered systems can be studied with the same worm code — see [Bose Glass](../../methods/qmc/boseglass) for a worked parameter file — and the underlying single-particle band structure of an optical lattice is discussed in [Bosons in an Optical Lattice](../../methods/qmc/bhol).

- [MC-05: Simulating the Bose-Hubbard model using the worm QMC code](../../../tutorials/mcs/mc05) — locates the superfluid-Mott transition on a 2D square lattice at unit filling
- [DWA-01: Monte Carlo simulations with directed worm](../../../tutorials/mcs/dwa/dwa01) — revisits the same transition with the directed worm algorithm
- [DWA-02: Density profile](../../../tutorials/mcs/dwa/dwa02) — the density profile of bosons in a harmonic trap, directly comparable to real optical-lattice experiments

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
