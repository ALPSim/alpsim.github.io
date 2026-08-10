
---
title: DMFT-04 Mott
math: true
toc: true
---

## Mott Transition

Mott transitions are metal insulator transitions (MIT) that occur in many materials, e.g. transition metal compounds, as a function of pressure or doping. The review by [Imada, Fujimori, and Tokura, Rev. Mod. Phys. 70, 1039 (1998)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.70.1039) gives an excellent introduction to the subject and mentions $V_2O_3$ and the organics as typical examples.

MIT are easily investigated by DMFT as the relevant physics is essentially local (or k-independent): At half filling the MIT can be modeled by a self energy with a pole at $\omega=0$ which splits the noninteracting band into an upper and a lower Hubbard band. In this context it is instructive to suppress antiferromagnetic long range order and enforce a paramagnetic solution in the DMFT simulation, to mimic the paramagnetic insulating phase. For this, the up and down spin components of the Green's functions are symmetrized (parameter `SYMMETRIZATION = 1;`).

### Model

As in Tutorials 02 and 03, DMFT is applied to the single-band Hubbard model

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

on the Bethe lattice, at half filling ($\mu=0$). Here the interaction $U$ is swept at fixed inverse temperature $\beta t=20$, deep enough in the low-temperature regime that the paramagnetic solution (once antiferromagnetic order is suppressed) has essentially reached its zero-temperature form; see [Imada, Fujimori, and Tokura (1998)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.70.1039) for the physical context, and [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) for the DMFT mapping.

### Parameters

| Parameter | Meaning | Value(s) used |
| :-------- | :------ | :------------ |
| `U` | on-site interaction, swept across the transition | $4, 5, 6, 8$ |
| `t` | nearest-neighbor hopping (Bethe lattice half-bandwidth $D=2t$, bandwidth $W=4t$) | $1$ |
| `BETA` | inverse temperature, fixed while $U$ is varied | $20$ |
| `MU` | chemical potential | $0$ (half filling) |
| `H`, `H_INIT` | quantization-axis field / seed field for the initial Weiss field | $0$ / $0$ (no symmetry breaking — see Method choice) |
| `FLAVORS` | number of spin flavors | $2$ |
| `ANTIFERROMAGNET` | enable the Néel self-consistency | $0$ (disabled — see Method choice) |
| `SYMMETRIZATION` | enforce a paramagnetic solution (symmetrize flavors 0 and 1) | $1$ |
| `N`, `NMATSUBARA` | imaginary-time / Matsubara discretization of $G$ and $G_0$ | $500$ |
| `OMEGA_LOOP` | run the self-consistency in Matsubara frequencies | $1$ |
| `MAX_IT`, `CONVERGED` | maximum self-consistency iterations / convergence threshold | $20$, $0.001$ |
| `SOLVER` | impurity solver | `"hybridization"` (CT-HYB) |
| `N_ORDER` | histogram size for the hybridization expansion order | $50$ |
| `N_MEAS` | number of Monte Carlo updates between measurements | $1000$ |
| `SC_WRITE_DELTA` | write the hybridization function for the solver | $1$ |
| `CHECKPOINT` | filename prefix for checkpoint/restart files | `solverdump_U_`+`U` |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | Monte Carlo sweep budget (scaled with $U$), thermalization sweeps, wall-clock cutoff per iteration (seconds) | $1500\,U$, $500$, $600$ |

### Running the simulation

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

As in the earlier tutorials, `pyalps.runDMFT` invokes the `dmft` application directly on each generated parameter file, once per iteration:

```
/path-to-alps-installation/bin/dmft parm_u_4.0
/path-to-alps-installation/bin/dmft parm_u_5.0
/path-to-alps-installation/bin/dmft parm_u_6.0
/path-to-alps-installation/bin/dmft parm_u_8.0
```

### The parameter file

The input file `parm_u_4.0` produced by the script above, with comments added:

```
ANTIFERROMAGNET = 0                  // suppress Neel order to access the paramagnetic Mott solution
CHECKPOINT = solverdump_U_4.0        // filename prefix for checkpoint/restart files
CONVERGED = 0.001                    // convergence criterion for the self-consistency iteration
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
H = 0                                // magnetic field along the quantization axis
H_INIT = 0.                          // no symmetry-breaking seed field for the initial Weiss field
MAX_IT = 20                          // maximum number of self-consistency iterations
MAX_TIME = 600                       // wall-clock time limit per iteration (seconds)
MU = 0                               // chemical potential; MU=0 is half filling
N = 500                              // discretization of the imaginary-time Green's function
NMATSUBARA = 500                     // cutoff for Matsubara frequencies
N_MEAS = 1000                        // number of updates between measurements
N_ORDER = 50                         // histogram size for the hybridization expansion order
OMEGA_LOOP = 1                       // self-consistency runs in Matsubara frequencies
SEED = 0                             // Monte Carlo random number seed
SITES = 1                            // one impurity site, as in single-site DMFT
SOLVER = "hybridization"             // the CT-HYB solver
SC_WRITE_DELTA = 1                   // write out the hybridization function for the solver
SYMMETRIZATION = 1                   // enforce a paramagnetic solution (flavors 0 and 1 symmetrized)
t = 1                                // hopping; for the Bethe lattice considered here $W=2D=4t$
SWEEPS = 6000                        // total sweeps (1500*U at U=4)
BETA = 20.0                          // inverse temperature
THERMALIZATION = 500                 // thermalization sweeps
U = 4                                // interaction strength
```

### Lattice

As in Tutorials 02 and 03, single-site DMFT here uses the Bethe lattice in the limit of infinite coordination number $z\to\infty$, with hopping rescaled as $t=t^*/\sqrt{z}$ so that its semicircular density of states (half-bandwidth $D=2t$) can be evaluated analytically in the self-consistency loop (`OMEGA_LOOP=1`, no `DOSFILE`). Every site carries the same on-site interaction $U$; every bond carries the same hopping $t$:

```
        o       o
         \     /
      t   \   /   t
           \ /
        o---o---o          o : lattice site, interaction U (on site)
           / \              --- : bond, hopping amplitude t
          /   \
         /     \
        o       o
```

See [DMFT-08 Lattices](../dmft08) for running the self-consistency on other lattices, and the [ALPS lattice library](../../../documentation/intro/latticehowtos) for simulations built on explicit finite lattices.

### Method choice

We use the hybridization-expansion solver CT-HYB (as in [DMFT-02 Hybridization](../dmft02)) rather than the interaction-expansion solver CT-INT (as in [DMFT-03 Interaction](../dmft03)). CT-INT's average perturbation order grows roughly linearly with $\beta U$; at $\beta t=20$ and $U/t$ up to $8$, this would make CT-INT expensive. CT-HYB, by contrast, expands in the hybridization to the bath: deep in the insulating phase, the effective low-energy coupling to the bath is suppressed (the impurity approaches the atomic limit), so the average hybridization order stays manageable even as $U$ increases — the opposite scaling from CT-INT. This makes CT-HYB the natural choice for tracking a solution from the metal into the Mott insulator.

We also deliberately set `ANTIFERROMAGNET = 0` and `SYMMETRIZATION = 1`. On the (bipartite) Bethe lattice at half filling, antiferromagnetic order wins at low temperature for essentially any $U>0$, which would preempt the paramagnetic Mott transition studied here. Suppressing the Néel self-consistency and enforcing a symmetric (paramagnetic) solution isolates the interaction-driven MIT, mimicking the effect of geometric frustration that suppresses magnetic order in real Mott materials.

### Identifying the metal-insulator transition

We investigate the Mott transition in single-site DMFT, as a function of interaction at fixed temperature $\beta t=20$ (see e.g. Fig. 2 in [this paper](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)). Starting from a non-interacting solution we see in the imaginary time Green's function that the solution is metallic for $U/t \leq 4.5$, and insulating for $U/t\geq 5$. A coexistence region could be found by starting from an insulating (or atomic) solution and attempting to converge it at smaller $U$.

Imaginary time Green's functions are not easy to interpret, and therefore many authors employ [analytic continuation methods (e.g. the maximum entropy method)](https://doi.org/10.1016/0370-1573%2895%2900074-7). There are however two clear features: the value at $\beta$ corresponds to $-n$, the negative value of the density (per spin). The second feature is that $-\beta G(\beta/2) \rightarrow \pi A(0)$ for decreasing temperature ($\beta\rightarrow\infty$); where $A(0)$ is the spectral function at the Fermi energy. From a temperature dependence of the imaginary time Green's function we can therefore immediately see if the system is metallic or insulating. In order to better inspect the behavior of the Green's function we will plot the data on a logarithmic scale:

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

You should observe that at small $U$ you find a metallic solution, and an insulating solution at large $U$, at fixed $\beta$. The largest value of $U$ is deep within the insulating phase.

### Checking convergence

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

### Summary and outlook

By suppressing antiferromagnetic order and scanning $U$ at fixed $\beta t=20$, we located the paramagnetic Mott transition of the half-filled Hubbard model on the Bethe lattice between $U/t=4.5$ and $U/t=5$, consistent with the DMFT phase diagram reviewed by [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13).

1. Set `ANTIFERROMAGNET = 1` (as in [DMFT-02 Hybridization](../dmft02)) and rerun at the same $U$ values: does the antiferromagnetic instability preempt the paramagnetic solution studied here?
2. The Mott transition is first-order at low temperature, so metallic and insulating solutions can coexist. Starting from a converged insulating run, copy its `G0omega_output` into a new `G0OMEGA_INPUT` and try to converge a smaller-$U$ point from the insulating side — how far below $U/t\approx4.5$ does the insulating solution survive?
3. Repeat the scan at a higher temperature (smaller `BETA`): does the apparent transition become smoother, consistent with the first-order line ending in a finite-temperature critical point?
4. Compare the CT-HYB run at $U=8$ to a CT-INT run (Tutorial 03 solver) at the same point: which solver converges faster, given the scaling arguments in the Method choice section above?

