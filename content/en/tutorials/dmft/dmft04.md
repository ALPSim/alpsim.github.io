
---
title: DMFT-04 Mott
math: true
toc: true
---

## Mott Transition

Mott transitions are metal insulator transitions (MIT) that occur in many materials, e.g. transition metal compounds, as a function of pressure or doping. The review by Imada et al. gives an excellent introduction to the subject and mentions $V_2O_3$ and the organics as typical examples.

MIT are easily investigated by DMFT as the relevant physics is essentially local (or k-independent): At half filling the MIT can be modeled by a self energy with a pole at $\omega=0$ which splits the noninteracting band into an upper and a lower Hubbard band. In this context it is instructive to suppress antiferromagnetic long range order and enforce a paramagnetic solution in the DMFT simulation, to mimic the paramagnetic insulating phase. For this the up and down spin of the Green's functions are symmetrized (parameter `SYMMETRIZATION = 1;`).

In order to run the simulations in python use [`tutorial4a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4a.py):

```    
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

#prepare the input parameters
parms=[]
for u in [4.,5.,6.,8.]: 
    parms.append(
            { 
              'ANTIFERROMAGNET'         : 0,
              'CHECKPOINT'              : 'solverdump_U_'+str(u),
              'CONVERGED'               : 0.001,
              'FLAVORS'                 : 2,
              'H'                       : 0,
              'H_INIT'                  : 0.,
              'MAX_IT'                  : 20,
              'MAX_TIME'                : 600,
              'MU'                      : 0,
              'N'                       : 500,
              'NMATSUBARA'              : 500, 
              'N_MEAS'                  : 1000,
              'N_ORDER'                 : 50,
              'OMEGA_LOOP'              : 1,
              'SEED'                    : 0, 
              'SITES'                   : 1,              
              'SOLVER'                  : 'hybridization',
              'SC_WRITE_DELTA'          : 1,
              'SYMMETRIZATION'          : 1,
              't'                       : 1,
              'SWEEPS'                  : 1500*u,
              'BETA'                    : 20.0,
              'THERMALIZATION'          : 500,
              'U'                       : u
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_u_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)
```

We investigate the Mott transition in single-site DMFT, as a function of interaction at fixed temperature $\beta t=20$ (see e.g. Fig. 2 in [this paper](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)). Starting from a non-interacting solution we see in the imaginary time Green's function that the solution is metallic for $U/t \leq 4.5$, and insulating for $U/t\geq 5$. A coexistence region could be found by starting from an insulating (or atomic) solution and trying to convert it for smaller $U$.

Imaginary time Green's functions are not easy to interpret, and therefore many authors employ [analytic continuation methods](). There are however two clear features: the value at $\beta$ corresponds to $-n$, the negative value of the density (per spin). The second feature is that $-\beta G(\beta/2) \rightarrow \pi A(0)$ for decreasing temperature ($\beta\rightarrow\infty$); where $A(0)$ is the spectral function at the Fermi energy. From a temperature dependence of the imaginary time Green's function we can therefore immediately see if the system is metallic or insulating. In order to better inspect the behavior of the Green's function we will plot the data on a logarithmic scale:

```
listobs=['0']   # we look at only one flavor, as they are SYMMETRIZED
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_u_*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)

for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.y = -d.y
    d.props['label'] = r'$U=$'+str(d.props['U'])
plt.figure()
plt.yscale('log')
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-04: Mott-insulator transition for the Hubbard model on the Bethe lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

You should observe that at small $U$ you find metallic solution and an insulating solution at large $U$, at fixed $\beta$. The largest value of $U$ is deep within the insulating phase.

The convergence may be checked by [`tutorial4b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-04-mott/tutorial4b.py):

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


## Please run the tutorial4a.py before this one

listobs = ['0']   # we look at convergence of a single flavor (=0) 

## load all results
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_u_*.h5'), measurements=listobs, verbose=True)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['U','observable'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.y *= -1.
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$-G_{flavor=%8s}(\tau)$' % common_props['observable'])
    plt.title('DMFT-04: ' + r'$U = %.4s$' % common_props['U'])
    pyalps.plot.plot(sim)
    plt.legend()
    plt.yscale("log")

plt.show()
```

