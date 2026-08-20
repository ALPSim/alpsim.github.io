---
title: Energy Gap of a Spin-1 Chain
description: "Jupyter md file for dmrg energy gap of spin-one chain"
toc: true
math: true
weight: 24
cascade:
    type: docs
---

In this tutorial, we will calculate the energy gap of a 64-site spin-1 chain using DMRG simulations. We will see a different gap behavior than the spin-1/2 chain. Here the energy gap for a spin-1 chain between the ground state and the first excited state is finite. We will also see that the lowest states form a nearly-degenerate group, therefore, requiring the calculation to keep more lowest-energy states in order to identify the energy gap correctly.

The reason is that this is an **open** chain (`open chain lattice`). An open spin-1 Haldane chain carries an effective $S=1/2$ degree of freedom localized at each of its two ends. Those two edge spins combine into a singlet ($S=0$) plus a triplet ($S=1$) — a manifold of **four** states, split from each other only by an exponentially small amount that vanishes as the chain grows. This edge manifold sits below the bulk Haldane gap, so the energy difference to look at is the gap from the manifold up to the first bulk excitation, not the splitting inside it.

Because the simulations below conserve $S_z$, a run restricted to `Sz_total = 0` only sees two members of that four-state manifold (the singlet, and the $S_z=0$ component of the triplet). That is why Method 1 below shows two near-degenerate lowest levels rather than four.

Similar to the spin-1/2 case, the calculation can be carried out in two ways. The first method is through the direct calculation of 4 lowest energy states in the same DMRG run. We will see the two near-degenerate lowest levels visible in the `Sz_total = 0` sector and the energy gap from them up to the first bulk excitation. The second method is through the calculation of ground state energies in different total spin sectors, i.e., the total magnetization 0, 1, and 2. We will find that the ground state eneries for the magnetization 0 and 1 are identical within error bounds, and that the energy gap can be calculated by the ground state energy difference between magnetization 1 and 2 sectors. 

This is the Heisenberg exchange model (see [W. Heisenberg, Zeitschrift für Physik 49, 619-636 (1928)](https://doi.org/10.1007/BF01328601)) with spin-1 sites instead of spin-1/2. The predicted finite gap in the integer-spin case is the Haldane gap, from [F.D.M. Haldane, Physics Letters A 93, 464-468 (1983)](https://doi.org/10.1016/0375-9601(83)90631-X).

### Parameters

| Parameter | Meaning | Value |
|---|---|---|
| `LATTICE` | lattice used for the chain | `open chain lattice` |
| `MODEL` | Hamiltonian family | `spin` |
| `local_S` | spin quantum number per site | `1` |
| `CONSERVED_QUANTUMNUMBERS` | quantum numbers fixed in the basis | `Sz` (Method 1), `N,Sz` (Method 2) |
| `Sz_total` | total magnetization sector | `0` (Method 1); `0`, `1`, `2` (Method 2) |
| `J` | Heisenberg exchange coupling | `1` |
| `SWEEPS` | number of DMRG sweeps | `5` |
| `L` | chain length | `64` |
| `MAXSTATES` | number of DMRG basis states kept | `300` |
| `NUMBER_EIGENVALUES` | number of low-lying eigenstates kept | `4` (Method 1), `1` (Method 2) |

### Lattice

```
   J     J     J             J
o-----o-----o-----o-- ... --o     (64 sites, spin-1 each, open boundary conditions)
```

Same `open chain lattice` as the spin-1/2 case, but with `local_S=1` and double the length (`L=64`), since a longer chain is needed to resolve the finite Haldane gap cleanly from finite-size corrections. See the [ALPS lattice library](../../../documentation/intro/latticehowtos) for other built-in lattices.

### Method Choice

For spin-1, the local Hilbert space is 3-dimensional, so the untruncated space of a 64-site chain is $3^{64}\approx3.4\times10^{30}$ — far beyond exact diagonalization. DMRG's `MAXSTATES=300` keeps this tractable; more states are kept here than in the spin-1/2 tutorial because resolving the near-degenerate edge manifold (see above) requires higher accuracy.

## Method 1: Direct Calculation of 4 Lowest Energies

We first load the necessary libraries and prepare the input parameters.


```python
import pyalps
import numpy as np

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 4
       } ]

```

Note that `local_S = 1`, which gives us the spin-1 system. The `NUMBER_EIGENVALUES = 4` will produce the lowest 4 energies from the DMRG simulations. To ensure enough accuracy, we have also set the number of sweeps `SWEEPS = 5` and the truncation of the number of states `NUMBER_EIGENVALUES = 300`. 

We then write the input file and run the simulation.


```python
input_file = pyalps.writeInputFiles('parm_spin_one_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

We finally load the measurements and print the results.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_gap'))

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
print('\nGap:', abs(energies[1]-energies[0]), abs(energies[2]-energies[1]))
```

From the simulation, do you see the ground-state degeneracy and a finite energy gap to the first excited state?

Running the code above gives the four lowest energies $E_0,E_1,E_2,E_3 = -88.48667, -88.48666, -88.05889, -88.05629$: the two lowest states are degenerate to within $3\times10^{-7}$ — these are the two members of the edge manifold visible in this $S_z=0$ sector — and the gap up to the first bulk excitation is $E_2-E_1\approx0.4278$.

## Method 2: Using Quantum Numbers

We first restrict the simulations in the magnetization `Sz_total = 0` and `Sz_total = 1` sectors. The ground state energy difference between the two sectors is then extracted, which shows that they are degenerate. We then repeat the calculation with `Sz_total = 1` and `Sz_total = 2`. The results are used to extract the energy gap. 

We first load the libraries and prepare the input parameters.


```python
import pyalps
import numpy as np

#prepare the input parameters
parms = []
sz_tot = [0,1]
for sz in sz_tot:
    parms.append( {
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 1
       } )
```

The magnetization is drawn from the list of values in `sz_tot = [0,1]`. It is then assigned to the magnetization `Sz_total` in the input parameter list. Note that only 1 lowest energy state is calculated, i.e., `NUMBER_EIGENVALUES = 1`. 

The input files are written and the calculations are carried out by the following APIs.


```python
input_file = pyalps.writeInputFiles('parm_spin_one_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

We then load the measurements and print the results.


```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[sz_tot[1]]-energies[sz_tot[0]])
```

Do you see the degenerate ground states from the two magnetization sectors?

Running the code above for `sz_tot=[0,1]` gives $E(S_z=0)=-88.48667$ and $E(S_z=1)=-88.48666$ — a gap of only $9\times10^{-6}$, confirming the two sectors are degenerate within DMRG accuracy.

Next, we change the list of magnetizations to `sz_tot = [1,2]` and repeat the simulation. For convenience, we copy the above codes in the following. The only change is the magnetization list. 


```python
import pyalps
import numpy as np

parms = []
sz_tot = [1,2]
for sz in sz_tot:
    parms.append( {
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'local_S'                   : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : sz,
        'J'                         : 1,
        'SWEEPS'                    : 5,
        'L'                         : 64,
        'MAXSTATES'                 : 300,
        'NUMBER_EIGENVALUES'        : 1
       } )


input_file = pyalps.writeInputFiles('parm_spin_one_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)

data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_triplet'))

energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]

print('Gap:', energies[sz_tot[1]]-energies[sz_tot[0]])
```

Can you now correctly extract the energy gap for a 64-site spin-1 chain? Do you see agreement with the result from Method 1?

Running the code above for `sz_tot=[1,2]` gives a gap of $0.42755$, in close agreement with the $0.4278$ found by Method 1 (small differences come from the two methods using independent DMRG runs with slightly different truncation).

### Results

Summary of both methods for the 64-site spin-1 chain:

| Method | Quantity | Value |
|---|---|---|
| 1 | $E_0-E_1$ (ground-state degeneracy splitting) | $3\times10^{-7}$ |
| 1 | $E_2-E_1$ (excitation gap) | 0.4278 |
| 2 | $E(S_z{=}1)-E(S_z{=}0)$ (degeneracy check) | $9\times10^{-6}$ |
| 2 | $E(S_z{=}2)-E(S_z{=}1)$ (excitation gap) | 0.4276 |

Both methods agree on a finite-size gap of $\Delta/J\approx0.4276$–$0.4278$ at $L=64$, consistent with the thermodynamic-limit Haldane gap $\Delta/J\approx0.4105$ found in the "Spin Gap of a Spin-1 Heisenberg Chain" exact-diagonalization tutorial.

### Summary and Outlook

Unlike the gapless spin-1/2 chain, the open spin-1 Heisenberg chain has a nearly-degenerate four-state edge manifold and a finite bulk excitation gap even at $L=64$ — direct DMRG confirmation of Haldane's prediction for integer-spin chains.

1. The edge manifold has four states, but a `Sz_total = 0` run shows only two. Which two, and where do the other two live?
2. How close is the $L=64$ gap here to the true thermodynamic-limit Haldane gap, and what does that tell you about finite-size corrections at this length?
3. Try `local_S=3/2`: is the ground state gapped or gapless, and how does this depend on whether the spin is integer or half-integer?
