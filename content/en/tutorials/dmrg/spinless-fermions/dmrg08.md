---
title: DMRG-08 Ground State Energies
weight: 2
math: true
toc: true
---

In this tutorial we put the machinery developed in the [DMRG-07 Introduction](../dmrg07) to work and compute ground state energies of the one-dimensional spinless-fermion chain with the ALPS `dmrg` application, following the same workflow as [DMRG-03](../../dmrg03) for the spin chains.

## Phenomena of interest

The spinless-fermion chain with nearest-neighbor repulsion — the *$t$–$V$ model* — is the simplest interacting fermion model there is. It nevertheless contains the essential physics of one-dimensional metals: at weak coupling it is a Luttinger liquid, a critical metallic state with no quasiparticles, and at strong repulsion ($V > 2t$ at half filling) it undergoes a transition into a gapped, charge-ordered insulator. Through the Jordan–Wigner transformation derived in the [Introduction](../dmrg07), it is exactly the XXZ spin chain in disguise, so every result obtained here can be cross-checked against the spin-chain tutorials. As in [DMRG-03](../../dmrg03), we start with the most basic observable — the ground state energy $E_0$ — computed at two points of the phase diagram where exact reference values exist: the free-fermion point $V=0$, and the interaction strength $V=2t$ that maps onto the isotropic Heisenberg chain of [DMRG-03](../../dmrg03).

## The model

We study the $t$–$V$ Hamiltonian on an open chain of $L$ sites,

$$
\hat H \;=\; -t\sum_{j=1}^{L-1}\Big(\hat c^{\dagger}_j \hat c_{j+1} + \hat c^{\dagger}_{j+1}\hat c_j\Big)
\;+\; V \sum_{j=1}^{L-1} \hat n_j\, \hat n_{j+1}
\;-\; \sum_{j=1}^{L} \mu_j\, \hat n_j ,
$$

with hopping amplitude $t$, nearest-neighbor repulsion $V$, and a (possibly site-dependent) chemical potential $\mu_j$. The model is integrable: via the [Jordan–Wigner transformation](https://doi.org/10.1007/BF01331938) it is equivalent to the XXZ chain solved exactly by [Yang and Yang](https://doi.org/10.1103/PhysRev.150.321), and its critical phase is the standard lattice realization of the [Luttinger liquid](https://doi.org/10.1088/0022-3719/14/19/010).

The dictionary from the [Introduction](../dmrg07), applied to an open chain bond by bond, reads:

$$
t = \frac{J}{2}, \qquad V = J\Delta,
$$

$$
J\Delta\sum_{j}\Big(\hat n_j - \tfrac12\Big)\Big(\hat n_{j+1} - \tfrac12\Big)
= V\sum_{j} \hat n_j \hat n_{j+1} - \frac{V}{2}\sum_{j} z_j\, \hat n_j + \frac{V(L-1)}{4},
$$

where $z_j$ is the coordination number of site $j$ ($z=2$ in the bulk, $z=1$ at the two ends). The XXZ chain therefore equals the $t$–$V$ model with the site-dependent chemical potential $\mu_j = \tfrac{V}{2} z_j$, up to the constant $V(L-1)/4$ — a bookkeeping detail that we will exploit below to benchmark against [DMRG-03](../../dmrg03).

### Running fermions in the boson basis

{{< callout type="info" >}}
On an open chain, all Jordan–Wigner strings cancel in nearest-neighbor terms, so the fermionic $t$–$V$ chain, the XXZ spin chain, and the **hardcore-boson** $t$–$V$ chain have *identical* energy spectra, sector by sector in the particle number $N$. The ALPS model library defines `hardcore boson` with exactly the same parameters (`t`, `V`, `mu#`) and the same conserved quantum number `N` as `spinless fermions`, so every parameter file below sets `MODEL="hardcore boson"`. This is not just a convenience: the classic `dmrg` application does not treat the fermionic sign bookkeeping of `MODEL="spinless fermions"` reliably. [DMRG-10](../dmrg10) makes the case in full, with the energies and convergence of the two models side by side.
{{< /callout >}}

## Choice of method

At half filling the relevant Hilbert-space sector has dimension:

$$
\dim \mathcal{H}_{N=L/2} = \binom{L}{L/2} \;\xrightarrow{\;L=32\;}\; \binom{32}{16} \approx 6.0\times 10^{8},
$$

far beyond the reach of full or sparse diagonalization. DMRG is the method of choice for one-dimensional ground states: each of the runs below (a 32-site chain with up to $D=100$ kept states and 4 sweeps) completes in well under a minute on a laptop, while converging $E_0$ to ten or more significant digits.

## Free fermions ($V=0$)

At $V=0$ the model is a free-fermion band $\varepsilon(k) = -2t\cos k$. For an *open* chain the single-particle eigenstates are standing waves with energies:

$$
\varepsilon_n = -2t\,\cos\!\left(\frac{n\pi}{L+1}\right), \qquad n = 1,\dots,L ,
$$

so the exact ground state energy at filling $N$ is the sum of the $N$ lowest $\varepsilon_n$. For $L=32$, $N=16$ (half filling):

$$
E_0^{\text{exact}} = \sum_{n=1}^{16} \varepsilon_n = -20.0163879005\, t .
$$

This gives us a rare luxury: an interacting-code benchmark with an exact finite-size reference value.

### Parameters

| Parameter | Meaning | Value |
|---|---|---|
| `LATTICE` | built-in open chain, no lattice file required (see the [ALPS lattice library](../../../../documentation/intro/latticehowtos)) | `open chain lattice` |
| `MODEL` | hardcore-boson $t$–$V$ model, Jordan–Wigner equivalent of the spinless-fermion chain | `hardcore boson` |
| `CONSERVED_QUANTUMNUMBERS` | quantum number held fixed, used to block-diagonalize $H$ | `N` |
| `N_total` | particle-number sector targeted (half filling) | 16 |
| `t` | nearest-neighbor hopping amplitude | 1 |
| `V` | nearest-neighbor repulsion | 0 |
| `L` | chain length | 32 |
| `SWEEPS` | number of DMRG finite-size sweeps | 4 |
| `NUMBER_EIGENVALUES` | eigenstates requested | 1 |
| `MAXSTATES` | bond dimension $D$ kept after truncation | 100 (single run); 20, 40, 60 (multiple runs) |

Note the one structural difference from the spin tutorials: the conserved quantum number is the particle number `N` alone, and the sector is selected with `N_total` rather than `Sz_total` — the fermionic side of the dictionary $S^z_{\text{tot}} = N - L/2$ from the [Introduction](../dmrg07). Half filling $N_{\text{total}} = 16$ corresponds to the $S^z_{\text{tot}}=0$ sector used in [DMRG-03](../../dmrg03).

### Lattice

The built-in `open chain lattice` from the [ALPS lattice library](../../../../documentation/intro/latticehowtos) is all we need: every site is equivalent ($\mu_j = 0$), and every bond carries the same hopping $t$:

```
      t       t       t                   t       t
  o-------o-------o-------o  . . .  o-------o-------o
  1       2       3       4         30      31      32

  every bond:  hopping t, interaction V=0
  every site:  chemical potential mu=0
```

Open boundary conditions are the natural choice for DMRG (see [DMRG-01](../../dmrg01)) and have the added benefit here that the Jordan–Wigner mapping is exact, with no boundary parity factor (see the boundary caveat in the [Introduction](../dmrg07)).

### Parameter files

The single-run parameter file `spinless_free`:

```python
LATTICE="open chain lattice"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=1
V=0
SWEEPS=4
NUMBER_EIGENVALUES=1
L=32
{MAXSTATES=100}
```

and the multiple-run file `spinless_free_multiple`, which studies the convergence with the number of kept states:

```python
LATTICE="open chain lattice"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=1
V=0
SWEEPS=4
NUMBER_EIGENVALUES=1
L=32
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

### Running the simulation

With the ALPS binaries on your `PATH`, convert the parameter files to XML and run the `dmrg` application:

```bash
parameter2xml spinless_free
dmrg --write-xml spinless_free.in.xml

parameter2xml spinless_free_multiple
dmrg --write-xml spinless_free_multiple.in.xml
```

The first pair of commands produces `spinless_free.task1.out.xml`; the second produces three output files `spinless_free_multiple.task#.out.xml`, one per `MAXSTATES` value.

## Interacting fermions at the Heisenberg point ($V=2t$)

We now switch on the interaction and choose $t=\tfrac12$, $V=1$, i.e. $J = 2t = 1$ and $\Delta = V/J = 1$: the isotropic Heisenberg chain of [DMRG-03](../../dmrg03) in fermion language. To make the correspondence *exact* rather than only asymptotic, we must include the site-dependent chemical potential $\mu_j = \tfrac{V}{2} z_j$ derived above: $\mu = V$ on bulk sites but $\mu = V/2$ on the two end sites, which have only one neighbor. The predicted ground state energy is then:

$$
E_0^{tV} \;=\; E_0^{\text{Heis}}(L=32) - \frac{V(L-1)}{4}
\;=\; -13.9973156 - \frac{31}{4} \;=\; -21.7473156 ,
$$

using the $L=32$ Heisenberg energy computed in [DMRG-03](../../dmrg03).

### Parameters

| Parameter | Meaning | Value |
|---|---|---|
| `LATTICE_LIBRARY` | custom lattice file (shown below) | `my_lattice.xml` |
| `LATTICE` | open chain whose two end vertices carry a separate type | `open chain lattice with special edges` |
| `MODEL` | hardcore-boson $t$–$V$ model, Jordan–Wigner equivalent of the spinless-fermion chain | `hardcore boson` |
| `CONSERVED_QUANTUMNUMBERS` | quantum number held fixed | `N` |
| `N_total` | particle-number sector targeted (half filling) | 16 |
| `t` | nearest-neighbor hopping amplitude ($J/2$) | 0.5 |
| `V` | nearest-neighbor repulsion ($J\Delta$) | 1 |
| `mu0` | chemical potential on the two end sites ($Vz/2$ with $z=1$) | 0.5 |
| `mu1` | chemical potential on bulk sites ($Vz/2$ with $z=2$) | 1 |
| `SWEEPS` | number of DMRG finite-size sweeps | 4 |
| `NUMBER_EIGENVALUES` | eigenstates requested | 1 |
| `MAXSTATES` | bond dimension $D$ kept after truncation | 100 (single run); 20, 40, 60 (multiple runs) |

### Lattice

The built-in open chain gives every vertex the same type, hence the same chemical potential. To give the two end sites their own $\mu$ we reuse the trick of the spin-1 chain in [DMRG-03](../../dmrg03): a custom lattice in which the end vertices have type 0 and the bulk vertices type 1. The ALPS model library then exposes the per-type parameters `mu0` and `mu1`:

```
   t,V     t,V     t,V                 t,V     t,V
  o-------o-------o------  . . .  ------o-------o
  1       2       3                     31      32

  site 1, 32   (type 0):  mu0 = V/2   (z = 1, one neighbor)
  sites 2..31  (type 1):  mu1 = V     (z = 2, two neighbors)
  every bond   (type 0):  hopping t, interaction V
```

The same site-graph logic as in [DMRG-03](../../dmrg03) applies, only the *reason* differs: there the special edges carried a different spin, here they carry a different chemical potential. The full lattice file `my_lattice.xml` (abridged — the pattern of the omitted vertices and edges is evident):

```python
<LATTICES>
<GRAPH name = "open chain lattice with special edges" dimension="1" vertices="32" edges="31">
<VERTEX id="1" type="0"><COORDINATE>1</COORDINATE></VERTEX>
<VERTEX id="2" type="1"><COORDINATE>2</COORDINATE></VERTEX>
<VERTEX id="3" type="1"><COORDINATE>3</COORDINATE></VERTEX>
<!-- ... vertices 4 to 30, all type="1" ... -->
<VERTEX id="31" type="1"><COORDINATE>31</COORDINATE></VERTEX>
<VERTEX id="32" type="0"><COORDINATE>32</COORDINATE></VERTEX>
<EDGE source="1" target="2" id="1" type="0" vector="1"/>
<EDGE source="2" target="3" id="2" type="0" vector="1"/>
<!-- ... edges 3 to 30 ... -->
<EDGE source="31" target="32" id="31" type="0" vector="1"/>
</GRAPH>
</LATTICES>
```

It can be generated for any $L$ with a few lines of Python:

```python
L = 32
print('<LATTICES>')
print(f'<GRAPH name = "open chain lattice with special edges" dimension="1" vertices="{L}" edges="{L-1}">')
for i in range(1, L+1):
    vtype = 0 if i in (1, L) else 1
    print(f'<VERTEX id="{i}" type="{vtype}"><COORDINATE>{i}</COORDINATE></VERTEX>')
for i in range(1, L):
    print(f'<EDGE source="{i}" target="{i+1}" id="{i}" type="0" vector="1"/>')
print('</GRAPH>')
print('</LATTICES>')
```

### Parameter files

The single-run parameter file `spinless_tV`:

```python
LATTICE_LIBRARY="my_lattice.xml"
LATTICE="open chain lattice with special edges"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=0.5
V=1
mu0=0.5
mu1=1
SWEEPS=4
NUMBER_EIGENVALUES=1
{MAXSTATES=100}
```

and the multiple-run file `spinless_tV_multiple`:

```python
LATTICE_LIBRARY="my_lattice.xml"
LATTICE="open chain lattice with special edges"
MODEL="hardcore boson"
CONSERVED_QUANTUMNUMBERS="N"
N_total=16
t=0.5
V=1
mu0=0.5
mu1=1
SWEEPS=4
NUMBER_EIGENVALUES=1
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

### Running the simulation

```bash
parameter2xml spinless_tV
dmrg --write-xml spinless_tV.in.xml

parameter2xml spinless_tV_multiple
dmrg --write-xml spinless_tV_multiple.in.xml
```

## Evaluating the results

The following Python script (run it with `alpspython`) loads the converged eigenstate measurements of all runs and the iteration history of the two single runs, prints the energies and truncation errors, and plots the convergence:

```python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

# converged measurements of all runs
for prefix in ['spinless_free', 'spinless_free_multiple',
               'spinless_tV', 'spinless_tV_multiple']:
    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
    for run in data:
        print(prefix, '| MAXSTATES =', run[0].props['MAXSTATES'])
        for s in run:
            print('   ', s.props['observable'], ':', s.y[0])

# iteration history of the two single runs
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='spinless_free'),
                          what=['Iteration Energy','Iteration Truncation Error'])

plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('Iteration history of ground state energy (V=0)')
plt.ylabel('$E_0$')
plt.xlabel('iteration')
plt.show()
```

### Free fermions

| `MAXSTATES` $D$ | Truncation error $\epsilon$ | $E_0/t$ | $E_0 - E_0^{\text{exact}}$ |
|---|---|---|---|
| 20 | $5.2\times10^{-7}$ | $-20.0163691706$ | $1.9\times10^{-5}$ |
| 40 | $1.7\times10^{-9}$ | $-20.0163878550$ | $4.6\times10^{-8}$ |
| 60 | $1.3\times10^{-11}$ | $-20.0163879001$ | $4.1\times10^{-10}$ |
| 100 | $3.2\times10^{-14}$ | $-20.0163879005$ | $1.4\times10^{-12}$ |

At $D=100$ the DMRG energy $E_0 = -20.0163879005\,t$ reproduces the exact free-fermion value $-20.0163879005\,t$ to twelve digits — from a many-body code that has no knowledge that the model is free. The iteration history shows the familiar pattern from [DMRG-03](../../dmrg03): the energy drops steeply during the infinite-system warmup and settles onto its converged value within the first sweep:

![](/figs/dmrg/dmrg07_free_energy_iteration.png)

### Interacting fermions at $V=2t$

| `MAXSTATES` $D$ | Truncation error $\epsilon$ | $E_0$ | $E_0(D) - E_0(D{=}100)$ |
|---|---|---|---|
| 20 | $1.6\times10^{-7}$ | $-21.7473088794$ | $6.7\times10^{-6}$ |
| 40 | $5.7\times10^{-10}$ | $-21.7473155951$ | $2.3\times10^{-8}$ |
| 60 | $1.3\times10^{-11}$ | $-21.7473156177$ | $4.9\times10^{-10}$ |
| 100 | $4.4\times10^{-14}$ | $-21.7473156182$ | — |

The $D=100$ result $E_0 = -21.7473156$ agrees with the Jordan–Wigner prediction $E_0^{\text{Heis}} - V(L-1)/4 = -21.7473156$ to every digit of the [DMRG-03](../../dmrg03) reference energy — a direct numerical verification of the operator dictionary derived in the [Introduction](../dmrg07):

![](/figs/dmrg/dmrg07_tV_energy_iteration.png)

In both cases the energy error is, to a good approximation, *proportional to the truncation error* — the standard rule of thumb used for $D\to\infty$ extrapolations, which the multiple runs let us check quantitatively:

![](/figs/dmrg/dmrg07_energy_vs_truncation.png)

## Summary

DMRG in the particle-number-conserving basis converges the ground state energy of the half-filled spinless-fermion chain essentially to machine precision with $D=100$ states at $L=32$: the free point reproduces the exact standing-wave energy $-20.0163879005\,t$ to twelve digits, and the interacting point $V=2t$ reproduces the [DMRG-03](../../dmrg03) Heisenberg energy through the Jordan–Wigner shift $-V(L-1)/4$ to all reported digits, with the energy error scaling linearly in the truncation error in both cases.

## Questions

1. Fit $E_0(D)$ against the truncation error $\epsilon(D)$ and extrapolate to $\epsilon \to 0$. How close is the extrapolated free-fermion energy to the exact value, compared to the raw $D=20$ result?
2. Move away from half filling by setting `N_total=8` (quarter filling). The free-fermion benchmark $E_0 = \sum_{n=1}^{8}\varepsilon_n$ is still exact — does the DMRG convergence in $D$ get easier or harder, and why?
3. Scan the interaction across the critical point: keep $t=\tfrac12$ and compute $E_0(V)$ for $V = 0.5, 1, 1.5, 2, 3$. Beyond $V=2t$ ($\Delta>1$) the half-filled chain develops charge order — can you detect the transition in the convergence behavior or in the local densities?
4. Verify the Jordan–Wigner equivalence end to end on a small chain: run `sparsediag` with `MODEL="spinless fermions"` and with `MODEL="hardcore boson"` for $L=8$, $N_{\text{total}}=4$, and confirm that the spectra coincide sector by sector.
5. Repeat the $V=2t$ run *without* the special-edge chemical potentials (built-in `open chain lattice`, uniform `mu=1`). The result no longer matches the Heisenberg prediction — which term in the bond-by-bond bookkeeping of $V(\hat n_j-\tfrac12)(\hat n_{j+1}-\tfrac12)$ is responsible for the difference?
