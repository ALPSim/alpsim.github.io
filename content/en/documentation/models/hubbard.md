---
title: Hubbard Model
math: true
toc: true
weight: 5
---

## Introduction

Electrons hopping on a lattice would, according to ordinary band theory, simply spread out to minimize their kinetic energy. But when two electrons try to occupy the same atomic orbital, they also feel the full strength of the Coulomb repulsion between them. The **Hubbard model** keeps only this single, essential piece of the electron-electron interaction — an energy cost $U$ for any doubly-occupied site — on top of ordinary single-particle hopping, and in doing so becomes the simplest possible model of interacting electrons on a lattice. Despite (or perhaps because of) this simplicity, it captures some of the most important phenomena in condensed matter physics: the Mott metal-insulator transition, itinerant magnetism, and, in its doped low-energy limit, some of the physics believed to underlie high-temperature superconductivity in the cuprates.

The model was introduced independently by several groups in 1963, of which [John Hubbard's paper](https://doi.org/10.1098/rspa.1963.0204) gave the model its name. For modern reviews, see [Arovas, Berg, Kivelson, and Raghu (2022)](https://doi.org/10.1146/annurev-conmatphys-031620-102024) for analytical aspects of the model, and [Qin, Schäfer, Andergassen, Corboz, and Gull (2022)](https://doi.org/10.1146/annurev-conmatphys-090921-033948) for a review focused specifically on the numerical methods used to solve it.

The one-band Hubbard model with spin-1/2 fermions (the most commonly studied case) is given by the Hamiltonian

$$
H = -t \sum_{\langle i,j \rangle, \sigma} \left( c_{i,\sigma}^\dagger c_{j,\sigma} + \text{h.c.} \right) + U \sum_i n_{i,\uparrow} n_{i,\downarrow} - \mu \sum_{i,\sigma} n_{i,\sigma},
$$

where:
- $c_{i,\sigma}^\dagger$ and $c_{i,\sigma}$ create and annihilate a fermion of spin $\sigma$ (up $\uparrow$ or down $\downarrow$) at site $i$, and h.c. denotes the Hermitian conjugate,
- $t$ is the hopping amplitude between neighboring sites $\langle i,j \rangle$,
- $U$ is the on-site interaction energy, paid only when a site is doubly occupied ($U>0$: repulsive; $U<0$: attractive),
- $n_{i,\sigma} = c_{i,\sigma}^\dagger c_{i,\sigma}$ is the number operator for spin $\sigma$ at site $i$,
- $\mu$ is the chemical potential, which controls the electron density (filling).

Each site can therefore hold 0, 1 (spin up or down), or 2 (one of each) electrons. This is exactly the built-in `fermion Hubbard` model in the ALPS model library — see the [model parameter glossary](../../intro/modeldef/intro) for the general parameter listing. The competition between the kinetic term (which favors delocalized, bandlike electrons) and the interaction term (which favors localized electrons, one per site) — together with the density set by $\mu$ and the temperature — is responsible for essentially all of the model's rich physics.

## Physics of the model

**The Mott transition: why interactions can defeat band theory.** Ordinary band theory predicts that a half-filled band (one electron per site on average) is always a metal, since the Fermi level then sits in the middle of a partially filled band. The Hubbard model's single most important lesson is that this prediction can simply be wrong: at half filling, once $U$ is large enough compared to the bandwidth ($\sim t$), it costs a large energy $U$ for any electron to hop onto an already-occupied neighboring site, so electrons effectively stop moving even though band theory says they shouldn't. This interaction-driven — rather than band-structure-driven — metal-to-insulator transition is called the **Mott transition**, and the resulting insulating state, with one electron localized on every site, is a **Mott insulator**.

**From Hubbard to Heisenberg: superexchange.** A Mott insulator is not magnetically inert, however. Although a real hop is forbidden at large $U$, a *virtual* hop — an electron briefly hopping onto a neighboring site and back — is not, and ordinary second-order perturbation theory shows that it lowers the ground-state energy by an amount of order $t^2/U$. Crucially, the Pauli exclusion principle allows this virtual hop only if the two neighboring electrons have *opposite* spin; if they have the same spin, the hop is forbidden outright, since the destination site cannot accept a second electron of the same spin. This asymmetry means the true ground state prefers neighboring spins to be anti-aligned, and at half filling and large $U/t$, the effective low-energy description of the Hubbard model is exactly the antiferromagnetic [Heisenberg Model](../heisenberg), with exchange coupling

$$
J = \frac{4t^2}{U}.
$$

This mechanism, called **superexchange**, is the microscopic origin of antiferromagnetism in essentially all Mott insulators, including the parent compounds of the high-temperature cuprate superconductors.

**Doping a Mott insulator.** Moving away from half filling by adding or removing electrons ("doping") destroys the simple Néel-ordered picture above and opens up some of the richest, and least settled, physics in the field. At large $U$, the doped model reduces to the [t-J Model](../tj), and the resulting competition between antiferromagnetism, superconductivity, and various forms of charge and spin order (such as stripes) is widely believed to hold the key to understanding high-temperature superconductivity in the cuprates — a problem that, despite six decades of study of this deceptively simple-looking Hamiltonian, is still not fully resolved.

## Phenomena

- **Mott metal-insulator transition**: at half filling, the system is metallic for small $U/t$ and a Mott insulator for large $U/t$, with a transition (or, at finite temperature, a crossover) between the two.
- **Magnetism**: in the Mott-insulating regime, superexchange generates antiferromagnetic order at half filling (see above); away from half filling or at other densities, ferromagnetism and more complex magnetic orders are also possible.
- **Superconductivity**: for attractive interactions ($U<0$) the model directly favors electron pairing; for the physically more common repulsive case ($U>0$), unconventional (non-phonon-mediated) superconductivity is believed to emerge upon doping a Mott insulator — the central motivation for studying this model in connection with the cuprates.
- **Doping, stripes, and non-Fermi-liquid behavior**: away from half filling, the model can exhibit charge/spin stripe order, phase separation, and, in some regimes, metallic behavior that does not fit the conventional Fermi-liquid picture of ordinary metals.

## Methods

Within ALPS specifically:

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **ED** — see [sparsediag](../../methods/ed/sparsediag) / [fulldiag](../../methods/ed/fulldiag) | Exact results for small systems; captures the full many-body spectrum | Limited to small clusters, since the Hilbert space grows as $4^N$ (four states per site) | Small-system benchmarks; symmetry-resolved spectra |
| **DMRG** — see [Density Matrix Renormalization Group](../../methods/dmrg/dmrg) | Highly accurate for 1D and quasi-1D (ladder) geometries | Less efficient for genuinely 2D/3D systems | Ground states and low-energy properties of Hubbard chains and ladders |
| **DMFT** — see [Dynamical Mean Field Theory](../../methods/dmft/dmft) | Captures local correlations and the Mott transition non-perturbatively; exact in infinite dimensions (e.g. the Bethe lattice) | Neglects non-local (momentum-dependent) correlations and fluctuations | The Mott transition; local spectral functions; finite-temperature phase diagrams |

Unlike the spin and boson models elsewhere in ALPS, there is no lattice quantum Monte Carlo application in ALPS for the generic fermionic Hubbard model: away from special cases (e.g. half filling on a bipartite lattice, or one dimension), the notorious fermion **sign problem** makes direct lattice QMC prohibitively expensive at low temperature, and ALPS does not include a determinantal/auxiliary-field QMC application. Instead, ALPS's continuous-time QMC algorithms (CT-HYB, CT-INT) are used as *impurity* solvers within DMFT — see [Gull, Millis, Lichtenstein, Rubtsov, Troyer, and Werner (2011)](https://doi.org/10.1103/RevModPhys.83.349) for a comprehensive review of these solvers — which is why DMFT, rather than direct lattice QMC, is the standard large-scale method for the Hubbard model in ALPS.

For a sense of how these methods, and many others not implemented in ALPS (auxiliary-field QMC, DMRG on wide cylinders, diagrammatic Monte Carlo, and more), compare against each other on the same, deceptively simple 2D square-lattice Hubbard model, see the [Simons Collaboration benchmark study](https://doi.org/10.1103/PhysRevX.5.041041), which cross-validates a wide range of state-of-the-art numerical methods against one another — required reading for understanding what is, and isn't, reliably known about this model.

ALPS's DMFT tutorials use the Hubbard model throughout:

- [DMFT-01: An introduction to DMFT](../../../tutorials/dmft/dmft01) — motivates the DMFT approximation as a mapping of the lattice Hubbard model onto a self-consistent quantum impurity problem
- [DMFT-02: CT-HYB solver](../../../tutorials/dmft/dmft02), [DMFT-03: CT-INT solver](../../../tutorials/dmft/dmft03), and [DMFT-07: The Hirsch-Fye solver](../../../tutorials/dmft/dmft07) — trace out the metal–antiferromagnetic-insulator transition of the Hubbard model on the Bethe lattice with three different impurity solvers
- [DMFT-04: Mott Transition](../../../tutorials/dmft/dmft04) — the paramagnetic Mott transition as a function of $U$
- [DMFT-06: Paramagnetic metal and extrapolation errors](../../../tutorials/dmft/dmft06) — benchmarks the QMC solvers against Hirsch-Fye and exact diagonalization
- [DMFT-08: Setting a particular lattice](../../../tutorials/dmft/dmft08) — moves beyond the Bethe lattice to square, cubic, and hexagonal lattices
- [DMFT-09: Néel transition in single-site DMFT](../../../tutorials/dmft/dmft09) — the antiferromagnetic Néel transition, compared across all three solvers
- [DMFT of Hubbard Model on a Bethe Lattice (Jupyter notebook)](../../../tutorials/jupyter/dmft/dmftbethehubbard) — an interactive introduction to the same Bethe-lattice DMFT calculation

Beyond DMFT, [ED-06: Full Diagonalization](../../../tutorials/ed/ed06) includes the Hubbard model on a small square lattice as an additional exercise, using symmetries (momentum and particle number) to keep the calculation tractable.

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
