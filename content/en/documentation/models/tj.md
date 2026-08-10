---
title: t-J Model
math: true
toc: true
weight: 6
---

## Introduction

The **t-J model** is what remains of the [Hubbard Model](../hubbard) once double occupancy is forbidden outright rather than merely penalized by a large $U$. As shown on the Hubbard model page, expanding the large-$U$ Hubbard model in powers of $t/U$ produces, at leading order, an antiferromagnetic superexchange coupling $J = 4t^2/U$ between neighboring spins; the t-J model keeps that superexchange term together with ordinary hopping, but now restricted to a Hilbert space where every site holds at most one electron. It is the standard minimal model for a *doped* Mott insulator — a Mott insulator (see the Hubbard page) with a small number of mobile holes or extra electrons added — and is very widely used to describe the low-energy physics of the cuprate high-temperature superconductors.

Because double occupancy is forbidden, each site can only be empty, or occupied by a single electron of spin up or down — three states per site, rather than the four allowed in the unrestricted Hubbard model. The Hamiltonian is

$$
H = -t \sum_{\langle i,j \rangle, \sigma} \left( \tilde{c}_{i,\sigma}^\dagger \tilde{c}_{j,\sigma} + \text{h.c.} \right) + J \sum_{\langle i,j \rangle} \left( \mathbf{S}_i \cdot \mathbf{S}_j - \frac{n_i n_j}{4} \right),
$$

where:
- $\tilde{c}_{i,\sigma}^\dagger$ and $\tilde{c}_{i,\sigma}$ are ordinary fermion creation and annihilation operators, *projected* to exclude double occupancy — a hop is simply not allowed if it would place a second electron on an already-occupied site,
- $t$ is the hopping amplitude between nearest-neighbor sites $\langle i,j \rangle$,
- $J$ is the antiferromagnetic exchange coupling between neighboring spins — the same superexchange coupling introduced on the [Hubbard Model](../hubbard) page, so that $J = 4t^2/U$ whenever the t-J model is used as a stand-in for the large-$U$ Hubbard model,
- $\mathbf{S}_i$ is the spin operator at site $i$, and $n_i = \sum_\sigma \tilde{c}_{i,\sigma}^\dagger \tilde{c}_{i,\sigma}$ is the site occupation (0 or 1),
- the $-n_in_j/4$ term exactly cancels the density-density part hidden inside $\mathbf{S}_i \cdot \mathbf{S}_j$, so that the two terms shown reproduce the superexchange energy correctly for singly-occupied neighboring sites.

(A fully careful, order-by-order derivation from the Hubbard model also generates a small three-site correlated-hopping term at the same order in $t/U$; it is conventionally dropped, and the Hamiltonian above — kinetic term plus superexchange — is what is normally meant by "the t-J model.") At exactly half filling there are no empty sites for electrons to hop into, the kinetic term does nothing, and the model reduces exactly to the antiferromagnetic [Heisenberg Model](../heisenberg). All of the model's distinctive physics therefore comes from what happens once a small number of holes (or extra electrons) is doped in.

For the constrained, three-state Hilbert space itself, see the t-J example already worked out on the [Site Basis](../../intro/modeldef/sitebasis) page, which shows the two equivalent ways of labeling these states within ALPS. The model was proposed as an effective description of the cuprates independently by [Anderson (1987)](https://doi.org/10.1126/science.235.4793.1196), who connected it to resonating-valence-bond (RVB) physics and superconductivity, and by [Zhang and Rice (1988)](https://doi.org/10.1103/PhysRevB.37.3759), who derived it directly from the electronic structure of the copper-oxide planes (see below).

## Physics of the model

**Where the single band comes from: the Zhang-Rice singlet.** Real cuprate superconductors are not single-band materials — their CuO$_2$ planes involve copper $3d$ orbitals and oxygen $2p$ orbitals together. [Zhang and Rice (1988)](https://doi.org/10.1103/PhysRevB.37.3759) showed that a hole doped onto the oxygen orbitals surrounding a copper site binds tightly into a local spin singlet with the copper spin, and that this composite object — the **Zhang-Rice singlet** — hops between sites and interacts with neighboring copper spins exactly as a single hole would in a one-band t-J model. This is the microscopic justification for treating the complicated multi-orbital cuprates with the simple single-band Hamiltonian above.

**A hole moving through an antiferromagnet.** Consider doping a single hole into the Néel-ordered ground state of the undoped (half-filled) model. Naively, a free hole should move with a bandwidth of order $t$, just like an empty site in the plain tight-binding problem. But every time the hole hops, it displaces an electron whose spin no longer matches the surrounding antiferromagnetic pattern, leaving a trail of misaligned spins behind it — a "string" of magnetic disorder that costs energy proportional to $J$ for every step the hole takes away from its starting point. Only by mixing many such string configurations, or by using the exchange term $J$ to repair the damaged spin background, can the hole regain some mobility. The net result is that the hole propagates with an effective bandwidth of order $J$ rather than $t$, dramatically renormalized from the free-electron value — one of the clearest illustrations of how strong correlations can qualitatively change even the simplest single-particle property, quasiparticle motion.

**Resonating valence bonds and superconductivity.** [Anderson (1987)](https://doi.org/10.1126/science.235.4793.1196) proposed that the undoped antiferromagnet should instead be thought of as a resonating valence bond (RVB) state — a quantum superposition of many different ways of pairing spins into singlet bonds, rather than a conventional Néel-ordered state — and that doping this RVB liquid with holes could allow the singlet bonds to become mobile Cooper pairs, giving superconductivity without any need for phonons. This idea, and the variational (Gutzwiller-projected BCS) wavefunctions used to test it, remains one of the central threads connecting the t-J model to the search for a theory of high-temperature superconductivity.

**Relation to the Hubbard model.** The t-J model is a good effective description of the Hubbard model precisely when $U$ is large compared to $t$ and the doping (the density of holes away from half filling) is small; it discards high-energy double-occupancy fluctuations entirely rather than merely suppressing them energetically, which makes the constrained Hilbert space smaller and, for some methods, easier to work with than the full Hubbard model — at the cost of no longer being able to interpolate continuously back to the weakly-interacting, small-$U$ regime.

## Phenomena

- **Magnetism**: at half filling the model is exactly the antiferromagnetic Heisenberg model, with the same Néel order and spin-wave excitations discussed on the [Heisenberg Model](../heisenberg) page; doping rapidly suppresses this order.
- **Hole motion and spin polarons**: individual doped holes move through the antiferromagnetic background dressed by a cloud of disturbed spins (see above), with a mobility set by $J$ rather than $t$ — a phenomenon directly probed by angle-resolved photoemission (ARPES) in cuprate materials.
- **High-temperature superconductivity**: doping the RVB-like undoped state is believed by many to drive unconventional, spin-fluctuation-mediated superconducting pairing, making the t-J model one of the leading minimal models for the cuprates.
- **Strange metal / non-Fermi-liquid behavior**: over a range of dopings and temperatures, the model can exhibit transport and spectral properties (such as a linear-in-temperature resistivity) that do not fit the conventional Fermi-liquid description of a metal.
- **Phase separation**: at small doping and small $J/t$, the effective attraction between holes mediated by the surrounding spin background can make it energetically favorable for holes to cluster together rather than spread out uniformly, leading to phase separation into hole-rich and hole-free regions.

## Methods

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **ED** — see [sparsediag](../../methods/ed/sparsediag) / [fulldiag](../../methods/ed/fulldiag) | Exact results for small systems; the no-double-occupancy constraint is enforced exactly by construction, rather than approximately | Limited to small clusters, since the constrained Hilbert space still grows exponentially (as $3^N$) | Small-cluster spectra; single-hole dynamics; benchmarking other methods |
| **DMRG** — see [Density Matrix Renormalization Group](../../methods/dmrg/dmrg) | Highly accurate for 1D chains and quasi-1D ladders; the constraint is again built into the local Hilbert space at no extra cost | Less efficient for genuinely 2D systems | Ground states, hole pairing, and spin correlations of 1D and quasi-1D t-J systems |

As with the [Hubbard Model](../hubbard), ALPS has no lattice quantum Monte Carlo application for the doped t-J model: the fermion sign problem is, if anything, even more severe here once holes are present, and ALPS does not include a determinantal QMC or variational Monte Carlo (VMC) application. Gutzwiller-projected variational wavefunctions (the natural way to test Anderson's RVB idea numerically) and determinantal QMC restricted to the sign-free undoped or special-filling limits are the standard tools in the wider literature, but are not implemented in ALPS. There is currently no dedicated ALPS tutorial for the t-J model; the [Site Basis](../../intro/modeldef/sitebasis) page shows how its constrained Hilbert space is defined in the ALPS model XML format, and the DMFT tutorials on the [Hubbard Model](../hubbard) page are the natural starting point for exploring the parent, unconstrained model in ALPS.

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
