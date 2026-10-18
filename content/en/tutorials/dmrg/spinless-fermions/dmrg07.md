---
title: DMRG-07 Introduction
weight: 1
math: true
toc: true
---

In this tutorial series we revisit the Heisenberg chain we saw in the previous modules, but the analysis is done through the lens of spinless fermions. Here we focus on the XXZ Heisenberg model, and translate it into the language of spinless fermions using the transformation introduced by [Jordan and Wigner (1928)](https://doi.org/10.1007/BF01331938). That mapping became a solution method in the hands of [Lieb, Schultz, and Mattis (1961)](https://doi.org/10.1016/0003-4916(61)90115-4), who used it to diagonalize the XY chain exactly. Throughout this series we will see that the two languages describe the same system, albeit with different symmetries available, making one more suitable than the other depending on what is being studied.

---

## The XXZ Hamiltonian

The starting point is the anisotropic Heisenberg (XXZ) chain with nearest-neighbor coupling $J$ and anisotropy $\Delta$:

$$
\boxed{\;\hat H \;=\; J\sum_{j=1}^{L}\Big(\hat S^x_j \hat S^x_{j+1} \;+\; \hat S^y_j \hat S^y_{j+1} \;+\; \Delta\, \hat S^z_j \hat S^z_{j+1}\Big)\;}
$$

As before, the local Hilbert space at each site is two-dimensional, $\{\lvert\uparrow\rangle,\lvert\downarrow\rangle\}$, so the full Hilbert space has dimension $2^L$. There are a few special cases worth keeping in mind, which can be used to further benchmark our DMRG algorithms:

| $\Delta$ | Name | Comment |
|---|---|---|
| $0$ | XX model | will turn out to be *free* fermions |
| $1$ | isotropic Heisenberg | $SU(2)$ symmetric |
| $\to\infty$ | Ising limit | classical, ordered |

Each of these limits comes with an exact result to check against. At $\Delta = 0$ the chain is the XY model diagonalized by [Lieb, Schultz, and Mattis (1961)](https://doi.org/10.1016/0003-4916(61)90115-4), which is free fermions once the mapping below is in place. At $\Delta = 1$ the ground state energy follows from the Bethe ansatz of [Bethe (1931)](https://doi.org/10.1007/BF01341708), and the full anisotropic line was solved by [Yang and Yang (1966)](https://doi.org/10.1103/PhysRev.150.321). These are the reference numbers the DMRG runs are benchmarked against in [DMRG-08](../dmrg08) and [DMRG-11](../dmrg11).

Let's now proceed by playing the usual game of defining the ladder operators to cast the above Hamiltonian in a more pleasing analytic form:

$$
\hat S^{\pm}_j \;=\; \hat S^x_j \pm i\,\hat S^y_j
\qquad\Longleftrightarrow\qquad
\hat S^x_j = \tfrac{1}{2}\big(\hat S^+_j + \hat S^-_j\big), \quad
\hat S^y_j = \tfrac{1}{2i}\big(\hat S^+_j - \hat S^-_j\big).
$$

Note $(\hat S^+)^\dagger = \hat S^-$, meaning the ladder operators are **not** Hermitian, unlike $\hat S^z$. This serves as a first hint that $\hat S^\pm$ can naturally be mapped to fermionic creation/annihilation operators, while $\hat S^z_j$ is a natural candidate for density (more on this below). For now, we simply transform the above Hamiltonian to the usual form:

$$
\boxed{\;\hat H = J\sum_{j=1}^{L}\left[\tfrac{1}{2}\Big(\hat S^+_j \hat S^-_{j+1} + \hat S^-_j \hat S^+_{j+1}\Big) + \Delta\, \hat S^z_j \hat S^z_{j+1}\right]\;}
$$

Read physically: the first term **moves** a flipped spin from site $j+1$ to site $j$ (and back) — this is a *hopping* term. The second term is diagonal in the $S^z$ basis — this is an *interaction*. That reading is exactly what the fermionization will make literal.

---

## Commutation and anticommutation relations
To fully justify the above analogies we will need to dive into the commutation and anti-commutation relations of our spin operators. As we all know, the spin algebra is given by:

$$
\big[\hat S^a_n,\, \hat S^b_m\big] \;=\; i\,\delta_{nm}\,\sum_c \epsilon_{abc}\, \hat S^c_n .
$$

The $\delta_{nm}$ is the crucial structural fact: **spins on different sites commute.** They are *distinguishable local degrees of freedom*.

For spin-$\tfrac{1}{2}$ the anticommutator on any two sites is:

$$
\big\{\hat S^a_n,\, \hat S^b_m\big\} \;=\; \tfrac{1}{2}\,\delta_{nm}\,\delta_{ab}\,\hat{\mathbb 1}
\;+\; 2\,\big(1-\delta_{nm}\big)\,\hat S^a_n \hat S^b_m ,
$$

so in particular $\big(\hat S^a_n\big)^2 = \tfrac{1}{4}\hat{\mathbb 1}$.

From the algebra above we can find the algebra of our ladder operators:

$$
\big[\hat S^+_i,\, \hat S^-_j\big] = 2\,\delta_{ij}\,\hat S^z_i ,
\qquad
\big[\hat S^z_i,\, \hat S^{\pm}_j\big] = \pm\,\delta_{ij}\,\hat S^{\pm}_i .
$$

The second relation says $\hat S^{\pm}$ raises/lowers the eigenvalue of $\hat S^z$ by exactly $1$ — it changes $m = -\tfrac12 \to +\tfrac12$, which again looks like adding or subtracting a particle!

Now for the key observation that really bridges the gap between our analogy and actually forming a quantitative mapping. The anticommutation relations on a **single site** reveal the following:

$$
\big\{\hat S^+_i,\, \hat S^-_i\big\} = 2\big(\hat S^{x\,2}_i + \hat S^{y\,2}_i\big) = 2\left(\tfrac14 + \tfrac14\right) = \hat{\mathbb 1},
$$

$$
\big\{\hat S^{\pm}_i,\, \hat S^{\pm}_i\big\} = 2\big(\hat S^{\pm}_i\big)^2 = 0 .
$$

The second line is a **hard-core / exclusion condition**: you cannot raise a spin-$\tfrac12$ twice. Comparing this with the fermionic algebra we want:

$$
\big\{\hat c_i,\, \hat c^{\dagger}_j\big\} = \delta_{ij},
\qquad
\big\{\hat c_i,\, \hat c_j\big\} = \big\{\hat c^{\dagger}_i,\, \hat c^{\dagger}_j\big\} = 0 .
$$

On one site the identification $\hat S^+ \leftrightarrow \hat c^\dagger$, $\hat S^- \leftrightarrow \hat c$ is exactly right **locally**. Notice that *on different sites* this identification fails: 
$$
\big[\hat c^\dagger_i,\, \hat c_j\big] = \hat c^\dagger_i \hat c_j - \hat c_j \hat c^\dagger_i = 2\,\hat c^\dagger_i \hat c_j \;\neq\; 0 .
$$ 

That is, spins commute, fermions anticommute. Concretely: exchanging two spin flips on distant sites costs nothing, whereas exchanging two fermions must cost a minus sign. A purely *local* substitution can never generate that sign, because it has no way of knowing what lies between the two sites.

> To faithfully reproduce these commutation relations we will need to append a non-local string operator to our creation and annihilation operators via the *Jordan–Wigner transformation*.

First, let's make the mapping between the state space clear to finish our motivation.

---

## Mapping states: spin configurations $\to$ occupation numbers

Following the above analysis, we can identify the two local states with an empty and an occupied orbital:

$$
\lvert \downarrow \rangle_j \;\longmapsto\; \lvert 0 \rangle_j, \qquad
\lvert \uparrow \rangle_j \;\longmapsto\; \lvert 1 \rangle_j .
$$

That is, "down spin" $=$ empty site, "up spin" $=$ one particle. Because a site can hold either $0$ or $1$ particle and never $2$, the particles are automatically subject to a Pauli-type exclusion — which is the state-space version of $(\hat S^+)^2 = 0$ found above. As described above, we can also see:

$$
\boxed{\;\hat S^z_j \;=\; \hat n_j - \tfrac{1}{2} \;=\; \hat c^\dagger_j \hat c_j - \tfrac{1}{2}\;}
$$

Note the direct consequence for the total magnetization:

$$
\hat S^z_{\text{tot}} = \sum_j \hat S^z_j = \hat N - \frac{L}{2}, \qquad \hat N = \sum_j \hat n_j .
$$

Zero magnetization $\Leftrightarrow$ half filling.

---

## The Jordan–Wigner transformation

We will now cover the Jordan–Wigner transformation, skipping most of the algebraic details. This is a good exercise, but will not be too important for our purposes. The construction is the one given in [Jordan and Wigner's 1928 paper](https://doi.org/10.1007/BF01331938), where it was introduced to write fermion operators in terms of spins.

Start by defining the local parity operator on site $l$:

$$
e^{i\pi \hat n_l} \;=\; \hat{\mathbb 1} - 2\hat n_l \;=\; -2\hat S^z_l .
$$

From this we can build the **string operator** for site $j$, simply being the product of parities of everything strictly to its left:

$$
\boxed{\;\hat P_j \;=\; \prod_{l<j} e^{i\pi \hat n_l} \;=\; \prod_{l<j}\big(1 - 2\hat n_l\big) \;=\; \prod_{l<j}\big(-2\hat S^z_l\big)\;}
$$

$\hat P_j$ measures the **parity of the number of fermions to the left of $j$**: it returns $+1$ if that number is even, $-1$ if odd. It is manifestly non-local — it depends on the entire left half of the chain — and it is $\hat P_j^\dagger = \hat P_j = \hat P_j^{-1}$. It's job is to count the number of anticommutation relations a fermionic operator undergoes on traversing the lattice, and it supplies the necessary sign to faithfully reproduce the above commutation relations.

The sought after transformation is now at our fingertips and it takes the following form:
$$
\boxed{\;
\hat S^+_j = \hat P_j\, \hat c^\dagger_j = \hat c^\dagger_j\,\hat P_j ,
\qquad
\hat S^-_j = \hat P_j\, \hat c_j = \hat c_j \,\hat P_j ,
\qquad
\hat S^z_j = \hat n_j - \tfrac{1}{2}
\;}
$$

(The two orderings agree because $\hat P_j$ contains only sites $l<j$, and it is *even* in fermion operators, so it commutes with $\hat c^{(\dagger)}_j$.)

Inverting, using $\hat P_j^2 = \hat{\mathbb 1}$ and $\hat P_j$ written in terms of spins:

$$
\hat c^\dagger_j = \left[\prod_{l<j}\big(-2\hat S^z_l\big)\right] \hat S^+_j ,
\qquad
\hat c_j = \left[\prod_{l<j}\big(-2\hat S^z_l\big)\right] \hat S^-_j .
$$

So $\hat c_j$ is *not* just a local spin flip: it is "flip the spin at $j$, and multiply by $(-1)$ for every up-spin to the left of $j$." Note that $\hat S^z_j$ needs no string — it is diagonal, and does not exchange anything.

### Why the string does the job

Without getting into the gory algebraic details we outline why the string operator works. The one identity that carries all the weight follows from considering a single site and noting the parity operator **anticommutes** with the spin flip:

$$
\big\{\hat S^z_i,\, \hat S^{\pm}_i\big\} = 0
\qquad\Longleftrightarrow\qquad
\big\{ e^{i\pi\hat n_i},\, \hat S^{\pm}_i \big\} = 0 .
$$

Physically: flipping the site *changes* its parity, so flip and parity anticommute. Assuming $i<j$ (W.L.O.G.), it can be seen that every factor in $\hat P_j$ commutes with $\hat S_i^-$ **except** $e^{i\pi\hat{n}_i}$, which anticommutes with it. Following your nose you can show the following anticommutation relations:

$$
\big\{\hat c_i,\hat c^\dagger_j\big\} = \delta_{ij}, \qquad
\big\{\hat c_i,\hat c_j\big\} = \big\{\hat c^\dagger_i,\hat c^\dagger_j\big\} = 0 .
$$

**The string is exactly the minimal fix.** It supplies the $(-1)$ needed for exchange, and, because $\hat P_j^2 = 1$, it contributes nothing else. The map is unitary and the Hilbert space is unchanged ($2^L$ states either way); we have only relabeled the basis and redefined which operators we call elementary.

> The price is that the ordering $1,2,\dots,L$ has been given physical meaning. Jordan–Wigner is natural in 1D precisely because a chain has an unambiguous "to the left of". In higher dimensions the string has no canonical path, which is why the trick does not straightforwardly generalize; the two-dimensional constructions of [Fradkin (1989)](https://doi.org/10.1103/PhysRevLett.63.322) pick a path and pay for it with a gauge field.

---

## Mapping the Hamiltonian

### Hopping term: the strings cancel

Again, most of the algebraic steps are skipped here. We focus on the nearest-neighbor bond $\hat S^+_j \hat S^-_{j+1}$ and substitute:

$$
\hat S^+_j \hat S^-_{j+1}
= \big(\hat c^\dagger_j \hat P_j\big)\big(\hat P_j e^{i\pi \hat n_j} \hat c_{j+1}\big)
= \hat c^\dagger_j\, e^{i\pi \hat n_j}\, \hat c_{j+1},
$$

where $\hat P_j^2 = \hat{\mathbb 1}$ removed the entire string from sites $l<j$. The single surviving parity factor also drops out, because $\hat c^\dagger_j \hat n_j = \hat c^\dagger_j \hat c^\dagger_j \hat c_j = 0$. Therefore:

$$
\boxed{\;\hat S^+_j \hat S^-_{j+1} = \hat c^\dagger_j \hat c_{j+1}\;}
\qquad\text{and h.c.}\qquad
\hat S^-_j \hat S^+_{j+1} = \hat c^\dagger_{j+1}\hat c_j .
$$

This is why Jordan–Wigner is *useful* rather than merely correct: for **nearest-neighbor** terms the non-local strings cancel between the two sites, and a manifestly non-local transformation produces a manifestly local Hamiltonian. (For longer-range hopping $\hat S^+_i\hat S^-_j$ with $|i-j|>1$ the string does **not** cancel — a residual $\prod_{i<l<j}e^{i\pi\hat n_l}$ survives.)

### Interaction term

This one is immediate from the identification $\hat S^z_j = \hat n_j - \tfrac{1}{2}$:

$$
\Delta\,\hat S^z_j \hat S^z_{j+1} = \Delta\left(\hat n_j - \tfrac{1}{2}\right)\left(\hat n_{j+1} - \tfrac{1}{2}\right).
$$

### The spinless-fermion Hamiltonian

$$
\boxed{\;
\hat H \;=\; \frac{J}{2}\sum_{j}\Big(\hat c^\dagger_j \hat c_{j+1} + \hat c^\dagger_{j+1}\hat c_j\Big)
\;+\; J\Delta \sum_{j}\left(\hat n_j - \tfrac{1}{2}\right)\left(\hat n_{j+1} - \tfrac{1}{2}\right)
\;}
$$

Expanding the second term to read off the standard lattice-model parameters:

$$
\hat H = -t\sum_j\Big(\hat c^\dagger_j \hat c_{j+1} + \text{h.c.}\Big) \;+\; V\sum_j \hat n_j \hat n_{j+1} \;-\; \mu \sum_j \hat n_j \;+\; \frac{J\Delta L}{4},
$$

$$
t = -\frac{J}{2}, \qquad V = J\Delta, \qquad \mu = J\Delta .
$$

So the XXZ chain **is** a chain of spinless fermions hopping with amplitude $J/2$ and interacting with nearest-neighbor strength $J\Delta$. The constant $J\Delta L/4$ and the chemical-potential shift $\mu$ are both artifacts of the $-\tfrac12$ in $\hat S^z = \hat n - \tfrac12$ — precisely the pieces that disappear if you sloppily use Pauli matrices.

**Boundary caveat.** For periodic boundary conditions in the *spin* chain, the bond $L \to 1$ does not have its string canceled: $\hat P_L$ wraps around the whole system and leaves behind a global parity factor $e^{i\pi \hat N}$. The fermion chain is therefore periodic or antiperiodic depending on whether the total fermion number $\hat N$ is odd or even. With open boundaries this subtlety is absent.

---

## $U(1)$ symmetry and particle-number sectors

The original Hamiltonian conserves total magnetization:

$$
\big[\hat H,\, \hat S^z_{\text{tot}}\big] = 0 ,
$$

because the hopping term $\hat S^+_j\hat S^-_{j+1}$ raises one spin and lowers another, leaving $\sum_j S^z_j$ untouched. Via $\hat S^z_{\text{tot}} = \hat N - L/2$, this becomes conservation of **particle number**:

$$
\boxed{\;\big[\hat H,\, \hat N\big] = 0, \qquad \hat N = \sum_{j} \hat c^\dagger_j \hat c_j \;}
$$

The associated symmetry is the global $U(1)$ phase rotation:

$$
\hat c_j \;\longmapsto\; e^{i\theta}\, \hat c_j , \qquad
\hat c^\dagger_j \;\longmapsto\; e^{-i\theta}\, \hat c^\dagger_j ,
$$

under which every term of $\hat H$ (one $\hat c^\dagger$ per $\hat c$) is invariant. Generated by $\hat N$: $\hat U(\theta) = e^{i\theta \hat N}$.

**Consequence.** $\hat H$ is block diagonal in the eigenbasis of $\hat N$. The $2^L$-dimensional Hilbert space decomposes into fixed-particle-number sectors:

$$
\mathcal{H} = \bigoplus_{N=0}^{L} \mathcal{H}_N , \qquad \dim \mathcal{H}_N = \binom{L}{N}, \qquad \sum_{N=0}^{L}\binom{L}{N} = 2^L ,
$$

and every eigenstate can be labeled $\lvert E, N\rangle$. Practically this is a large saving: instead of diagonalizing a $2^L \times 2^L$ matrix one diagonalizes each $\binom{L}{N}\times\binom{L}{N}$ block separately. DMRG, introduced by [White (1992)](https://doi.org/10.1103/PhysRevLett.69.2863), exploits the same block structure by carrying the quantum number through the renormalized basis; see the review by [Schollwöck (2005)](https://doi.org/10.1103/RevModPhys.77.259) for how abelian symmetries are implemented in practice. [DMRG-09](../dmrg09) puts this to work by targeting fixed particle-number sectors. The dictionary between the two languages:

| Spin language | Fermion language |
|---|---|
| total magnetization $S^z_{\text{tot}}$ | particle number $N - L/2$ |
| zero magnetization | half filling, $N = L/2$ |
| fully polarized $\lvert\downarrow\downarrow\cdots\rangle$ | vacuum, $N = 0$ |
| single magnon | one-particle sector, $N=1$ |
| magnon dispersion | single-particle band $\varepsilon_k$ |

(There is additionally a discrete $\mathbb{Z}_2$ symmetry, spin flip $\leftrightarrow$ particle–hole $\hat c_j \to \hat c^\dagger_j$, which maps the sector $N$ to $L-N$ and is a symmetry of $\hat H$ at half filling.)

---

## Summary

$$
\hat H_{\text{XXZ}} = J\sum_j\big(\hat S^x_j\hat S^x_{j+1} + \hat S^y_j\hat S^y_{j+1} + \Delta \hat S^z_j \hat S^z_{j+1}\big)
$$

1. **Ladder form:** $\hat S^{\pm} = \hat S^x \pm i\hat S^y$ turns the transverse coupling into $\tfrac12(\hat S^+_j\hat S^-_{j+1} + \text{h.c.})$ — a hopping term.
2. **On-site algebra:** $\{\hat S^+_i,\hat S^-_i\} = 1$ and $(\hat S^\pm_i)^2 = 0$ are already fermionic; only the off-site relations ($[\hat S^+_i,\hat S^-_j] = 0$ vs. $\{\hat c^\dagger_i,\hat c_j\}=0$) disagree.
3. **State mapping:** $\lvert\downarrow\rangle \to \lvert 0\rangle$, $\lvert\uparrow\rangle\to\lvert1\rangle$, giving $\hat S^z_j = \hat n_j - \tfrac12$.
4. **Jordan–Wigner:** attach the non-local string $\hat P_j = \prod_{l<j}(-2\hat S^z_l)$, which counts fermion parity to the left, supplying exactly the exchange sign that a local map cannot.
5. **Result:** interacting spinless fermions, with the strings canceling on nearest-neighbor bonds.
6. **$U(1)$:** magnetization conservation becomes particle-number conservation, so eigenstates are labeled by $N$ and $\hat H$ block-diagonalizes.

$$
\hat H = \frac{J}{2}\sum_j \big(\hat c^\dagger_j \hat c_{j+1} + \text{h.c.}\big) + J\Delta\sum_j\big(\hat n_j - \tfrac12\big)\big(\hat n_{j+1}-\tfrac12\big)
$$
