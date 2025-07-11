
---
title: DMFT-05 OSMT
math: true
toc: true
---

## Orbitally Selective Mott Transition

An interesting phenomenon in multi-orbital models is the orbitally selective Mott transition, first examined by [Anisimov et al.]() A variant of this, a *momentum-selective* Mott transition, has recently been discussed in [cluster calculations](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.045120) as a cluster representation of pseudogap physics.

In an orbitally selective Mott transition some of the orbitals involved become Mott insulating as a function of doping or interactions, while others stay metallic.

As a minimal model we consider two bands: a wide band and a narrow band. In addition to the intra-orbital Coulomb repulsion $U$ we consider interactions $U'$, and $J$, with $U' = U-2J$. We limit ourselves to Ising-like interactions - a simplification that is often problematic for real compounds.

We choose here a case with two bandwidth $t1=0.5$ and $t2=1$ and density-density like interactions of $U'=U/2$, $J=U/4$, and $U$ between $1.8$ and $2.8$, where the first case shows a Fermi liquid-like behavior in both orbitals, the $U=2.2$ is orbitally selective, and $U=2.8$ is insulating in both orbitals.

The python command lines for running the simulations are found in [`tutorial5a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5a.py):

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u,j in [[1.8,0.45],[2.2,0.55],[2.8,0.7]]:
    parms.append(
            { 
              'CONVERGED'           : 0.001,
              'FLAVORS'             : 4,
              'H'                   : 0,
              'H_INIT'              : 0.,
              'MAX_IT'              : 15,
              'MAX_TIME'            : 600,
              'MU'                  : 0,
              'N'                   : 500,
              'NMATSUBARA'          : 500,
              'N_MEAS'              : 2000,
              'N_ORDER'             : 50,
              'SEED'                : 0,
              'SOLVER'              : 'hybridization',
              'SC_WRITE_DELTA'      : 1,
              'SYMMETRIZATION'      : 1,
              'SWEEPS'              : 10000,
              'BETA'                : 30,
              'THERMALIZATION'      : 500,
              'U'                   : u,
              'J'                   : j,
              't0'                  : 0.5,
              't1'                  : 1,
              'CHECKPOINT'          : 'dump'
        }
        )

# For more precise calculations we propose to enhance the SWEEPS

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_u_'+str(p['U'])+'_j_'+str(p['J']),p)
    res = pyalps.runDMFT(input_file)
```

A paper using the same sample parameters can be found [here](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.72.081103).

As discussed in the previous tutorial [ALPS 2 Tutorials:DMFT-04 Mott](../dmft04), the (non-)metallicity of the Green's function is best observed by plotting the data on a logarithmic scale.

```
listobs = ['0', '2']   # flavor 0 is SYMMETRIZED with 1, flavor 2 is SYMMETRIZED with 3
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_u_*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.y = -d.y
    d.props['label'] = r'$U=$'+str(d.props['U'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
plt.figure()
plt.yscale('log')
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-05: Orbitally Selective Mott Transition on the Bethe lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

Convergency may be checked by [`tutorial5b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5b.py), showing all iterations of $G_f^{it}(\tau)$ on logarithmic scale.
