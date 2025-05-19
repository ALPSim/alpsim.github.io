
---
title: DMRG-02 Gaps
math: true
toc: true
---

## Calculating The Gap

As already mentioned, the energy gap of a quantum system is given by the energy difference between the first excited state and the ground state

$$
\Delta = E_1 - E_0
$$

in the thermodynamic limit. This means we have to solve two problems, (i) the calculation of

$$
\Delta(L) = E_1 (L) - E_0 (L)
$$

for finite system sizes and (ii) the extrapolation of $\Delta (L)$ to the thermodynamic limit $L= \infty$. The latter is not specific to DMRG, but because of DMRG's preference for open boundary conditions it is somewhat more complicated than in the more usual case of periodic boundary conditions.

### Getting The Gap For Finite Systems

Obviously, we have to be able to get access to the first excited state and its energy. DMRG fundamentally knows two ways of doing this, a pedestrian way which always works, but is not as neat, and a smarter way, which is very clean, but does not work under all circumstances.

1. The pedestrian way is to set up a DMRG calculation that calculates both states at the same time. However, for a given number of states the accuracy will somewhat decrease, as two different quantum states both have to be described well.

2. The smarter way reduces the gap calculation to the calculation of two ground states. In many quantum systems, the ground state and the first excited state differ by a good quantum number and therefore are both ground states in the respective sectors. For example, for the spin-1/2 chain, the ground state is a singlet of total spin 0, and hence the ground state in the sector of magnetization 0. The first excited state is a triplet of total spin 1, i.e. consists of one excited state of magnetization 0, and the ground states of the sectors of magnetization +1 and -1, respectively. It can, therefore, be calculated as the ground state in magnetization sector +1.

Let us do this calculation first for the spin-1/2 chain:

#### Example: without quantum numbers

##### Using parameter files

In this example below, we include a line in the parameter file for the spin S=1/2 chain [`spin_one_half_gap`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_gap) to tell the code that we also want to calculate the energy for the first excited state. The algorithm will build a density matrix targeting two states: the ground-state, and the first excited state, both in the same subspace with Sz=0. Since the first excited state is a triplet, this will yield the singlet-triplet gap.

```python
LATTICE="open chain lattice"
MODEL="spin"
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=0
J=1
SWEEPS=4
{L=32, MAXSTATES=40
NUMBER_EIGENVALUES=2}
```
    
Notice that we only added the last line, specifying the number of eigenstates to calculate. By targeting both states, the algorithm ensures that both are represented accurately. However, this is not quite true if we keep only 100 states. Compare the energy for the ground-state obtained with the present parameter file, and the previous simulation targeting only the ground state.

It is important to notice that the entanglement entropy in this example is totally meaningless, since the algorithm is calculating a density matrix mixing two states.

##### Using Python

The script [`spin_one_half_gap.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_gap.py) runs the same simulation as the spin-1/2 script from the DMRG-01 tutorial, except for changing the requested NUMBER_EIGENVALUES to two, and loads all data for these eigenstates.

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
        'L'                         : 32,
        'MAXSTATES'                 : 100,
        'NUMBER_EIGENVALUES'        : 2
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half_gap',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)

data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_gap'))
```

While iterating over all measurements, we then extract the energies

```python
energies = np.empty(0)
for s in data[0]:
    if s.props['observable'] == 'Energy':
        energies = s.y
    else:
        print(s.props['observable'], ':', s.y[0])
```

and calculate the gap.

```python
energies.sort()
print('Energies:', end=' ')
for e in energies:
    print(e, end=' ')
print('\nGap:', abs(energies[1]-energies[0]))
```

#### Example: with quantum numbers

To calculate the singlet-triplet gap taking advantage of quantum number conservation we need to perform two independent simulations, one with Sz=0, and another one with Sz=1. The difference of the two energies will yield the gap.

##### Using parameter files

This means that we only need to change the value of Sz_total in the spin_one_half parameter file:

```python
LATTICE="open chain lattice"
MODEL="spin"
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=1
SWEEPS=4
J=1
{L=32, MAXSTATES=40}
```

You can download this file from here: [`spin_one_half_triplet`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_triplet).

##### Using Python

The script [`spin_one_half_triplet.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-02-gaps/spin_one_half_triplet.py) runs a simulation for both Sz sectors defined by two Python dictionaries with the parameters.

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

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
       
input_file = pyalps.writeInputFiles('parm_spin_one_half_triplet',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

After loading the results in the usual way we print the measurements for both sectors and save the ground state energy for each Sz value in a dictionary.

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half_triplet'))

# print results:
energies = {}
for run in data:
    print('S_z =', run[0].props['Sz_total'])
    for s in run:
        print('\t', s.props['observable'], ':', s.y[0])
        if s.props['observable'] == 'Energy':
            sz = s.props['Sz_total']
            energies[sz] = s.y[0]
```

Then, we can calculate the gap as the energy difference between the Sz=1 and Sz=0 sectors

```python
print 'Gap:', energies[1]-energies[0]
```

### Extrapolating The Gap To The Thermodynamic Limit

In a first attempt, fix $D=50,100,150$ and calculate the gap for lengths $L=32,64,96,128$. For fixed $D$, plot the gap versus $1/L$. What you should see is that for small $D$, the results will not lie on a straight line passing through 0, but they will curve up from it. This behaviour gets better when $D$ gets larger. Discuss why this might be.

In a second, more meaningful attempt, fix the lengths $L=32,64,96,128$ and vary $D=50,100,150,200$ in order to extrapolate the gap for each fixed length in $D$ (or, as explained above, the truncation error). What does the plot of the gap versus $1/L$ look like now?

Modify the file [`spin_one_half_multiple`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-01-dmrg/spin_one_half_multiple) to setup all the runs for Sz=0 and Sz=1, for different system sizes and different number of states. Use five sweeps, and extrapolate the value of the gap following the procedure outlined in the tutorial.


The case of the spin-1/2 chain is a bit frustrating, because all you will be able to say, even if you push the computer to its limits, is that the gap seems to be extremely small to the best of your abilities and therefore is likely to vanish. But who can tell you that you are not looking at a case where the gap is, say, $e^{-50}$? This of course is a sobering reminder of the limits of even a highly accurate numerical method.

Let us therefore turn to a more rewarding question, what is the gap of the spin-1 antiferromagnetic Heisenberg chain?

Here, there is a nasty twist, which we will only state and perform at the moment, but explain later: Calculate the gap not between the ground states of the magnetization sectors 0 and 1, but 1 and 2. If you wish, do it also for 0 and 1, for later reference, but the following refers to 1 and 2.

Assume you have $\Delta (L)$ with machine precision, either by a suitable extrapolation as discussed above or by a very high accuracy calculation. If you don't want to do the former, calculate the gap for system sizes $L=8,16,32,48,64,96,128,192,256$ with $D=300$ states each and 5 sweeps.

As the effects of the open ends will decrease as $1/L$, it always makes sense to first plot the gaps $\Delta (L)$ versus $1/L$, as was already done in the spin-1/2 case. Produce such a plot.

What you see is a curve that is quite straight for small L and then starts bending upward. What gap would you obtain if you extrapolate the linear part of the curve naively? (This question is relevant for situations where the correlation length of the chain is so long that it becomes hard to see the asymptotic behaviour on reachable length scales.) Is it over- or underestimated?

What gap do you read off if you take the longest chain you have? Is it over- or underestimated?

The ideal would be to have an idea of what the asymptotic behaviour (the curved part for long lengths) is like analytically to extrapolate. Do a plot of the gap as $\Delta (L)$ versus $1/L^2$. What does the curve now look like for big lengths? Extrapolate the gap.

The last plot was in fact motivated by the following argument: from Haldane's analysis of the spin-1 chain by the nonlinear sigma model, one expects that the lowest lying excitations (which for periodic boundary conditions can be labeled by a momentum $k$) are around $k=\pi$ and have an energy

$$
E(k) = E_0 + \sqrt{\Delta^2 + c^2 (k-\pi)^2}.
$$

For the open boundary conditions, we may approximate $k-\pi$ by $1/L$ (think about a particle in a box), which gives a finite-system size gap of

$$
\Delta(L) \approx \Delta \left( 1 + \frac{c^2}{2\Delta^2 L^2} \right) 
$$

and indicates that in the asymptotic limit the convergence should essentially be as $1/L^2$. How close do you get to the result $\Delta/J=0.41052$?

For those that also did the gap between the ground states of magnetisation sectors 0 and 1, show that the gap you get there is essentially zero. All others, take this result for granted and start worrying: why is the finite gap the right one and the vanishing gap the wrong one? Is this a physics lottery? In fact, there is a very good reason why the spin-1 chain shows this peculiar behaviour for open boundary conditions that can be found analytically; but even if we were not so fortunate as to know it, we could detect the problem right away! This can be done by the observation of local observables.
