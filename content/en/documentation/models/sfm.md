---
title: Spinless Fermion Model
math: true
toc: true
weight: 4
---

## Introduction

The **spinless fermion model** describes fermions hopping on a lattice while carrying no spin degree of freedom at all — there is only one kind of particle per site, not an "up" and a "down" as in the [Hubbard Model](../hubbard). This might sound like an odd simplification, since real electrons always have spin, but it is a useful and physically meaningful one: it isolates the effects of Fermi statistics, interactions, and lattice geometry from the added complexity of spin, and it directly describes spin-polarized fermions (e.g. cold atoms prepared in a single spin state, where the Pauli exclusion principle already forbids two identical fermions from occupying the same site regardless of any interaction). It is also, as discussed below, secretly the same model as the anisotropic quantum Heisenberg chain in disguise.

Fermions are described by creation ($c_i^\dagger$) and annihilation ($c_i$) operators obeying fermionic anticommutation relations, which enforce the Pauli exclusion principle: two fermions can never occupy the same site. A general Hamiltonian for the model is

$$
H = -t \sum_{\langle i,j \rangle} \left( c_i^\dagger c_j + c_j^\dagger c_i \right) + V \sum_{\langle i,j \rangle} n_i n_j - \mu \sum_i n_i,
$$

where:
- $t$ is the hopping amplitude between nearest-neighbor sites $\langle i,j \rangle$,
- $V$ is the interaction strength between fermions on neighboring sites (repulsive for $V>0$),
- $n_i = c_i^\dagger c_i$ is the number operator, representing the occupation (0 or 1) of site $i$,
- $\mu$ is the chemical potential, controlling the total number of fermions.

This is exactly the built-in `spinless fermions` model in the ALPS model library, with parameters `mu`, `t`, `V` (and their per-bond-type variants `t0`, `t1`, `V0`, `V1`) — see the [model parameter glossary](../../intro/modeldef/intro) for the general listing.

## Physics of the model

**The free-fermion point.** At $V=0$, the model reduces to free fermions hopping on a lattice: the classic tight-binding problem, exactly solvable by Fourier transform for any lattice and filling. The ground state is simply a Fermi sea — all single-particle states below the Fermi energy filled, all others empty — and essentially all of its properties (energy, momentum distribution, correlation functions) are known in closed form. The interesting physics of this model is entirely due to the interaction $V$.

**A spin chain in disguise: the Jordan-Wigner mapping.** In one dimension, this model is not really a new one at all: the same [Jordan-Wigner transformation](../transising) used to solve the transverse field Ising model exactly maps the spinless fermion chain onto the anisotropic quantum Heisenberg (XXZ) spin-1/2 chain introduced on the [Heisenberg Model](../heisenberg) page, with the hopping $t$ becoming the in-plane ($S^xS^x+S^yS^y$) exchange and the interaction $V$ becoming the Ising-like ($S^zS^z$) exchange. This is an exact equivalence, not an approximation: every eigenstate and every correlation function of one model has a corresponding partner in the other. It also explains why quantum Monte Carlo has no trouble at all with this nominally fermionic model in 1D: simulated in its spin representation, it is exactly as sign-problem-free as the Heisenberg chain itself (see Methods below) — the notorious fermion sign problem is a feature of genuinely fermionic simulations, and simply does not arise once an exact mapping to a bosonic (spin) representation exists.

**Consequences for the phase diagram.** Because the model is secretly the XXZ chain, its zero-temperature phase diagram follows directly from the well-established phase diagram of that model: for $|V| < 2t$ the chain is gapless — a Luttinger liquid, the generic critical, metallic state of interacting fermions in 1D, with power-law-decaying correlations; for $V > 2t$, strong repulsion favors alternating occupied/empty sites, opening a gap into a charge-density-wave (CDW) insulator, the fermionic image of the Ising-antiferromagnetic phase of the XXZ chain; for $V < -2t$, strong attraction instead favors fermions clustering together, leading to phase separation into fermion-rich and fermion-poor regions. Tuning $V/t$ through $\pm 2$ therefore drives genuine zero-temperature quantum phase transitions between these regimes, of exactly the kind introduced on the [Transverse Field Ising Model](../transising) page.

**Two famous extensions.** Adding further ingredients to this bare model produces two of the most influential models in modern condensed matter physics. Dimerizing the hopping amplitude (alternating strong and weak bonds along the chain) gives the **Su-Schrieffer-Heeger (SSH) model** ([Su, Schrieffer, and Heeger (1979)](https://doi.org/10.1103/PhysRevLett.42.1698)), the founding example of a 1D topological insulator, originally introduced to explain soliton defects in polyacetylene. Adding p-wave (rather than density-density) pairing between neighboring sites gives the **Kitaev chain** ([Kitaev (2001)](https://doi.org/10.1070/1063-7869/44/10S/S29)), whose topological phase hosts unpaired Majorana zero modes at its ends — a foundational model for topological quantum computation. Neither dimerization nor pairing is present in the plain model above, but both are natural, well-known next steps built directly on top of it.

## Phenomena

- **Luttinger liquid physics**: for $|V| < 2t$, the 1D spinless fermion chain is a paradigmatic example of a Luttinger liquid — a gapless state whose low-energy physics is universal and shared by essentially all gapless, interacting 1D fermion systems, quite unlike the Fermi-liquid behavior of higher-dimensional metals.
- **Charge-density-wave order**: for strong repulsion ($V > 2t$ in 1D), fermions arrange themselves on alternating sites, spontaneously breaking the lattice's translational symmetry down to a sublattice symmetry — the direct fermionic analogue of the Néel order discussed on the [Heisenberg Model](../heisenberg) page.
- **Quantum phase transitions**: the metal-to-CDW-insulator transition at $V = 2t$ (and the transition to phase separation at $V=-2t$) are zero-temperature quantum phase transitions tuned by the interaction strength, not by temperature.
- **Topological phases**: not present in the bare model itself, but readily accessed by simple extensions — dimerized hopping (the SSH model) or induced pairing (the Kitaev chain) — that turn this simple starting point into two of the most-studied models in topological condensed matter physics.

## Methods

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **ED** — see [sparsediag](../../methods/ed/sparsediag) / [fulldiag](../../methods/ed/fulldiag) | Exact results for small systems; captures the full many-body spectrum | Limited to small systems, since the Hilbert space grows exponentially with system size | Small chains and clusters; benchmarking other methods |
| **DMRG** — see [Density Matrix Renormalization Group](../../methods/dmrg/dmrg) | Highly accurate ground states and low-energy excitations for 1D systems | Less efficient for 2D/3D systems or highly entangled states | Ground states, gaps, and correlation functions of 1D chains |
| **QMC** — see [Stochastic Series Expansion](../../methods/qmc/sse) | In 1D, exactly sign-problem-free via the Jordan-Wigner mapping to the Heisenberg chain, so large systems and finite temperature are both accessible | The mapping (and its sign-free simulation) is special to 1D nearest-neighbor hopping; genuinely higher-dimensional or longer-range fermion models generally do face a sign problem | Finite-temperature thermodynamics; large 1D systems |

There is no dedicated ALPS tutorial that studies the physics of this model directly, but [LM-02: Defining custom model Hamiltonians: spin, fermion, and boson](../../../tutorials/lm/lm02) shows how to write the spinless fermion model's `SITEBASIS`, `OPERATOR`, and `HAMILTONIAN` blocks from scratch in the ALPS model XML format, as one of its three worked examples.

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
