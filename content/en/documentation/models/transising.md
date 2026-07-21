---
title: Transverse Field Ising Model
description: "Quantum Ising model with a transverse field: a minimal model of quantum phase transitions and a standard testbed for quantum computing and quantum simulation"
toc: true
math: true
weight: 2
---

## Introduction

The **transverse field Ising model (TFIM)** takes the classical [Ising model](../ising) — spins on a lattice coupled through their $z$-components — and adds a magnetic field pointing perpendicular to that axis, along $x$. This single addition turns a model that is secretly classical into a genuinely quantum-mechanical one, and makes the TFIM one of the simplest and most widely studied models of quantum magnetism and quantum phase transitions.

**Why the ordinary quantum Ising model isn't really quantum.** Written with quantum spin operators, the "ordinary" Ising model with only a longitudinal coupling,

$$
H_0 = J_z \sum_{\langle i,j \rangle} S_i^z S_j^z ,
$$

looks quantum mechanical, but is not, in any dynamical sense: every term of $H_0$ is built only from $S^z$ operators, and $S^z$ operators on different sites always commute with one another, so every term of the Hamiltonian commutes with every other. A sum of mutually commuting terms is automatically diagonal in the basis of classical spin configurations, so the eigenstates of $H_0$ are exactly the classical Ising configurations, with exactly the classical Ising energies — there is no tunneling between configurations, no superposition in the ground state, and no entanglement anywhere in the spectrum.

**The transverse field changes everything.** Adding a field along $x$,

$$
H=J_{z} \sum_{\langle i,j \rangle} S_i^z S_j^z + \Gamma \sum_i S_i^x,
$$

breaks this: $S_i^x$ does *not* commute with $S_i^z$ on the same site, so the two terms of $H$ can no longer be diagonalized simultaneously. Its eigenstates become genuine superpositions of classical spin configurations connected by single-spin flips (since $S^x$ flips a spin between up and down), giving the model real quantum dynamics, ground-state entanglement, and, as discussed below, a genuine quantum phase transition — none of which is present at $\Gamma = 0$.

Here, the first sum runs over pairs of nearest neighbors and $\Gamma$ is called the transverse field. In 1D, the system becomes critical at $\Gamma/J_z = \frac{1}{2}$ (see below). At $\Gamma = 0$ the ground state reduces to the classical Ising ground state: antiferromagnetic for $J_z > 0$ and ferromagnetic for $J_z < 0$.

**A testbed for quantum computing and quantum simulation.** Because it is the simplest lattice model with both a classical limit and a tunable, non-commuting quantum term, the TFIM has become a standard benchmark well beyond condensed matter theory:

- It is the natural target Hamiltonian for **quantum annealers**: the transverse field provides exactly the quantum tunneling between classical configurations that drives the annealing process ([Kadowaki and Nishimori (1998)](https://doi.org/10.1103/PhysRevE.58.5355)), and devices such as D-Wave's quantum annealers are built around Ising-type Hamiltonians with a controllable transverse field.
- It is one of the first nontrivial Hamiltonians realized on **analog quantum simulators** — arrays of Rydberg atoms, trapped ions, and superconducting-qubit devices — precisely because it is simple enough to engineer directly, yet rich enough to display a genuine quantum phase transition.
- It is a standard first example in courses and textbooks introducing **quantum algorithms**: its two terms are exactly the two non-commuting building blocks (a diagonal "problem" Hamiltonian and a transverse-field "mixer" Hamiltonian) used in quantum annealing and the quantum approximate optimization algorithm (QAOA).

## Physics of the model

**A single spin already shows why order is destroyed.** Before tackling the full lattice, it helps to look at a single spin in a transverse field, $H = \Gamma S^x$. The eigenstates of $S^x$ are the equal-weight superpositions $|{\pm x}\rangle = \frac{1}{\sqrt{2}}(|\!\uparrow\rangle \pm |\!\downarrow\rangle)$, so whichever of these is the ground state (depending on the sign of $\Gamma$), it has $\langle S^z \rangle = 0$ exactly. A single spin in a transverse field can never point along $z$, because $S^z$ simply is not a conserved, sharply defined quantity once $\Gamma \neq 0$. This is the microscopic seed of everything that follows: switch on $\Gamma$ anywhere in the lattice and it constantly tries to randomize each spin's $z$-orientation, competing directly against the ordering tendency of $J_z$.

**Limiting cases.** At $\Gamma = 0$ the model reduces exactly to the classical Ising model discussed on the [Ising Model](../ising) page: the ground state is a classical antiferromagnetic or ferromagnetic pattern, doubly degenerate, since flipping every spin at once costs no energy. At $\Gamma \to \infty$, the field term dominates completely and the ground state becomes a single, non-degenerate product state with every spin polarized along $+x$ — a featureless quantum paramagnet with $\langle S_i^z \rangle = 0$ on every site and no order of any kind. The interesting physics — the quantum phase transition described below — happens at intermediate $\Gamma$, where neither limit is a good description and the two competing tendencies are of comparable strength.

**Exact solution via the Jordan-Wigner transformation.** What makes the 1D transverse field Ising model special, and such a popular first example to study, is that it can be solved exactly for any $\Gamma$ and $J_z$, not just in the two limits above. The trick, due to Jordan and Wigner, is to rewrite the spin-1/2 operators as fermion creation and annihilation operators, each dressed with a nonlocal "string" built from all the spins that precede it along the chain — a bookkeeping device needed because fermions anticommute while spin operators on different sites commute. In terms of these fermions, the Hamiltonian turns out to be *quadratic*: a model of free fermions hopping and pairing on the lattice, with no interactions left between them at all. Any such quadratic fermionic Hamiltonian can be diagonalized exactly by a further change of variables (a Bogoliubov transformation), yielding an explicit single-particle dispersion relation $\epsilon(k)$ for the fermionic excitations as a function of $\Gamma$ and $J_z$. This exact solution ([Pfeuty (1970)](https://doi.org/10.1016/0003-4916(70)90270-8)) is what gives the precise critical ratio $\Gamma/J_z = \frac{1}{2}$ quoted above: it is exactly the point where the excitation gap $\min_k \epsilon(k)$ closes, signaling the phase transition.

**Domain walls and spin flips: two faces of the same excitation.** The Jordan-Wigner fermions have a direct, physically intuitive interpretation in terms of the original spins. Deep in the ordered phase ($\Gamma \ll J_z$), flipping a single spin relative to the ordered background does not create one defect but *two* domain walls — one on each side of the flipped spin — each separating a stretch of one magnetization sign from a stretch of the other; it is the transverse field that lets these domain walls subsequently hop along the chain, one lattice site at a time, and lets pairs of them be created or annihilated. Deep in the disordered phase ($\Gamma \gg J_z$), the same fermionic quasiparticle is more naturally pictured instead as a single spin flipped away from the fully $x$-polarized background. These are simply two limiting descriptions of one and the same particle-like excitation: its energy gap shrinks continuously as $\Gamma$ approaches $\Gamma_c$ from either side, and vanishes exactly at the transition, where the excitations become gapless and the low-energy physics turns scale-invariant.

**A quantum model in $d$ dimensions is a classical model in $d+1$ dimensions.** More generally, in any number of spatial dimensions $d$, the $d$-dimensional quantum TFIM can be mapped onto a $(d+1)$-dimensional *classical* Ising model. The extra dimension represents imaginary time: splitting the quantum-mechanical operator $e^{-\beta H}$ into many thin slices and inserting a complete set of classical spin configurations between each one (a Suzuki-Trotter decomposition) turns the quantum partition function into that of an ordinary classical Ising model living on a $(d+1)$-dimensional lattice, with the transverse field controlling how strongly neighboring time slices are coupled to one another. This quantum-to-classical correspondence is both a conceptual bridge back to the purely classical [Ising Model](../ising) page, and the practical reason the quantum Monte Carlo methods described below work at all: they sample configurations of the equivalent classical model in one higher dimension, exactly as the classical Ising model's own Monte Carlo methods sample classical spin configurations directly. At the 1D TFIM's quantum critical point specifically, space and imaginary time in fact enter on a completely equal footing, so the transition there is equivalent to the ordinary 2D classical Ising model exactly at *its* critical point.

## Phenomena

**Quantum phase transitions vs. classical phase transitions.** The classical Ising model's phase transition is driven by temperature: raise $T$ high enough and thermal fluctuations always eventually destroy order, however strong the coupling $J$. The TFIM's phase transition is fundamentally different in kind — it occurs at exactly $T=0$, where there are no thermal fluctuations at all, and is driven instead purely by the strength of the transverse field $\Gamma$, i.e. by *quantum* fluctuations of the kind introduced above. Formally, this shows up as a qualitative change in the character of the ground state itself as $\Gamma$ is tuned through $\Gamma_c$ — a phenomenon that only becomes truly sharp (mathematically non-analytic) in the limit of an infinite lattice, exactly as for the classical transition.

- For $\Gamma < \Gamma_c$, the system is in an **ordered phase**: the $J_z$ term wins, and the ground state spontaneously breaks the model's $\mathbb{Z}_2$ symmetry — the symmetry $S_i^z \to -S_i^z$ on every site simultaneously, under which the Hamiltonian is invariant but an ordered state is not — to pick out one of the two possible ordered configurations.
- For $\Gamma > \Gamma_c$, the system is in a **disordered phase**: the field term wins, quantum fluctuations dominate throughout the lattice, and the $\mathbb{Z}_2$ symmetry is restored, so $\langle S_i^z \rangle = 0$ everywhere, just as for a single spin in a transverse field.

**Order parameter and spontaneous symmetry breaking.** The natural order parameter is the same one used for the classical Ising model, $m = \langle S_i^z \rangle$: it vanishes throughout the disordered phase and grows continuously from zero as $\Gamma$ is lowered through $\Gamma_c$ — again a *continuous* (second-order) transition, just as in the classical model, but now as a function of $\Gamma$ rather than $T$. There is a subtlety worth knowing if you plan to compute this numerically: on any finite lattice, the $\mathbb{Z}_2$ symmetry cannot truly be broken, so the two ordered configurations mix into symmetric and antisymmetric combinations that form the ground state and the first excited state, split by an energy gap that shrinks exponentially fast as the lattice grows. Only in the thermodynamic limit does this splitting vanish completely and true symmetry breaking, with a genuinely nonzero order parameter, become possible. This finite-size splitting is directly visible in the low-lying spectra computed in the [ED-04 tutorial](../../../tutorials/ed/ed04) below, and is a useful, very general diagnostic for spontaneous symmetry breaking in any finite-size numerical study.

**Quantum criticality.** Near $\Gamma_c$, the correlation length $\xi$ — roughly, how far correlations between spins extend along the lattice — diverges as $\xi \sim |\Gamma - \Gamma_c|^{-\nu}$, exactly as for a classical continuous transition tuned by temperature. But because the transition is quantum, there is now also a *correlation time* that diverges in an analogous way, $\xi_\tau \sim \xi^{z}$, characterized by a dynamical critical exponent $z$ that has no classical-transition analogue. The quantum-to-classical mapping above shows that the 1D TFIM's quantum critical point is equivalent to the 2D classical Ising critical point, with space and imaginary time entering symmetrically; correspondingly this quantum critical point has $z=1$, and shares the exact same critical exponents as the classical 2D Ising transition on the [Ising Model](../ising) page — for instance $\nu = 1$ and $\eta = 1/4$, the same value of $\eta$ extracted numerically in the [MC-07 tutorial](../../../tutorials/mcs/mc07) for the purely classical model.

**Universality beyond the Ising model itself.** Because it is the simplest model with a $\mathbb{Z}_2$-symmetric ordered phase and a continuous quantum phase transition driven by a single tuning parameter, the TFIM's universality class describes the low-energy physics of many other systems that look quite different microscopically — including certain structural (ferroelectric) phase transitions, quantum magnets with strong easy-axis anisotropy, and, more abstractly, any system whose relevant low-energy physics reduces to a single fluctuating two-state degree of freedom competing against an ordering interaction. This is exactly the same phenomenon of universality already introduced for the classical model, now extended across the quantum-classical correspondence.

## Methods

The 1D transverse field Ising model is exactly solvable ([Pfeuty (1970)](https://doi.org/10.1016/0003-4916(70)90270-8)). Beyond 1D, and for properties not accessible from the exact solution (such as finite-size spectra away from the thermodynamic limit), numerical methods are needed:

| Method | Strengths | Limitations | Applications |
|---|---|---|---|
| **ED** — see [sparsediag](../../methods/ed/sparsediag) | Exact results for small systems; captures the full quantum spectrum, including entanglement | Limited to small systems, since the Hilbert space grows as $2^N$ | Finite-size spectra and critical/CFT data; benchmarking other methods |
| **QMC** — see [Stochastic Series Expansion](../../methods/qmc/sse) | Handles much larger systems; gives access to finite-temperature properties | Requires a QMC code that supports an external field (e.g. `dirloop_sse`, not `looper`); statistical rather than systematic errors | Phase diagrams; finite-temperature properties; large 2D/3D systems |

Two tutorials work through the critical transverse field Ising chain directly:

- [ED-04: Conformal field theory description of 1D critical spectra](../../../tutorials/ed/ed04) — uses `sparsediag` to compute the finite-size spectrum of the critical transverse-field Ising chain and matches the extracted scaling dimensions to the known conformal field theory operator content
- [Transverse Field Quantum Ising Model (Jupyter notebook)](../../../tutorials/jupyter/ed/isingtransversefield) — an interactive, runnable version of the same calculation

---

For an overview of the other models in ALPS, see [Models in ALPS](..).
