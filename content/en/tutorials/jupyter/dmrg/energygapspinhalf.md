---
title: Energy Gap of a Spin-1/2 Chain
description: "Jupyter md file for dmrg energy gap of spin-half chain"
toc: true
math: true
weight: 22
cascade:
    type: docs
---

In this tutorial, we will calculate the energy gap of a 32-site spin-1/2 chain using DMRG simulations. The gap, as one knows, approaches 0 in the thermodynamic limit for a spin-1/2 chain. 

The Hamiltonian is the antiferromagnetic Heisenberg exchange model, first introduced by [W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601):
$$
H = J\sum_{\langle i,j \rangle} \mathbf{S}^i \cdot \mathbf{S}^j, \qquad J>0.
$$

The calculation can be done by two methods. The first method is through the direct calculation of both the ground state and the first excited state energies in the same DMRG simulation. The difference of the two energies gives the energy gap. The second method is through the calculation of two ground state energy in two spin sectors: singlet and triplet spin sectors, by fixing the total spin magnetization to either 0 or 1. 

### Parameters

| Parameter | Meaning | Value |
|---|---|---|
| `LATTICE` | lattice used for the chain | `open chain lattice` |
| `MODEL` | Hamiltonian family | `spin` |
| `CONSERVED_QUANTUMNUMBERS` | quantum numbers fixed in the basis | `Sz` (Method 1), `N,Sz` (Method 2) |
| `Sz_total` | total magnetization sector | `0` (Method 1); `0` and `1` (Method 2) |
| `J` | Heisenberg exchange coupling | `1` |
| `SWEEPS` | number of DMRG sweeps | `4` |
| `L` | chain length | `32` |
| `MAXSTATES` | number of DMRG basis states kept | `100` (Method 1), `40` (Method 2) |
| `NUMBER_EIGENVALUES` | number of low-lying eigenstates kept | `2` (Method 1), `1` (Method 2) |

### Lattice

The `open chain lattice` is a 1D open chain of `L=32` sites with Heisenberg exchange $J$ on every bond:

```
   J     J     J             J
o-----o-----o-----o-- ... --o     (32 sites, open boundary conditions)
```

An open (rather than periodic) chain is used because DMRG's accuracy for a fixed number of kept states `MAXSTATES` is best on open boundaries, which is standard practice for 1D DMRG. See the [ALPS lattice library](../../../documentation/intro/latticehowtos) for other built-in lattices.

### Method Choice

The full Hilbert space of a 32-site spin-1/2 chain is $2^{32}\approx4.3\times10^9$ states — far too large for exact diagonalization. DMRG truncates this to `MAXSTATES=100` variationally-optimal basis states per block, making the calculation tractable (a few seconds per run here) while keeping the truncation error negligible for this chain length.

### Method 1: Direct Calculation of Ground-state and Excited-state Energies

We first load the necessary libraries and prepare the input parameters.


```python
import pyalps
import numpy as np

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'L'                         : 32,
        'MAXSTATES'                 : 100,
        'NUMBER_EIGENVALUES'        : 2
       } ]

```

Note that the `NUMBER_EIGENVALUES = 2`, meaning the ground state and the first excited state energies will be kept in the simulation. 

We then write the input file and run the simulation. 


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

We finally load the measurements and print the results.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap'))

energies = np.empty(0)
for s in data[0]:
    if s.props['observable'] == 'Energy':
        energies = s.y
    else:
        print(s.props['observable'], ':', s.y[0])
energies.sort()
print('Energies:', end=' ')
for e in energies:
    print(e, end=' ')
print('\nGap:', abs(energies[1]-energies[0]))
```

### Method 2: Using Quantum Numbers

As we know, the ground state of a spin-1/2 chain exists in the spin-singlet sector. So, if we restrict the simulation in the magnetization `Sz_total = 0` sector, the lowest energy from the DMRG simulation will produce the spin-singlet ground state energy of the spin-1/2 chain. This is what we did in the previous simulation. If we restrict the simulation in the magnetization `Sz_total = 1` sector, the lowest energy from the DMRG simulation can only come from the spin-triplet state. Of course, the lowest energy from the `Sz_total = 1` sector will be the same as the first excited state energy from the `Sz_total = 0` sector, since without external magnetic fields, the 3 subsectors (`Sz_total = -1`, `Sz_total = 0`, and `Sz_total = 1`) of the triplet sector are degenerate.

We first load the libraries and prepare the input parameters.


```python
import pyalps
import numpy as np

parms = []
for sz in [0,1]:
    parms.append( { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'L'                         : 32,
        'MAXSTATES'                 : 40,
        'NUMBER_EIGENVALUES'        : 1
       } )
```

Notice that we now loop over `Sz_total = 0` and `Sz_total = 1`, which will produce two input parameter files for two DMRG simulations, as carried out in the following.


```python
input_file = pyalps.writeInputFiles('parm_spin_one_half_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

We then load the measurements and print the results.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[1]-energies[0])
```

Let us compare the energies and gap from both methods. Do they agree with each other?

### Results

Running the code above gives:

| Method | Energies | Gap |
|---|---|---|
| 1 (direct) | $E_0=-13.99732$, $E_1=-13.87958$ | 0.11774 |
| 2 (quantum numbers) | $E(S_z=0)=-13.99732$, $E(S_z=1)=-13.87958$ | 0.11774 |

The two methods agree to 5 significant figures, as expected since they compute the same physical gap two different ways.

### Summary and Outlook

For a 32-site open spin-1/2 chain, DMRG gives an excitation gap of $\Delta/J\approx0.1177$ — a finite-size value, not yet the (vanishing) thermodynamic-limit gap; see the companion "Extrapolation of Energy Gap" tutorial for how this gap closes as $L\to\infty$.

1. Why do the two methods above give exactly the same gap even though they solve different eigenvalue problems?
2. What do you expect to happen to this gap if you double the chain length to $L=64$?
3. How does the gap change if the number of kept states `MAXSTATES` is reduced to 20 — is 100 states already converged?
