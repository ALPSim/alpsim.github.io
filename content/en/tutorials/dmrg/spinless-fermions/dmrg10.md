---
title: DMRG-10 Model Types in 1D
weight: 4
math: true
toc: true
---

This module runs the ALPS `spinless fermions` model through the `dmrg` application at the free-fermion point, where the ground state energy is known in closed form at finite length, and checks the result against it. This verifies the physics based assertion made in [DMRG-08](../dmrg08) numerically: hardcore bosons behave as spinless fermions in 1D.

## The model

The spinless fermion chain with nearest-neighbor hopping and nearest-neighbor repulsion is:

$$
H = -t\sum_{i=1}^{L-1}\big(c^\dagger_i c_{i+1} + c^\dagger_{i+1} c_i\big) \;+\; V\sum_{i=1}^{L-1} n_i n_{i+1} \;-\; \mu\sum_{i=1}^{L} n_i ,
$$

with $n_i = c^\dagger_i c_i \in \{0,1\}$.
This is the built-in `spinless fermions` model of the ALPS model library.
It is the fermionic image of the anisotropic Heisenberg chain solved by [Lieb, Schultz, and Mattis (1961)](https://doi.org/10.1016/0003-4916(61)90115-4), reached through the transformation of [Jordan and Wigner (1928)](https://doi.org/10.1007/BF01331938); again the DMRG algorithm itself is due to [White (1992)](https://doi.org/10.1103/PhysRevLett.69.2863).

At $V=0$ the chain is exactly solvable.
On an open chain the single-particle levels are:

$$
\varepsilon_k = -2t\cos\!\left(\frac{k\pi}{L+1}\right), \qquad k = 1,\dots,L ,
$$

and the ground state energy at $N$ particles is the sum of the $N$ lowest of them.
The DMRG energies below are measured against that closed form, which is exact at finite $L$ rather than an extrapolation.

## Parameters

| Parameter | Meaning | Value |
|---|---|---|
| `LATTICE` | built-in open chain, no lattice file required | `open chain lattice` |
| `MODEL` | the ALPS spinless-fermion model | `spinless fermions` |
| `L` | chain length | 8, 16, 32, 64 |
| `CONSERVED_QUANTUMNUMBERS` | quantum numbers held fixed, used to block-diagonalize $H$ | `N` |
| `N_total` | particle-number sector; $N=L/2$ is half filling | $L/2$ |
| `t` | nearest-neighbor hopping amplitude | 1 |
| `V` | nearest-neighbor repulsion; $V=0$ is the free-fermion point | 0 |
| `SWEEPS` | number of DMRG finite-size sweeps | 4 |
| `NUMBER_EIGENVALUES` | eigenstates requested | 1 |
| `MAXSTATES` | bond dimension $D$ kept after truncation | 100 |

Note there is no `Sz_total` because a spinless fermion has no spin to project. Instead, the sector is fixed by `N_total` as described in [DMRG-07](../dmrg07).
As a cautionary reminder, `Sz_total` is related to particle number: $\hat S^z_{\text{tot}} = \hat N - L/2$. For instance, zero magnetization corresponds to half filling.
Leaving `N_total` unset runs the calculation grand canonically over the full $2^L$-dimensional space, whereas fixing it to the half-filled sector (at $L=64$) restricts to the system to the $\binom{64}{32}\approx1.8\times10^{18}$ states.

## Parameter file

```
LATTICE="open chain lattice"
MODEL="spinless fermions"
CONSERVED_QUANTUMNUMBERS="N"
N_total=32
t=1
V=0
L=64
NUMBER_EIGENVALUES=1
{SWEEPS=4; MAXSTATES=100}
```

## Lattice

Our example takes place on an open chain of $L$ sites with every bond carrying the same hopping $t$ and repulsion $V$, while every site the same chemical potential $\mu$:

```
   -mu          -mu          -mu                     -mu
    o------------o------------o----- ... ------------o
    1            2            3                      L
       t, V         t, V                    t, V
```

Here we use the `open chain lattice`; see [ALPS lattice library](../../../../documentation/intro/latticehowtos) for other chain variants.

## What ALPS builds from the parameter file

The lattice is the same built-in `open chain lattice` used in [DMRG-08](../dmrg08) — $L$ vertices, $L-1$ edges, open boundaries, no lattice file needed. Nothing about it changes here. What changes is the Hamiltonian stamped onto it, and that is the whole subject of this module, so it is worth reading the definition.

`spinless fermions` is an entry in the ALPS library `models.xml`: a site basis, plus the terms to place on the vertices and edges the lattice hands over.

```xml
<SITEBASIS name="spinless fermion">
  <QUANTUMNUMBER name="N" min="0" max="1" type="fermionic"/>
  <OPERATOR name="cdag" matrixelement="1"><CHANGE quantumnumber="N" change="1"/></OPERATOR>
  <OPERATOR name="c"    matrixelement="1"><CHANGE quantumnumber="N" change="-1"/></OPERATOR>
  <OPERATOR name="n"    matrixelement="N"/>
</SITEBASIS>

<HAMILTONIAN name="spinless fermions">
  <PARAMETER name="mu" default="0"/>
  <PARAMETER name="t"  default="1"/>
  <PARAMETER name="V"  default="0"/>
  <BASIS ref="spinless fermion"/>
  <SITETERM site="i">
    -mu#*n(i)
  </SITETERM>
  <BONDTERM source="i" target="j">
    -t#*(cdag(i)*c(j)+cdag(j)*c(i)) + V#*n(i)*n(j)
  </BONDTERM>
</HAMILTONIAN>
```

`min="0" max="1"` is the hardcore constraint: a site is empty or singly occupied, nothing else. The `SITETERM` goes on every vertex and the `BONDTERM` on every edge, so the open chain turns them into the $L$ chemical-potential terms and $L-1$ hopping-and-interaction terms of the Hamiltonian at the top of this page.

The line that matters for this module is `type="fermionic"`. It tells ALPS that `N` counts fermions rather than bosons, so the Jordan–Wigner strings that give `cdag(i)*c(j)` its anticommuting sign are inserted for you: the bond term above is written as though the operators commuted, and ALPS supplies the signs. Declare the same basis without that attribute and you have hardcore bosons, with an identical-looking bond term — the two models differ by nothing else. On an open chain the strings cancel between neighbors and the two must agree exactly, which is what the energies below test.

## Running the simulation

Note that at $L=32$ the half-filled sector already holds $\binom{32}{16}\approx6.0\times10^{8}$ states and at $L=64$ about $1.8\times10^{18}$, far beyond exact diagonalization. DMRG is the right tool across this whole range. Since the ground state of the free model ($V=0$) is lightly entangled, a bond dimension of a few hundred reaches machine precision, with each run below converging in seconds.

```
parameter2xml parm_sf
dmrg --write-xml parm_sf.in.xml
```

Each task writes `parm_sf.taskN.out.xml`, containing the converged energy and the truncation error.

## Results

Below is a list of ground state energies ($E_0=\sum_{k=1}^{N}\varepsilon_k$) at half filling, with parameters $t=1$, $V=0$, $D=100$, for different system sizes:

| $L$ | $N$ | $E_0$ (`dmrg`) | $E_0$ (exact) | difference |
|---|---|---|---|---|
| 8 | 4 | $-4.758770483143635$ | $-4.758770483143634$ | $1.8\times10^{-15}$ |
| 16 | 8 | $-9.837951447459423$ | $-9.837951447459421$ | $1.8\times10^{-15}$ |
| 32 | 16 | $-20.016387900483664$ | $-20.016387900485139$ | $1.5\times10^{-12}$ |
| 64 | 32 | $-40.384313159844041$ | $-40.384313161218486$ | $1.4\times10^{-9}$ |

The chain converges to machine precision for $L=32$ and below, and to nine digits at $L=64$.

Note, $D=100$ is more than this problem needs. The half-chain entanglement entropy of a free-fermion chain grows only logarithmically, $S \simeq \tfrac{1}{6}\ln(2L/\pi) + 0.48$, giving $S \approx 1.1$ at $L=64$ — so a handful of Schmidt states carry nearly all the weight, and the rest of the bond dimension buys digits rather than physics. At $L=64$:

| $D$ | truncation error | $E_0 - E_{\text{exact}}$ |
|---|---|---|
| 20 | $2.85\times10^{-6}$ | $3.20\times10^{-4}$ |
| 50 | $3.27\times10^{-9}$ | $3.98\times10^{-7}$ |
| 100 | $1.40\times10^{-11}$ | $1.37\times10^{-9}$ |
| 200 | $1.21\times10^{-14}$ | $1.16\times10^{-12}$ |

Seven digits are already available at $D=50$. The two columns fall together, their ratio holding near $25$ across eight orders of magnitude, which is the proportionality that licenses extrapolation to $D\to\infty$ when no exact answer is at hand.

The intensive energy per site at $L=64$ is $E_0/L = -0.631005$, against the thermodynamic-limit value $-2t/\pi = -0.636620$ for the half-filled chain; the remaining gap is the open chain's $O(1/L)$ boundary correction, which [DMRG-11](../dmrg11) takes apart.

## Summary

The ALPS `spinless fermions` model reproduces the exact free-fermion ground state energy of the open chain to machine precision at $L \le 32$ and to $1.4\times10^{-9}$ at $L=64$, with $D=100$ and four sweeps. The `sparse_ed` module would be hopelessly overwhelmed at these system sizes, showcasing the utility of `dmrg` in 1D systems.

## Questions

1. Fit the energy error against the truncation error across $D = 20, 50, 100, 200$ at $L=64$ and extrapolate to $\epsilon \to 0$. How much better than the raw $D=200$ result does the extrapolation get?
2. Move off half filling to $N = L/4$. The closed form is still exact — does the convergence in $D$ improve or degrade, and why?
3. Turn on the interaction. At what value of $V/t$ does the bond dimension needed for a fixed accuracy start to grow sharply, and how does that relate to the transition at $V=2t$?
4. Track $E_0/L$ as $L$ grows toward $-2t/\pi$. Is the finite-size correction $O(1/L)$ or $O(1/L^2)$, and what does that imply about the boundary?
5. Dump the term list for a periodic chain (`LATTICE="chain lattice"`). The Jordan-Wigner strings no longer cancel between sites 1 and $L$ — which extra terms appear, and what sign do they carry?
