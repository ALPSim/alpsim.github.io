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

The calculation can be done by two methods. The first method is through the direct calculation of both the ground state and the first excited state energies in the same DMRG simulation. The difference of the two energies gives the energy gap. The second method is through the calculation of two ground state energy in two spin sectors: singlet and triplet spin sectors, by fixing the total spin magnetization to either 0 or 1. 

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
