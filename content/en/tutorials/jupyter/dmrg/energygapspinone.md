---
title: Energy Gap of a Spin-1 Chain
description: "Jupyter md file for dmrg energy gap of spin-one chain"
toc: true
math: true
weight: 24
cascade:
    type: docs
---

In this tutorial, we will calculate the energy gap of a 64-site spin-1 chain using DMRG simulations. We will see a different gap behavior than the spin-1/2 chain. Here the energy gap for a spin-1 chain between the ground state and the first excited state is finite. We will also see that the ground state is 2-fold degenerate, therefore, requiring the calculation to keep more lowest-energy states in order to identify the energy gap correctly. 

Similar to the spin-1/2 case, the calculation can be carried out in two ways. The first method is through the direct calculation of 4 lowest energy states in the same DMRG run. We will see the 2-fold degeneracy of the ground state and the energy gap between the ground state and the first excited state. The second method is through the calculation of ground state energies in different total spin sectors, i.e., the total magnetization 0, 1, and 2. We will find that the ground state eneries for the magnetization 0 and 1 are identical within error bounds, and that the energy gap can be calculated by the ground state energy difference between magnetization 1 and 2 sectors. 

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
