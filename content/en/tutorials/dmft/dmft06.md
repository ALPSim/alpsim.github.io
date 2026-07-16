
---
title: DMFT-06 Paramagnet
math: true
toc: true
---

## Paramagnetic metal and extrapolation errors

In this example we simulate the Hubbard model on the Bethe lattice with interaction $U=3D/\sqrt{2}$ at a temperature $\beta =32 \sqrt{2}/D$ using a paramagnetic self-consistency. We will calculate the self-energy and compare it to Fig. 15 in the DMFT review by [Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13), where Hirsch-Fye and Exact Diagonalization results are shown for the same system. In contrast to the Hirsch-Fye algorithm, the two continuous-time Monte Carlo algorithms CT-HYB and CT-INT do not suffer from discretization errors and reproduce the ED results.

### Model

As in the earlier tutorials, we solve the single-band Hubbard model

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

on the Bethe lattice at half filling ($\mu=0$), with $t=0.707106781186547=1/\sqrt{2}$ (half-bandwidth $D=2t=\sqrt{2}$) and $U=3$, so that $U=3D/\sqrt{2}$ as in [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). Unlike Tutorials 02 and 03, here we enforce a *paramagnetic* self-consistency (`ANTIFERROMAGNET=0`, `SYMMETRIZATION=1`) at $\beta=32$, so that the metallic self-energy can be compared directly to the Hirsch-Fye and Exact Diagonalization benchmarks of Fig. 15 in that review, which were likewise computed for the paramagnetic phase.

### Parameters

Both solvers are run at the same physical point:

| Parameter | Meaning | Value |
| :-------- | :------ | :---- |
| `U` | on-site interaction | $3$ |
| `t` | nearest-neighbor hopping (half-bandwidth $D=2t=\sqrt{2}$) | $0.707106781186547 = 1/\sqrt{2}$ |
| `BETA` | inverse temperature | $32$ |
| `MU` | chemical potential | $0$ (half filling) |
| `H`, `H_INIT` | quantization-axis field / seed field for the initial Weiss field | $0$ / $0$ |
| `FLAVORS` | number of spin flavors | $2$ |
| `ANTIFERROMAGNET` | enable the Néel self-consistency | $0$ (disabled — paramagnetic solution enforced) |
| `SYMMETRIZATION` | enforce a paramagnetic solution | $1$ |
| `OMEGA_LOOP` | run the self-consistency in Matsubara frequencies | $1$ |
| `SITES` | number of impurity sites | $1$ |
| `MAX_IT`, `CONVERGED` | maximum self-consistency iterations / convergence threshold | $12$, $0.0025$ |

The two solvers differ in their discretization and solver-specific settings:

| Parameter | Meaning | CT-HYB (`hyb`) | CT-INT (`int`) |
| :-------- | :------ | :-------------- | :-------------- |
| `SOLVER` | impurity solver | `"hybridization"` | `"Interaction Expansion"` |
| `N`, `NMATSUBARA` | imaginary-time / Matsubara discretization of $G$, $G_0$ | $1000$ | $500$ |
| `SWEEPS`, `THERMALIZATION` | Monte Carlo sweep budget, thermalization sweeps | $2500$, $500$ | $10^8$, $1000$ |
| `MAX_TIME` | wall-clock cutoff per iteration (seconds) | $600$ | $120$ |
| `N_MEAS` | Monte Carlo updates between measurements | $10000$ | — |
| `N_ORDER` | histogram size for the hybridization expansion order | $50$ | — |
| `SC_WRITE_DELTA` | write the hybridization function for the solver | $1$ | — |
| `ALPHA` | shift of the CT-INT auxiliary Ising field | — | $-0.01$ |
| `HISTOGRAM_MEASUREMENT` | record a histogram of the CT-INT perturbation order | — | $1$ |
| `MEASUREMENT_PERIOD`, `RECALC_PERIOD` | CT-INT measurement/recomputation cadence | — | $10$, $3000$ |
| `NMATSUBARA_MEASUREMENTS`, `NSELF` | CT-INT-specific Matsubara/self-energy grid sizes | — | $18$, $5000$ |
| `CONVERGENCE_CHECK_PERIOD` | CT-INT convergence-check cadence | — | $500$ |
| `CHECKPOINT` | filename prefix for checkpoint/restart files | `dump_hyb` | `dump_int` |

### Running the simulation

The parameter files and python scripts are located in the subdirectories `hyb` and `int` of the directory `tutorials/dmft-06-paramagnet` in your ALPS install directory. You can run the simulations by executing (for the hybridization expansion version)

```
python tutorial6a.py
```

and (for the interaction expansion version)

```
python tutorial6b.py
```

[`tutorial6a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-06-paramagnet/hyb/tutorial6a.py) (CT-HYB):

```
import pyalps

#prepare the input parameters
parms=[]
parms.append(
        {
          'ANTIFERROMAGNET'     : 0,
          'CHECKPOINT'          : 'dump_hyb',
          'CONVERGED'           : 0.0025,
          'FLAVORS'             : 2,
          'H'                   : 0,
          'H_INIT'              : 0.0,
          'MAX_IT'              : 12,
          'MAX_TIME'            : 600,
          'MU'                  : 0,
          'N'                   : 1000,
          'NMATSUBARA'          : 1000,
          'N_MEAS'              : 10000,
          'N_ORDER'             : 50,
          'OMEGA_LOOP'          : 1,
          'SEED'                : 0,
          'SITES'               : 1,
          'SOLVER'              : 'hybridization',
          'SC_WRITE_DELTA'      : 1,
          'SYMMETRIZATION'      : 1,
          'U'                   : 3,
          't'                   : 0.707106781186547,
          'SWEEPS'              : 2500,
          'THERMALIZATION'      : 500,
          'BETA'                : 32
        }
    )

# For more precise calculations we propose to you to:
#   enhance the MAX_TIME, MAX_IT and lower CONVERGED

#write the input file and run the simulation
input_file = pyalps.writeParameterFile('parm_hyb',parms[0])
res = pyalps.runDMFT(input_file)
```

[`tutorial6b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-06-paramagnet/int/tutorial6b.py) (CT-INT):

```
import pyalps

#prepare the input parameters
parms=[]
parms.append(
        { 
          'ANTIFERROMAGNET'         : 0,
          'CHECKPOINT'              : 'dump_int',
          'CONVERGED'               : 0.0025,
          'CONVERGENCE_CHECK_PERIOD': 500,
          'FLAVORS'                 : 2,
          'H'                       : 0,
          'H_INIT'                  : 0.,
          'MAX_IT'                  : 12,
          'MAX_TIME'                : 120,
          'MU'                      : 0,
          'N'                       : 500,
          'NMATSUBARA'              : 500,
          'NMATSUBARA_MEASUREMENTS' : 18, 
          'NSELF'                   : 5000,
          'MEASUREMENT_PERIOD'      : 10,
          'OMEGA_LOOP'              : 1,
          'SEED'                    : 0, 
          'SITES'                   : 1,
          'SOLVER'                  : 'Interaction Expansion',
          'SYMMETRIZATION'          : 1,
          'U'                       : 3,
          't'                       : 0.707106781186547,
          'RECALC_PERIOD'           : 3000,
          'SWEEPS'                  : 100000000,
          'THERMALIZATION'          : 1000,
          'ALPHA'                   : -0.01,
          'HISTOGRAM_MEASUREMENT'   : 1,
          'BETA'                    : 32
        }
    )
    
# For more precise calculations we propose to you to:
#   enhance the MAX_TIME, MAX_IT and lower CONVERGED

#write the input file and run the simulation
input_file = pyalps.writeParameterFile('parm_int',parms[0])
res = pyalps.runDMFT(input_file)
```

Internally, `pyalps.runDMFT` invokes the `dmft` application directly on each generated parameter file, once per iteration:

```
/path-to-alps-installation/bin/dmft parm_hyb
/path-to-alps-installation/bin/dmft parm_int
```

Warning: this takes a long time to run on a single workstation; you may shorten the two runs to about $2\times 24$ minutes in total if you do not need very high precision (by lowering `MAX_TIME` and `MAX_IT`, or raising `CONVERGED`).

### The parameter files

The `parm_hyb` file, with comments added:

```
ANTIFERROMAGNET = 0        // paramagnetic self-consistency (no Neel order)
CHECKPOINT = dump_hyb      // filename prefix for checkpoint/restart files
CONVERGED = 0.0025         // convergence criterion for the self-consistency iteration
FLAVORS = 2                // flavors 0 and 1 correspond to spin up and down
H = 0                      // magnetic field along the quantization axis
H_INIT = 0.0               // no symmetry-breaking seed field
MAX_IT = 12                // maximum number of self-consistency iterations
MAX_TIME = 600             // wall-clock time limit per iteration (seconds)
MU = 0                     // chemical potential; MU=0 is half filling
N = 1000                   // discretization of the imaginary-time Green's function
NMATSUBARA = 1000          // cutoff for Matsubara frequencies
N_MEAS = 10000             // number of updates between measurements
N_ORDER = 50               // histogram size for the hybridization expansion order
OMEGA_LOOP = 1             // self-consistency runs in Matsubara frequencies
SEED = 0                   // Monte Carlo random number seed
SITES = 1                  // one impurity site, as in single-site DMFT
SOLVER = "hybridization"   // the CT-HYB solver
SC_WRITE_DELTA = 1         // write out the hybridization function for the solver
SYMMETRIZATION = 1         // enforce a paramagnetic solution (flavors 0 and 1 symmetrized)
U = 3                      // interaction strength
t = 0.707106781186547      // hopping; for the Bethe lattice considered here $W=2D=4t$
SWEEPS = 2500               // total sweeps
THERMALIZATION = 500       // thermalization sweeps
BETA = 32                  // inverse temperature
```

The `parm_int` file, with comments added:

```
ANTIFERROMAGNET = 0                  // paramagnetic self-consistency (no Neel order)
CHECKPOINT = dump_int                // filename prefix for checkpoint/restart files
CONVERGED = 0.0025                   // convergence criterion for the self-consistency iteration
CONVERGENCE_CHECK_PERIOD = 500       // how often (in sweeps) convergence is checked
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
H = 0                                // magnetic field along the quantization axis
H_INIT = 0.                          // no symmetry-breaking seed field
MAX_IT = 12                          // maximum number of self-consistency iterations
MAX_TIME = 120                       // wall-clock time limit per iteration (seconds)
MU = 0                               // chemical potential; MU=0 is half filling
N = 500                              // discretization of the imaginary-time Green's function
NMATSUBARA = 500                     // cutoff for Matsubara frequencies
NMATSUBARA_MEASUREMENTS = 18         // number of Matsubara points measured directly
NSELF = 5000                         // number of self-energy points
MEASUREMENT_PERIOD = 10              // sweeps between measurements
OMEGA_LOOP = 1                       // self-consistency runs in Matsubara frequencies
SEED = 0                             // Monte Carlo random number seed
SITES = 1                            // one impurity site, as in single-site DMFT
SOLVER = "Interaction Expansion"     // the CT-INT solver
SYMMETRIZATION = 1                   // enforce a paramagnetic solution (flavors 0 and 1 symmetrized)
U = 3                                // interaction strength
t = 0.707106781186547                // hopping; for the Bethe lattice considered here $W=2D=4t$
RECALC_PERIOD = 3000                 // sweeps between recomputation of the weight from scratch
SWEEPS = 100000000                   // upper bound on sweeps; in practice MAX_TIME stops the run first
THERMALIZATION = 1000                // thermalization sweeps
ALPHA = -0.01                        // shift of the auxiliary Ising field (CT-INT sign-problem control)
HISTOGRAM_MEASUREMENT = 1            // record a histogram of the CT-INT perturbation order
BETA = 32                            // inverse temperature
```

### Lattice

As in the earlier tutorials, this is single-site DMFT on the Bethe lattice in the $z\to\infty$ limit, with hopping rescaled as $t=t^*/\sqrt{z}$ so that the semicircular density of states (half-bandwidth $D=2t$) is evaluated analytically in the self-consistency loop (`OMEGA_LOOP=1`, no `DOSFILE`). Every site carries the same on-site interaction $U$; every bond carries the same hopping $t$:

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

The point of this tutorial is not to pick one solver over the other, but to run *both* CT-HYB and CT-INT on the same physical point and check that they agree — and agree with the numerically exact benchmarks in Fig. 15 of [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). That figure was originally produced with Exact Diagonalization (exact, but limited to a small number of bath sites) and the discrete-time Hirsch-Fye algorithm (see [DMFT-07 Hirsch-Fye](../dmft07)), which has a systematic error controlled by the time-slice width $\Delta\tau=\beta/N$ and therefore needs to be extrapolated to $\Delta\tau\to0$ (i.e. $N\to\infty$) to be trusted quantitatively — the "extrapolation errors" of the tutorial title. CT-HYB and CT-INT expand different quantities (the hybridization vs. the interaction) but are both formulated directly in continuous imaginary time, so neither has a $\Delta\tau$ bias to extrapolate away; any difference between their converged results is purely statistical.

### Output data and plots

At each DMFT iteration $i$ the self-energy is written to the file `selfenergy_i`. Plot the converged self-energy and compare your results to Fig. 15 in [Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). Alternatively you may use a python script for this task, adapting the Matsubara self-energy code from [DMFT-02 Hybridization](../dmft02#matsubara-frequency-greens-function-and-self-energy):

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
from math import pi

listobs=['0']   # SYMMETRIZATION=1, so flavor 0 already represents both spins

## load the converged (final) G and G0 in Matsubara representation for both solvers
data_G = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_*.h5'), respath='/simulation/results/G_omega', what=listobs, verbose=False)
data_G0 = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_*.h5'), respath='/simulation/results/G0_omega', what=listobs, verbose=False)

for d_G, d_G0 in zip(pyalps.flatten(data_G), pyalps.flatten(data_G0)):
    d_G.x = np.array([(2.*n+1)*pi/d_G.props['BETA'] for n in d_G.x])
    Sigma = 1./d_G0.y - 1./d_G.y   # Dyson equation
    d_G.y = np.array(Sigma.imag)
    d_G.props['label'] = d_G.props['SOLVER']

plt.figure()
plt.xlabel(r'$i\omega_n$')
plt.ylabel(r'$Im\ \Sigma(i\omega_n)$')
plt.title('DMFT-06: paramagnetic self-energy, CT-HYB vs. CT-INT')
pyalps.plot.plot(list(pyalps.flatten(data_G)))
plt.legend()
plt.show()
```

Because this is a stochastic Monte Carlo simulation, the actual numbers you obtain depend on `SEED`, `MAX_TIME`, and machine speed, but the converged self-energies from `parm_hyb` and `parm_int` should agree with each other within error bars, and both should reproduce the low-frequency behavior of the ED/Hirsch-Fye curve in Fig. 15 of [Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) — without needing any $\Delta\tau$ extrapolation.

### Summary and outlook

Running CT-HYB and CT-INT on the same paramagnetic metallic point and comparing both to Fig. 15 of [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) confirms that continuous-time solvers reproduce the numerically exact benchmark without the $\Delta\tau\to0$ extrapolation that discrete-time methods require.

1. [DMFT-07 Hirsch-Fye](../dmft07) runs the same physical point with the discrete-time solver. Reproduce that run at a few different values of `N` (number of time slices) and extrapolate $\Delta\tau=\beta/N\to0$: how does the extrapolated result compare to the CT-HYB/CT-INT curves obtained here?
2. Compare the error bars of the two converged self-energies at fixed total wall-clock time: which solver reaches a given statistical precision faster at this particular $U$ and $\beta$?
3. The low-frequency slope of $\mathrm{Im}\,\Sigma(i\omega_n)$ is related to the quasiparticle weight $Z$. Extract $Z$ from your converged self-energy and compare it to the value quoted in [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) for this $U/D$.
4. [DMFT-09 Néel Transition](../dmft09) revisits the same lattice and solvers but with `ANTIFERROMAGNET=1`; compare how the self-consistency and convergence behavior differ once magnetic order is allowed.
