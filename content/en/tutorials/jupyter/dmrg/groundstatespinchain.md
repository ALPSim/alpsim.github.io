---
title: Ground State Energy of a Spin Chain
description: "Jupyter md file for dmrg energy of spin chain"
toc: true
math: true
weight: 21
cascade:
    type: docs
---

In this example, we will use Density Matrix Renormalization Group (DMRG) simulations to study the ground state energy of a 32-site spin-half Heisenberg chain with open boundary conditions. We will look at the convergence of the ground state energy as well as the decay of the truncation errors as functions of the iteration numbers.

The Hamiltonian is the antiferromagnetic Heisenberg exchange model, first introduced by [W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601):
$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j, \qquad J>0.
$$
DMRG itself was introduced by [S.R. White, Physical Review Letters 69, 2863-2866 (1992)](https://doi.org/10.1103/PhysRevLett.69.2863).

### Parameters

| Parameter | Meaning | Value |
|---|---|---|
| `LATTICE` | lattice used for the chain | `open chain lattice` |
| `MODEL` | Hamiltonian family | `spin` |
| `CONSERVED_QUANTUMNUMBERS` | quantum numbers fixed in the basis | `N,Sz` |
| `Sz_total` | total magnetization sector | `0` |
| `J` | Heisenberg exchange coupling | `1` |
| `SWEEPS` | number of DMRG sweeps | `4` |
| `NUMBER_EIGENVALUES` | number of low-lying eigenstates kept | `1` |
| `L` | chain length | `32` |
| `MAXSTATES` | number of DMRG basis states kept | `100` |

### Lattice

```
   J     J     J             J
o-----o-----o-----o-- ... --o     (32 sites, open boundary conditions)
```

An `open chain lattice` of 32 sites — the standard, simplest test case for verifying that a new DMRG setup converges correctly before using it for more elaborate calculations. See the [ALPS lattice library](../../../documentation/intro/latticehowtos) for other built-in lattices.

### Method Choice

The full Hilbert space is $2^{32}\approx4.3\times10^9$, well beyond exact diagonalization. DMRG with `MAXSTATES=100` finds the ground state variationally in a handful of sweeps, and — unlike ED — also gives direct access to the sweep-by-sweep convergence history examined below.

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'L'                         : 32,
        'MAXSTATES'                 : 100
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

Next, we load the properties of the ground state measured by the DMRG code


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))
```

and print them to the terminal.


```python
for s in data[0]:
    print(s.props['observable'], ' : ', s.y[0])
```

Additionally, we can load detailed data for each iteration step.


```python
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                          what=['Iteration Energy','Iteration Truncation Error'])
```

The above allows us to look at how the DMRG algorithm converged to the final results.

We finally plot the convergence of the ground state energy and the truncation error as functions of iterations.


```python
plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('Iteration history of ground state energy (S=1/2)')
plt.ylim(-15,0)
plt.ylabel('$E_0$')
plt.xlabel('iteration')

plt.figure()
pyalps.plot.plot(iter[0][1])
plt.title('Iteration history of truncation error (S=1/2)')
plt.yscale('log')
plt.ylabel('error')
plt.xlabel('iteration')

plt.show()
```

The convergence of the ground state energy as a function of iteration numbers is shown in the following figure.
![Ground State Energy](/figs/dmrg/dmrg_energy.png)

We can also take a look at the decay of the truncation error as the iteration number increases.
![Truncation Error](/figs/dmrg/dmrg_truncation.png)

### Results

Running the code above gives a converged ground-state energy of

$$E_0 = -13.997316$$

with a final truncation error of $4.4\times10^{-14}$ — negligible, confirming that `MAXSTATES=100` is more than sufficient for this chain length.

### Summary and Outlook

DMRG converges the ground-state energy of the 32-site spin-1/2 Heisenberg chain to $E_0=-13.9973$ within a handful of sweeps, with a truncation error many orders of magnitude below the energy scale of the problem.

1. How many sweeps are actually needed for the energy to stop changing at the 6th decimal place?
2. How does the converged $E_0/L$ compare to the exact thermodynamic-limit value $-\ln2+1/4\approx-0.4431$ per site?
3. What happens to the truncation error if `MAXSTATES` is reduced to 20?
