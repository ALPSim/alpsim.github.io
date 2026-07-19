---
title: Kondo Lattice Model
math: true
toc: true
weight: 10
---

## Introduction

The **Kondo lattice model (KLM)** is the periodic, many-impurity generalization of the [Anderson Impurity Model](../impurity): instead of a single localized moment embedded in a conduction sea, a whole lattice of localized moments — one per site, typically arising from partially-filled $f$-orbitals in a rare-earth or actinide compound — is coupled to a shared sea of conduction electrons. It is the standard minimal model for **heavy-fermion materials**, in which the same competition between magnetic order and Kondo screening introduced on the impurity page now plays out coherently across an entire lattice.

The model, and the physical picture that makes it tractable, was introduced by [Doniach (1977)](https://doi.org/10.1016/0378-4363(77)90190-5). The Hamiltonian is

$$
H = \sum_{k,\sigma} \varepsilon_k c_{k\sigma}^\dagger c_{k\sigma} + J \sum_i \mathbf{S}_i \cdot \mathbf{s}_i,
$$

where $c_{k\sigma}^\dagger, c_{k\sigma}$ create and annihilate a conduction electron of momentum $k$ and spin $\sigma$ with dispersion $\varepsilon_k$, $\mathbf{S}_i$ is a localized spin at site $i$, $\mathbf{s}_i$ is the conduction-electron spin density at that same site, and $J$ (usually antiferromagnetic, $J>0$) is the exchange coupling between them. Exactly as the single-impurity Kondo model arises from the Anderson impurity model via the Schrieffer-Wolff transformation, the Kondo lattice model arises in the same way from the **periodic Anderson model** — an Anderson impurity at *every* site of the lattice — once each site's charge fluctuations are integrated out. A worked example of the two-sublattice basis this model requires (one conduction-electron site type, one localized-spin site type) is already given for ALPS on the [Lattice Basis](../../intro/modeldef/latticebasis) page.

## Physics of the model

**Two competing energy scales: the Doniach picture.** As on the [Anderson Impurity Model](../impurity) page, a single local moment coupled to a conduction sea is screened below a Kondo temperature $T_K \sim D\,e^{-1/(2\rho_0 J)}$. But in a lattice, the conduction electrons also mediate an *indirect* magnetic exchange between different local moments, known as the **RKKY interaction**, with a characteristic energy scale $T_{\text{RKKY}} \sim \rho_0 J^2$. [Doniach (1977)](https://doi.org/10.1016/0378-4363(77)90190-5) pointed out that these two scales depend very differently on the coupling $J$: at small $J$, the power-law RKKY scale exceeds the exponentially small Kondo scale, so the local moments order magnetically (typically antiferromagnetically) before Kondo screening can set in; at large $J$, the exponential $T_K$ eventually overtakes $T_{\text{RKKY}}$, Kondo screening wins, and the ground state is a nonmagnetic, fully screened heavy-fermion state instead. Tuning $J\rho_0$ across the point where these two scales cross — the **Doniach diagram** — drives a genuine magnetic quantum phase transition, and the associated **heavy-fermion quantum critical point** is one of the most heavily studied examples of quantum criticality in real materials.

**Coherent screening and the heavy Fermi liquid.** On the Kondo-screened side of the Doniach diagram, screening does not happen independently at each site but coherently across the whole lattice, producing a genuine Fermi liquid — but one whose quasiparticles carry an effective mass up to hundreds of times the bare electron mass, since each quasiparticle now "drags along" a local moment as it propagates. A further, more subtle consequence is that the resulting Fermi surface encloses a volume that counts the localized moments as part of the itinerant electron sea (a "large" Fermi surface), in contrast to the "small" Fermi surface of the magnetically ordered phase, which does not include them — a distinction that becomes especially subtle, and is still actively debated, right at the quantum critical point itself.

**A route to unconventional superconductivity.** Just as doping a Mott insulator is believed to drive unconventional superconductivity in the [Hubbard Model](../hubbard) and [t-J Model](../tj), tuning a heavy-fermion compound close to its Doniach quantum critical point frequently reveals a dome of unconventional superconductivity, thought to be mediated by the same magnetic fluctuations responsible for the nearby magnetic order rather than by phonons. The first such material discovered, the heavy-fermion superconductor CeCu$_2$Si$_2$ ([Steglich et al. (1979)](https://doi.org/10.1103/PhysRevLett.43.1892)), was also the first ever superconductor shown to have electron-electron interactions, rather than the electron-phonon coupling of conventional BCS theory, as the pairing mechanism.

## Phenomena

- **Kondo screening**: at low temperature, each localized spin is progressively screened by the conduction electrons into a nonmagnetic Kondo singlet, exactly as on the [Anderson Impurity Model](../impurity) page, but now happening throughout the lattice.
- **Heavy-fermion behavior**: coherent screening across the lattice produces quasiparticles with strongly enhanced effective masses, the defining signature of heavy-fermion compounds.
- **RKKY-driven magnetic order**: at small $J\rho_0$, the conduction-electron-mediated RKKY interaction wins out over Kondo screening, producing antiferromagnetic (or, less commonly, ferromagnetic) order of the localized moments.
- **Heavy-fermion quantum criticality**: tuning $J\rho_0$, pressure, or magnetic field across the Doniach transition drives a magnetic quantum phase transition, often accompanied by unusual non-Fermi-liquid behavior in its vicinity.
- **Unconventional superconductivity**: near the quantum critical point, many heavy-fermion materials — starting with CeCu$_2$Si$_2$ — develop superconductivity believed to be mediated by magnetic rather than phononic fluctuations.

## Methods

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **DMFT** — see [Dynamical Mean Field Theory](../../methods/dmft/dmft) | Captures Kondo screening and the Doniach competition non-perturbatively; ALPS's own hybridization-expansion solver was originally developed and demonstrated on exactly this model ([Werner and Millis (2006)](https://doi.org/10.1103/PhysRevB.74.155107)) | Exact only in infinite dimensions; neglects the momentum dependence of the RKKY interaction that drives the magnetic ordering wavevector | The Doniach competition between Kondo screening and magnetic order; see also the general DMFT review by [Georges, Kotliar, Krauth, and Rozenberg (1996)](https://doi.org/10.1103/RevModPhys.68.13) |
| **ED** — see [sparsediag](../../methods/ed/sparsediag) / [fulldiag](../../methods/ed/fulldiag) | Exact results for small clusters | Limited to small clusters, since the Hilbert space combines both conduction and localized degrees of freedom | Small-cluster benchmarks |
| **DMRG** — see [Density Matrix Renormalization Group](../../methods/dmrg/dmrg) | Highly accurate for 1D Kondo chains and ladders | Less efficient for genuinely 2D/3D systems | Ground states of 1D Kondo lattice chains |

As with the [Hubbard Model](../hubbard), ALPS has no lattice quantum Monte Carlo application for the generic Kondo lattice model away from special, sign-free cases: it is a genuinely fermionic lattice problem, and DMFT — rather than direct lattice QMC — is the standard large-scale method available in ALPS. There is no dedicated ALPS tutorial for this model, but the [Lattice Basis](../../intro/modeldef/latticebasis) page shows how its two-sublattice structure is defined in the ALPS model XML format, and the DMFT tutorials on the [Hubbard Model](../hubbard) page are the natural starting point for the underlying DMFT machinery.

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
