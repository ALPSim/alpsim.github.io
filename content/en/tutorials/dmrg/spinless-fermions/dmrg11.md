---
title: DMRG-11 Boundary Conditions
weight: 5
math: true
toc: true
---

Every simulation so far in this series has used an open chain, justified in passing as the geometry DMRG handles best. This module makes that choice the subject rather than the assumption, and puts a price on it.

Open and periodic boundaries give different answers at finite $L$ and converge to the thermodynamic limit at different rates. To measure any of that we need a known target, so we work at the one interaction strength where the Bethe ansatz supplies an exact bulk energy — $V = 2t$, the isotropic Heisenberg point — and compare the two geometries against it.

## The reference point

Using the Hamiltonian for the spinless fermion chain in [DMRG-07](../dmrg07) with parameters:

$$
t = \frac{J_{xy}}{2}, \qquad V = J_z ,
$$

we focus on the isotropic point $J_{xy} = J_z = J$, and therefore **$V = 2t$**. Note, this is simultaneously the critical interaction strength at which the chain opens a charge-density-wave gap as well as the one interaction strength where the Bethe ansatz hands us a closed-form energy. This was established for the Heisenberg chain by [Bethe (1931)](https://doi.org/10.1007/BF01341708) and extended to the anisotropic chain by [Yang and Yang (1966)](https://doi.org/10.1103/PhysRev.150.321), and quoted per bond (in the thermodynamic limit), in [DMRG-02](../../dmrg02) and used throughout [DMRG-03](../../dmrg03).

Note that the ring is a genuinely different model here, not just a different lattice: as [DMRG-08](../dmrg08) noted, periodic boundaries leave a surviving Jordan-Wigner string, so `hardcore boson` on a ring is the XXZ chain but no longer the spinless-fermion chain. The comparison below is between two boundary conditions on the *spin* problem, which is what the Bethe ansatz value refers to.

## Where the surface term comes from

Expanding the interaction with $S^z = n - \tfrac12$:

$$
J_z\sum_{\langle ij\rangle} S^z_iS^z_j = J_z\sum_{\langle ij\rangle} n_in_j \;-\; \frac{J_z}{2}\sum_i z_i n_i \;+\; \frac{J_z N_b}{4} ,
$$

where $z_i$ counts the bonds touching site $i$ and $N_b$ is the number of bonds.
In the bulk $z_i = 2$ and the middle term is $-J_z\hat N$, a constant at fixed filling.

This is where the two geometries part company.
A ring has $z_i = 2$ everywhere and $N_b = L$: the middle term is a constant outright, and there is no surface at all.
An open chain has $N_b = L-1$ and $z_i = 1$ at the two ends, leaving a boundary field $\tfrac{J_z}{2}(n_1 + n_L)$ that ALPS's uniform `mu` cannot represent.

This is a *surface* term: it leaves the bulk energy density untouched and contributes at order $1/L$, so the open chain approaches the thermodynamic limit an order slower than the ring, whose leading correction is the conformal $1/L^2$.

## The cost of a ring

DMRG on a ring must carry entanglement across two cuts rather than one, and the bond dimension needed for a given accuracy grows sharply as a result.
The two effects pull against each other, so the runs below hold $D$ fixed at the same value for both geometries and let each cost show up on its own: the finite-size error in the energy per bond, and the truncation error at a given $D$.

## Lattice

An open chain of $L$ sites with $L-1$ bonds, every site carrying $-\mu\, n_i$ and every bond the same $t$ and $V$:

```
   -mu       -mu       -mu                       -mu       -mu
    o---------o---------o------- ... -------------o---------o
    1         2         3                        L-1        L
       t, V      t, V         t, V         t, V

    ^                                                       ^
    z = 1                                                   z = 1     <- boundary field lives here
              z = 2 everywhere in between
```

The two end sites touch one bond instead of two, which is the origin of the surface term.
The ring closes that gap, adding an $L$-th bond and making every site equivalent:

```
        t, V      t, V         t, V         t, V
    o---------o---------o------- ... -------------o
    |  -mu       -mu       -mu                -mu |
    1         2         3                         L
    |                  t, V                       |
    +---------------------------------------------+

    z = 2 everywhere, no surface, one extra cut for DMRG to carry
```

Both `open chain lattice` and `chain lattice` are built in, so no lattice file is needed — see the [ALPS lattice library](../../../../documentation/intro/latticehowtos).

## Parameters

As stated above, we use $J = 1$, so $t = J/2$, $V = J$, $\mu = J$. We also elect to use `hardcore boson` form for the reason given in [DMRG-08](../dmrg08):

| Parameter | Meaning | Value |
|---|---|---|
| `LATTICE` | the boundary condition under study | `open chain lattice` / `chain lattice` |
| `MODEL` | the boson form, established in [DMRG-10](../dmrg10) | `hardcore boson` |
| `L` | chain length | 16, 24, 32, 48, 64 |
| `CONSERVED_QUANTUMNUMBERS` | quantum numbers held fixed | `N` |
| `N_total` | particle-number sector; $L/2$ is half filling $\Leftrightarrow S^z_{\text{tot}} = 0$ | $L/2$ |
| `t` | hopping, $=J_{xy}/2$ | 0.5 |
| `V` | nearest-neighbor repulsion, $=J_z$; note $V = 2t$ | 1 |
| `mu` | chemical potential, $=J_z$, cancelling the $-J_z\hat N$ term | 1 |
| `SWEEPS` | finite-size sweeps | 8 |
| `NUMBER_EIGENVALUES` | eigenstates requested | 1 |
| `MAXSTATES` | bond dimension $D$, held equal for both geometries | 200 |

`LATTICE` is the only parameter that differs between the two runs, which is the point: whatever separates the columns below is the boundary condition and nothing else.

There is no `Sz_total` anywhere: a spinless fermion has no spin to project, and the sector is fixed by `N_total` instead.
That substitution is the parameter-file face of $\hat S^z_{\text{tot}} = \hat N - L/2$ from [DMRG-07](../dmrg07).

## Parameter files

The open chain, at the length used for the bond-dimension scan below:

```
LATTICE="open chain lattice"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=0.5
V=1
mu=1
L=32
NUMBER_EIGENVALUES=1
{SWEEPS=8; MAXSTATES=200}
```

The ring, identical in every line but the first:

```
LATTICE="chain lattice"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=0.5
V=1
mu=1
L=32
NUMBER_EIGENVALUES=1
{SWEEPS=8; MAXSTATES=200}
```

## Running the simulation

```
parameter2xml parm_open
dmrg --write-xml parm_open.in.xml
```

The script <a class="alps-download" href="../run_bethe_ansatz.py" data-filename="run_bethe_ansatz.py" target="_blank" rel="noopener">`run_bethe_ansatz.py`</a> runs both geometries, converts each energy to spin units, and prints the two tables below:

```
python3 run_bethe_ansatz.py --lengths 16 24 32 48 64 --maxstates 200 \
                           --dscan 20 40 80 160 320 --dscan-length 32
```

Pass `--alps-bin /path/to/alps/bin` if the ALPS executables are not on your `PATH`.

## Results

Each DMRG energy is converted to spin units by adding the constant derived above, $E_{\text{XXZ}} = E_{\text{hcb}} + J_z N_b/4$, and divided by the number of bonds — $N_b = L-1$ on the open chain, $N_b = L$ on the ring.

### Energy per bond at equal bond dimension

Both geometries are run at $D = 200$, eight sweeps, half filling. The only difference between them is `LATTICE`:

| $L$ | $e_0$ open | $e_0 - (1/4-\ln 2)$ | $e_0$ ring | $e_0 - (1/4-\ln 2)$ |
|---|---|---|---|---|
| 16 | $-0.503827247202$ | $-6.07\times10^{-2}$ | $-0.446393522539$ | $-3.25\times10^{-3}$ |
| 24 | $-0.483183015316$ | $-4.00\times10^{-2}$ | $-0.444583937807$ | $-1.44\times10^{-3}$ |
| 32 | $-0.473039369885$ | $-2.99\times10^{-2}$ | $-0.443953974654$ | $-8.07\times10^{-4}$ |
| 48 | $-0.462996653979$ | $-1.98\times10^{-2}$ | $-0.443505126160$ | $-3.58\times10^{-4}$ |
| 64 | $-0.458008367427$ | $-1.49\times10^{-2}$ | $-0.443348034588$ | $-2.01\times10^{-4}$ |

At every length the ring sits far closer to the Bethe ansatz value, and the two deviation columns pull apart as $L$ grows rather than closing on each other.

The open chain is worse not because DMRG did a poorer job on it — both columns are converged — but because of what it is being compared against. The Bethe value $1/4-\ln 2$ is the energy per bond of an *infinite* chain, which is pure bulk. The open chain's two end sites touch one bond instead of two, so they carry the boundary field derived above and the bonds near them are not bulk bonds. That excess is a fixed amount of energy: it lives at the two ends and does not grow with the chain. Dividing the total by $N_b$ bonds therefore spreads that constant over the whole system, adding a term of order $1/L$ to $e_0$ — and the open deviation column is exactly that surface energy per bond, nothing else. A ring has no ends at all: every site has two neighbors, every bond is a bulk bond, and no surface contribution enters its $e_0$ in the first place, so what remains in the ring column is the genuine finite-size correction.

The two convergence orders follow from that directly. Double the length and the open chain's deviation halves — the same fixed end cost shared over twice as many bonds — while the ring's quarters. It is a difference of *order*, $1/L$ against $1/L^2$, not of prefactor, so no amount of extra length closes it. The check is to multiply each column by its own power: the open chain's deviation times $L$ is flat across the whole series, confirming a genuine surface term, while the ring's times $L^2$ settles onto the conformal prediction $-\pi c v/6 = -\pi^2/12$ at central charge $c=1$ and spinon velocity $v = \pi J/2$.

### What the ring costs in bond dimension

The ring wins the table above, so the obvious question is why the rest of this series uses open chains. Holding $L=32$ and scanning $D$, with $\delta$ measured against each geometry's own converged energy taken from a $D=640$ run:

| $D$ | $e_0$ open | $\delta$ open | $e_0$ ring | $\delta$ ring |
|---|---|---|---|---|
| 20 | $-0.473039235310$ | $1.3\times10^{-7}$ | $-0.443463734082$ | $4.9\times10^{-4}$ |
| 40 | $-0.473039369518$ | $3.7\times10^{-10}$ | $-0.443911634024$ | $4.2\times10^{-5}$ |
| 80 | $-0.473039369884$ | $1.0\times10^{-12}$ | $-0.443952087972$ | $1.9\times10^{-6}$ |
| 160 | $-0.473039369885$ | $<10^{-15}$ | $-0.443953950800$ | $3.2\times10^{-8}$ |
| 320 | $-0.473039369885$ | $<10^{-15}$ | $-0.443953982242$ | $2.3\times10^{-10}$ |

The open chain is converged to nine digits by $D=40$ and to the full printed precision by $D=160$. The ring at $D=320$ has only just reached the accuracy the open chain had at $D=40$ — a factor of eight in bond dimension, at $L=32$ alone, and the factor grows with length. The reason is the extra entanglement cut: split a ring into two arcs and it is severed in two places, so the entanglement entropy across the cut is twice the open chain's at the same length, and the bond dimension needed to hold it grows accordingly.

The same cost is quietly present in the first table. At the fixed $D=200$ used there, the open chain sits at machine precision at every length in the series, while the ring's truncation error climbs by seven orders of magnitude between the shortest and longest chain — because the entanglement it has to carry grows with $L$ and the bond dimension does not. Over this range the ring's finite-size error is still comfortably the larger of the two, so the comparison stands; but the two are closing, and on a ring it is the bond dimension that runs out first.

## Summary

At equal bond dimension the ring is the better finite-size approximation to the bulk by a wide margin: its energy per bond converges as $1/L^2$ with the conformal coefficient $-\pi^2/12$, while the open chain carries a surface energy from its two singly-coordinated ends and converges only as $1/L$, leaving it $74$ times further from $1/4-\ln 2$ at $L=64$. What the ring pays for that is bond dimension: two entanglement cuts instead of one put it eight times behind the open chain in $D$ at $L=32$, with the gap widening as the chain gets longer. Open boundaries are used throughout this series because that second cost compounds with $L$ and the first does not — a surface term is a known $1/L$ correction, while an unconverged $D$ is an error with no form to fit.

## Questions

1. Push the ring's bond-dimension scan past $D=640$ at $L=32$ and plot $\delta$ against $D$ on log axes for both geometries. Is the ring's decay a power law in $D$ or an exponential, and how does that compare to the open chain's?
2. Repeat the $D$ scan at $L=64$ instead of $L=32$. By what factor does the ring's requirement grow with length, and does the open chain's grow at all?
3. Confirm the surface energy is local. Compare $L\,[e_0(L) - (1/4-\ln 2)]$ from the table above against the bond energy $\langle S_i\cdot S_{i+1}\rangle$ measured near the ends versus at the center of an open chain — how many sites in does the bond energy reach its bulk value?
4. Remove the surface term instead of tolerating it. Use the special-edge lattice of [DMRG-08](../dmrg08) to set $\mu_j = \tfrac{V}{2}z_j$ site by site, which cancels the boundary field exactly. Does the open chain's deviation column now fall as $1/L^2$, and does its coefficient match the ring's $-\pi^2/12$?
5. Repeat the comparison off the isotropic point, at $V = t$ ($\Delta = 1/2$) inside the gapless phase and at $V = 3t$ ($\Delta = 3/2$) inside the gapped CDW phase. Once the correlation length is finite the ring and the chain should agree exponentially fast in $L$ — at which $L$ does the distinction stop mattering?
