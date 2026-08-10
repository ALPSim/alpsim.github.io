---
title: Anderson Impurity Model
math: true
toc: true
weight: 7
---

## Introduction

Every model discussed so far in this section — the [Hubbard Model](../hubbard), the [t-J Model](../tj), the [Heisenberg Model](../heisenberg) — describes a whole lattice of interacting sites. The **Anderson impurity model** is different in kind: it describes a single correlated orbital, the "impurity," coupled to a continuous bath of otherwise non-interacting conduction electrons. It is the foundational model of quantum impurity physics, and, through [Dynamical Mean Field Theory](../../methods/dmft/dmft), it is also the model that sits at the computational heart of the lattice Hubbard model.

The model was introduced by [P. W. Anderson (1961)](https://doi.org/10.1103/PhysRev.124.41) to explain a puzzle in dilute magnetic alloys: why some transition-metal impurities (such as Fe or Mn) dissolved in a nonmagnetic host metal develop a stable local magnetic moment, while others do not. Anderson's answer was that this is itself a strongly-correlated many-body problem, governed by the competition between the impurity's own Coulomb repulsion and its hybridization with the surrounding conduction electrons — precisely the same competition, in miniature, that drives the Mott physics of the lattice Hubbard model.

The Hamiltonian has three parts:

$$
H = \varepsilon_d \sum_\sigma n_{d\sigma} + U n_{d\uparrow} n_{d\downarrow} + \sum_{k\sigma} \varepsilon_k c_{k\sigma}^\dagger c_{k\sigma} + \sum_{k\sigma} \left( V_k d_\sigma^\dagger c_{k\sigma} + \text{h.c.} \right),
$$

where:
- $d_\sigma^\dagger, d_\sigma$ create and annihilate an electron of spin $\sigma$ in the impurity orbital, with on-site energy $\varepsilon_d$ and Coulomb repulsion $U$ between opposite-spin electrons occupying it (exactly as in the Hubbard model, but now for a single site),
- $c_{k\sigma}^\dagger, c_{k\sigma}$ create and annihilate a non-interacting conduction electron in bath state $k$, with dispersion $\varepsilon_k$,
- $V_k$ is the hybridization matrix element that lets an electron hop between the impurity and bath state $k$.

Only one combination of the bath parameters actually matters for the impurity's physics: the **hybridization function** $\Delta(\omega) = \sum_k |V_k|^2/(\omega - \varepsilon_k)$, which encodes everything the impurity "feels" from the bath without reference to any particular microscopic bath realization. This is the crucial structural fact that makes the model tractable, and it is exactly the object that [Dynamical Mean Field Theory](../../methods/dmft/dmft) determines self-consistently when it maps a lattice model onto an effective single impurity: DMFT replaces the lattice Hubbard model with an Anderson impurity model whose hybridization function $\Delta(\omega)$ is adjusted until the impurity's local Green's function matches the local Green's function of the original lattice problem.

## Physics of the model

**When does a local moment form?** In his original 1961 paper, Anderson answered this with a self-consistent mean-field argument. If $U = 0$, the impurity level simply hybridizes with the bath and broadens into a resonance of width $\sim \pi \rho_0 |V|^2$ (with $\rho_0$ the bath density of states) — there is no preferred spin direction, and no moment. Turning on $U$ favors single occupancy of the impurity (with either spin) over double or zero occupancy, and once $U$ is large enough compared to the hybridization width, the impurity settles into a stable, singly-occupied local moment: an effective spin-1/2 degree of freedom weakly coupled to the surrounding conduction electrons, rather than a piece of the itinerant electron gas.

**The Kondo effect: screening a local moment.** A free local moment would simply act as an independent, Curie-law paramagnetic impurity down to $T=0$. It does not: below a characteristic **Kondo temperature** $T_K$, the surrounding conduction electrons progressively screen the impurity spin, and the two combine into a collective many-body singlet ground state. This is the **Kondo effect**, and it is a genuinely non-perturbative phenomenon — $T_K$ depends exponentially on the coupling, $T_K \sim D\, e^{-1/(\rho_0 J)}$ (with $D$ a bath bandwidth and $J$ an effective exchange coupling introduced below), so no finite order of perturbation theory in the interaction can capture it. The effect was discovered experimentally decades before it was understood: dilute magnetic alloys were long known to show a puzzling upturn (rather than the expected decrease) in electrical resistivity at low temperature, and [Kondo (1964)](https://doi.org/10.1143/PTP.32.37) showed that this resistivity minimum follows directly from third-order perturbation theory in the exchange coupling between the impurity spin and the conduction electrons — a calculation that diverges logarithmically as $T\to 0$, correctly signaling that perturbation theory itself breaks down and a new, strongly-coupled low-temperature state must take over.

**From Anderson to Kondo.** In the local-moment regime, charge fluctuations on the impurity (virtual double occupancy or complete emptying) are high in energy and can be integrated out, exactly as double occupancy was integrated out of the Hubbard model to produce the [t-J Model](../tj). Carrying this out — the **Schrieffer-Wolff transformation** ([Schrieffer and Wolff (1966)](https://doi.org/10.1103/PhysRev.149.491)) — converts the Anderson Hamiltonian into the (single-impurity) **Kondo model**, a pure spin-exchange interaction $H_K = J\, \mathbf{S}_{\text{imp}} \cdot \mathbf{s}(0)$ between the localized moment and the conduction-electron spin density at the impurity site, with $J \sim V^2/U > 0$ automatically antiferromagnetic. The Anderson and Kondo models describe the same low-energy physics whenever a well-formed local moment exists; the Anderson model is the more complete, microscopic starting point, while the Kondo model is the simpler effective theory once charge fluctuations no longer matter.

**Solving the Kondo problem exactly.** Because $T_K$ is a non-perturbative, exponentially small scale, controlled approximations are hard to construct, and the definitive solution came only with [Wilson's numerical renormalization group](https://doi.org/10.1103/RevModPhys.47.773) (NRG) — one of the first and most celebrated applications of the renormalization group to a genuinely non-perturbative quantum many-body problem, showing explicitly how the system flows from a weakly-coupled local moment at high energy to a fully screened, strongly-coupled Fermi liquid at low energy.

**From one impurity to a lattice.** A periodic lattice of Anderson impurities, each coupled to its own conduction band and to each other only indirectly through the shared conduction electrons, is the natural many-impurity generalization of this model. In the local-moment regime, applying the Schrieffer-Wolff transformation at every site turns it into exactly the [Kondo Lattice Model](../kondo) already described elsewhere in this section — the model relevant to heavy-fermion materials, where the same competition between local-moment formation and Kondo screening plays out coherently across an entire lattice rather than at a single, isolated site.

## Phenomena

- **Local moment formation**: whether the impurity carries a stable, unpaired spin at all is itself a nontrivial threshold phenomenon, controlled by the ratio of $U$ to the hybridization width — the central question Anderson's 1961 paper set out to answer.
- **The Kondo effect and the resistivity minimum**: below $T_K$, a local moment is progressively screened by the conduction electrons, historically first observed as an anomalous low-temperature upturn in the resistivity of dilute magnetic alloys.
- **Universal low-energy Fermi liquid**: once $T \ll T_K$, the impurity is fully screened and the system flows to a universal, strongly-coupled Fermi-liquid fixed point, with low-energy properties (such as the Wilson ratio) that are the same for any microscopic realization of the model — a strikingly clean example of universality in a strongly-correlated quantum system.
- **Mixed valence**: when the impurity level $\varepsilon_d$ lies close to the Fermi level rather than deep below it, the impurity fluctuates between different charge (valence) states instead of settling into a well-defined local moment, giving physics distinct from, though related to, the Kondo regime.
- **Heavy fermion physics**: coherent Kondo screening across a whole lattice of impurities (see the [Kondo Lattice Model](../kondo)) produces quasiparticles with effective masses up to hundreds of times the bare electron mass, the hallmark of heavy-fermion compounds.

## Methods

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **ED** — see [sparsediag](../../methods/ed/sparsediag) / [fulldiag](../../methods/ed/fulldiag) | Exact results after discretizing the bath into a finite number of levels; captures the full many-body spectrum | The continuous bath is only ever approximated by a finite number of levels, introducing discretization error unless extrapolated carefully | Ground-state and spectral properties for a small number of bath sites; benchmarking other impurity solvers |
| **DMFT** — see [Dynamical Mean Field Theory](../../methods/dmft/dmft) | Solves the impurity problem for a genuinely continuous bath via continuous-time QMC (CT-HYB, CT-INT); the natural setting in which this model actually arises in ALPS | Statistical (QMC) rather than systematic errors; typically formulated at finite temperature | The self-consistent impurity problem underlying lattice DMFT for the Hubbard model; multi-orbital generalizations (the `FLAVORS` parameter) |

Historically, the definitive solution of the single-impurity Kondo problem came from [Wilson's numerical renormalization group](https://doi.org/10.1103/RevModPhys.47.773), which is not implemented in ALPS. Within ALPS, the [Hubbard Model](../hubbard) page's DMFT tutorials are, from this point of view, already a guided tour of the Anderson impurity model in action, since every one of them repeatedly solves an Anderson impurity problem as the inner loop of the DMFT self-consistency cycle.

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
