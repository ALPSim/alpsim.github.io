---
title: Ising Model
math: true
toc: true
weight: 1
---

## Introduction

The **Ising model** is the simplest and most influential model of a magnet, and one of the most widely studied models in all of statistical mechanics. Picture a regular lattice of sites, with an arrow ("spin") at each site that can point only up or down — nothing in between. Each spin wants to align (or, depending on the sign of the interaction, anti-align) with its nearest neighbors, while thermal noise constantly tries to randomize the spins. The competition between these two effects — order from the interactions, disorder from temperature — is what makes the model so rich: at low temperature the spins lock into a common orientation, while at high temperature they fluctuate independently, and somewhere in between the system undergoes a genuine **phase transition**.

The model is named after Ernst Ising, who solved the one-dimensional case in his 1925 doctoral thesis ([Ising (1925)](https://doi.org/10.1007/BF02980577)) — a problem suggested to him by his advisor Wilhelm Lenz. Ising found that in one dimension there is *no* phase transition at any nonzero temperature: thermal fluctuations always eventually destroy the order. It took another two decades before Lars Onsager solved the two-dimensional model exactly in 1944 ([Onsager (1944)](https://doi.org/10.1103/PhysRev.65.117)), showing that a true phase transition *does* occur in 2D — one of the most celebrated results in theoretical physics, and the reason the Ising model remains a standard testbed for new methods and algorithms to this day. See the [Wikipedia article](https://en.wikipedia.org/wiki/Ising_model) for a broader overview and history.

The Hamiltonian of the classical Ising model is

$$
\mathcal{H} = J \sum_{\langle i,j \rangle} S_i^z S_j^z + h \sum_i S_i^z
$$

where:
- $S_i^z, S_j^z \in \{+1, -1\}$ are classical variables representing an "up" or "down" spin at lattice sites $i$ and $j$ — not quantum operators, since this is a classical statistical-mechanics model,
- $J$ is the interaction strength between neighboring spins: the coupling is antiferromagnetic if $J > 0$ (neighboring spins prefer to point opposite ways) and ferromagnetic if $J < 0$ (neighboring spins prefer to align),
- $h$ is an external magnetic field that favors one spin direction over the other,
- the sum $\langle i,j \rangle$ runs over nearest-neighbor pairs of spins on the lattice.

Replacing the classical variables $S_i^z$ with quantum spin-1/2 operators, and adding a field along $x$, gives the [Transverse Field Ising Model](../transising) — a closely related but genuinely quantum-mechanical model.

## Phenomena

The Ising model has been applied to a remarkably wide range of physical systems and phenomena, well beyond its original motivation of magnetism.

- **Ferromagnetism**: For $J < 0$, spins tend to align in the same direction, leading to a spontaneous, macroscopic magnetization at low temperatures, even in zero field.
- **Antiferromagnetism**: For $J > 0$, spins tend to align in alternating directions, resulting in no net magnetization but strong local (staggered) ordering.
- **Phase transitions**: In two or more dimensions, the model exhibits a phase transition at a critical temperature $T_c$, from a disordered (paramagnetic) phase at high temperature — where the average magnetization $m = \langle S_i^z \rangle$ vanishes — to an ordered phase at low temperature with $m \neq 0$. This transition is *continuous* (second-order): $m$ grows smoothly from zero as the temperature is lowered through $T_c$, rather than jumping discontinuously.
- **Dimensionality matters**: The 1D chain has no finite-temperature phase transition at all — true order only appears at $T=0$. The 2D square-lattice model does have a phase transition and was solved exactly by Onsager; no exact solution is known in 3D, where the critical exponents must instead be obtained numerically (e.g. by Monte Carlo) or via the renormalization group.
- **Universality**: Very different physical systems — magnets, binary alloys undergoing an order-disorder transition, and even the liquid-gas critical point (via the equivalent "lattice gas" formulation) — share exactly the same critical exponents as the Ising model near their respective transitions. This *universality* of critical behavior is one of the most important ideas to emerge from the study of the Ising model.

## Methods

The Ising model without a magnetic field can be solved exactly in 1D and 2D (see above), but away from these special cases, and to study finite-size systems directly, numerical methods are essential. Below is a summary of the key numerical techniques available in ALPS:

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **Classical Monte Carlo, local (Metropolis) updates** — see [Local Updates](../../methods/spinmc/local) | Simple to implement; works for essentially any classical spin model | *Critical slowing down*: near $T_c$, consecutive configurations become highly correlated, so autocorrelation times diverge and convergence becomes very slow | General-purpose sampling; systems away from criticality |
| **Cluster algorithms** (Wolff, Swendsen-Wang) — see [Cluster Updates](../../methods/spinmc/cluster) | Flip whole clusters of aligned spins at once, dramatically reducing critical slowing down; efficient right at $T_c$ | More complex to implement; works best for models without a field | Precise studies of critical phenomena; finite-size scaling |

ALPS's classical Monte Carlo application, `spinmc`, implements both local and cluster updates for the Ising model and related classical spin models — see the [Classical Monte Carlo](../../methods/spinmc) pages for the algorithms in detail.

Because no simulation can study an infinite lattice, extracting $T_c$ and the critical exponents in practice relies on *finite-size scaling*. Near the transition, a quantity like the susceptibility or the correlation length would formally diverge in an infinite system, but on a finite lattice of linear size $L$ it is instead cut off once the correlation length grows to be comparable to $L$ itself — so the apparent peak in, say, the susceptibility is rounded off and shifted away from $T_c$, by an amount that shrinks in a universal, predictable way as $L$ grows. By simulating several lattice sizes and comparing how such quantities (magnetization, susceptibility, the Binder cumulant) depend on $L$ near the apparent transition, one can extrapolate to the thermodynamic limit ($L \to \infty$) and read off both the critical temperature and the critical exponents precisely, even though every individual simulation is necessarily finite.

Three tutorials walk through simulating the 2D Ising model with `spinmc` from start to finish:

- [MC-01(a): Classical Monte Carlo simulations and autocorrelations](../../../tutorials/mcs/mc01a) — introduces the model and shows how autocorrelation times blow up near $T_c$ with local updates
- [MC-01(b): Classical Monte Carlo simulations and equilibration/convergence](../../../tutorials/mcs/mc01b) — diagnoses whether a run has thermalized and converged
- [MC-07: Phase transition in the Ising model](../../../tutorials/mcs/mc07) — uses finite-size scaling to extract the critical temperature and critical exponents

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
