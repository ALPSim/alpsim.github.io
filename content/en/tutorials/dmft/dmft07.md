
---
title: DMFT-07 Hirsch-Fye
math: true
toc: true
---

## Hirsch Fye Code

We start by running a discrete time Monte Carlo code: the [Hirsch-Fye code](https://doi.org/10.1103/PhysRevLett.56.2521). As in Tutorials 02 and 03, we reproduce Fig. 11 in the DMFT review by [Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). The series of six curves shows how the system, a Hubbard model on the Bethe lattice with interaction $U=3D/\sqrt{2}$ at half filling, enters an antiferromagnetic phase upon cooling.

The Hirsch-Fye algorithm and an open-source implementation are described in the DMFT review by [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). While many improvements have been developed since (see e.g. Alvarez (2008) or [Nukala et al. (2009)](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111)), the algorithm has largely been superseded by [continuous-time algorithms](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123) (CT-HYB and CT-INT, Tutorials 02 and 03), which eliminate the systematic discretization error discussed below.

### Model

As in Tutorials 02, 03, and 06, we solve the single-band Hubbard model

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

on the Bethe lattice at half filling ($\mu=0$), with $t=0.707106781186547=1/\sqrt{2}$ (half-bandwidth $D=2t=\sqrt{2}$) and $U=3$, so that $U=3D/\sqrt{2}$ as in [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). As in Tutorial 02, `ANTIFERROMAGNET=1` allows the Néel self-consistency, so cooling the same physical point through a range of $\beta$ reproduces the same metal-to-antiferromagnetic-insulator crossover — this time with the discrete-time Hirsch-Fye solver of [Hirsch and Fye (1986)](https://doi.org/10.1103/PhysRevLett.56.2521) rather than a continuous-time one.

### Parameters

| Parameter | Meaning | Value(s) used |
| :-------- | :------ | :------------ |
| `U` | on-site interaction | $3$ |
| `t` | nearest-neighbor hopping (Bethe lattice half-bandwidth $D=2t$) | $0.707106781186547 = 1/\sqrt{2}$, so that $U=3D/\sqrt{2}$ |
| `BETA` | inverse temperature | $6, 8, 10, 12, 14, 16$ (short script: $6, 12$ only) |
| `MU` | chemical potential | $0$ (half filling) |
| `H`, `H_INIT` | quantization-axis field / seed field for the initial Weiss field | $0$ / $0.05$ |
| `FLAVORS` | number of spin flavors | $2$ |
| `ANTIFERROMAGNET` | enable the Néel self-consistency | $1$ |
| `SYMMETRIZATION` | enforce a paramagnetic solution | $0$ (we want to allow AFM order) |
| `N` | number of imaginary-time slices, $\Delta\tau=\beta/N$ | $16$ — deliberately small, see Method choice |
| `NMATSUBARA` | Matsubara cutoff used for the self-consistency | $500$ |
| `OMEGA_LOOP` | run the self-consistency in Matsubara frequencies | $1$ |
| `MAX_IT`, `CONVERGED` | maximum self-consistency iterations / convergence threshold | $10$, $0.005$ (short); $18$, $0.003$ (long) |
| `SOLVER` | impurity solver | `"hirschfye"` |
| `TOLERANCE` | convergence tolerance used internally by the Hirsch-Fye solver | $0.001$ |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | Monte Carlo sweep budget, thermalization sweeps, wall-clock cutoff per iteration (seconds) | $10^6$, $10^4$, $20$ |

### Running the simulation

The Hirsch-Fye simulation will run for about 20 seconds per iteration. The files for this tutorial can be found in the directory `tutorials/dmft-07-hirschfye`. As in Tutorials 02 and 03, you can run the short script [`tutorial7.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7.py), reproducing 2 of the 6 curves (runtime: roughly 5 minutes), or the long version [`tutorial7_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7_long.py), reproducing all 6 curves.

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for b in [6., 12.]:
    parms.append(
            { 
              'ANTIFERROMAGNET'     : 1,
              'CONVERGED'           : 0.005,
              'FLAVORS'             : 2,
              'H'                   : 0,
              'H_INIT'              : 0.05,
              'MAX_IT'              : 10,
              'MAX_TIME'            : 20,
              'MU'                  : 0,
              'N'                   : 16,
              'NMATSUBARA'          : 500, 
              'OMEGA_LOOP'          : 1,
              'SEED'                : 0, 
              'SITES'               : 1,
              'SOLVER'              : 'hirschfye',
              'SYMMETRIZATION'      : 0,
              'TOLERANCE'           : 0.001,
              'U'                   : 3,
              't'                   : 0.707106781186547,
              'SWEEPS'              : 1000000,
              'THERMALIZATION'      : 10000,
              'BETA'                : b
            }
        )

# For more precise simulation we propose to you to:
#   lower CONVERGED (to 0.0003) and TOLERANCE (to 0.0001) and increase MAX_TIME

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)

listobs=['0', '1']
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-07: Neel transition for the Hubbard model on the Bethe lattice\n(using the Hirsch-Fye impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

Internally, `pyalps.runDMFT` invokes the `dmft` application directly on the generated parameter file, once per iteration:

```
/path-to-alps-installation/bin/dmft parm_beta_6.0
/path-to-alps-installation/bin/dmft parm_beta_12.0
```

### The parameter file

The input file `parm_beta_6.0` produced by the script above, with comments added:

```
ANTIFERROMAGNET = 1                  // allow Neel order; meaningful for bipartite lattices in single-site DMFT
CONVERGED = 0.005                    // convergence criterion for the self-consistency iteration
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
H = 0                                // magnetic field along the quantization axis
H_INIT = 0.05                        // seed field for the initial Weiss field, breaks the up/down symmetry
MAX_IT = 10                          // maximum number of self-consistency iterations
MAX_TIME = 20                        // wall-clock time limit per iteration (seconds)
MU = 0                                // chemical potential; MU=0 is half filling for particle-hole symmetric models
N = 16                                // number of imaginary-time slices (Delta_tau = BETA/N); deliberately small, see Method choice
NMATSUBARA = 500                      // Matsubara cutoff used for the self-consistency
OMEGA_LOOP = 1                        // self-consistency runs in Matsubara frequencies
SEED = 0                              // Monte Carlo random number seed
SITES = 1                             // one impurity site, as in single-site DMFT
SOLVER = "hirschfye"                  // the discrete-time Hirsch-Fye solver
SYMMETRIZATION = 0                    // paramagnetic self-consistency is NOT enforced (we want AFM order)
TOLERANCE = 0.001                     // internal convergence tolerance of the Hirsch-Fye solver
U = 3                                 // interaction strength
t = 0.707106781186547                 // hopping; for the Bethe lattice considered here $W=2D=4t$
SWEEPS = 1000000                      // total sweeps
THERMALIZATION = 10000                // thermalization sweeps
BETA = 6.0                            // inverse temperature
```

As in the earlier tutorials, no lattice/band-structure parameter is given, so a Bethe lattice is assumed by default (see [DMFT-08 Lattices](../dmft08) for other choices), and the initial Weiss field is computed from the non-interacting Green's function using `H_INIT`.

### Lattice

As in Tutorials 02, 03, and 06, this is single-site DMFT on the Bethe lattice in the $z\to\infty$ limit, with hopping rescaled as $t=t^*/\sqrt{z}$ so that the semicircular density of states (half-bandwidth $D=2t$) is evaluated analytically in the self-consistency loop (`OMEGA_LOOP=1`, no `DOSFILE`). Every site carries the same on-site interaction $U$; every bond carries the same hopping $t$:

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

Hirsch-Fye works very differently from CT-HYB and CT-INT: it Trotter-decomposes $e^{-\beta \hat H}$ into $N$ imaginary-time slices of width $\Delta\tau=\beta/N$, introduces an auxiliary Ising field on every slice via a Hubbard-Stratonovich transformation, and updates an $N\times N$ Green's function matrix with Sherman-Morrison-type fast updates. Because each Monte Carlo move costs $O(N^2)$ and a full sweep costs $O(N^3)$, $N$ must be kept small — here $N=16$, in contrast to the continuous-time solvers of Tutorials 02 and 03, where `N` is merely a storage/interpolation bin count (typically $500$–$1000$) decoupled from the computational cost. The price of a small $N$ is a systematic bias of order $(\Delta\tau)^2$ in observables: this is exactly the discretization error that [DMFT-06](../dmft06) contrasts with the bias-free continuous-time solvers, and it is why Hirsch-Fye results must be extrapolated to $\Delta\tau\to0$ ($N\to\infty$) before they can be compared quantitatively to CT-HYB, CT-INT, or Exact Diagonalization.

### Output data and plots

For evaluation you may adapt `tutorial2eval.py` as described in [DMFT-02 Hybridization](../dmft02), or use [`tutorial7eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7eval.py), which is structurally identical to `tutorial2eval.py`: it plots the iteration-resolved $G(\tau)$, the occupation $n_0=-G_0(\tau=\beta^-)$ versus $\beta$, and the Matsubara-frequency Green's function and self-energy (via the Dyson equation), for both flavors.

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot
from math import pi


listobs=['0']   # we look at a single flavor (=0) 
res_files = pyalps.getResultFiles(pattern='parm_*.h5')  # we look for result files

## load all iterations of G_{flavor=0}(tau)
data = pyalps.loadDMFTIterations(res_files, observable="G_tau", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G_{flavor=0}(\tau)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta= common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()

## load the final iteration of G_{flavor=0}(tau)
data_G_tau = pyalps.loadMeasurements(res_files, respath='/simulation/results/G_tau', what=listobs, verbose=False)  

print("Occupation in the last iteration at flavor=0")
for d in pyalps.flatten(data_G_tau):
    # obtain occupation using relation: <n_{flavor=0}> = -<G_{flavor=0}(tau=beta)>
    d.y = np.array([-d.y[-1]])
    print("n_0(beta =",d.props['BETA'],") =",d.y[0])
    d.x = np.array([0])
    d.props['observable'] = 'occupation'

occupation = pyalps.collectXY(data_G_tau, 'BETA', 'occupation')
for d in occupation:
    d.props['line']="scatter"

plt.figure()
pyalps.plot.plot(occupation)
plt.xlabel(r'$\beta$')
plt.ylabel(r'$n_{flavor=0}$')
plt.title('Occupation versus BETA')

plt.show()

## load all iterations of G_{flavor=0}(i omega_n)
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d.x])
        d.y = np.array(d.y.imag)
        d.props['label'] = "it"+d.props['iteration']
        d.props['line']="scatter"
        d.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ G_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()

## load all iterations of G_{flavor=0}(i omega_n) and G0_{flavor=0}(i omega_n)
data_G = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)
data_G0 = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G0_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped_G = pyalps.groupSets(pyalps.flatten(data_G), ['BETA','observable'])
for sim in grouped_G:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## compute selfenergy using the Dyson equation, rescale x-axis and set label
    for d_G in sim:
        # find corresponding dataset from data_G0
        d_G0 = [s for s in pyalps.flatten(data_G0) if s.props['iteration']==d_G.props['iteration'] and s.props['BETA']==common_props['BETA']][0]
        d_G.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d_G.x])
        # Dyson equation
        Sigma = np.array([1./d_G0.y[w] - 1./d_G.y[w] for w in range(len(d_G.y))])
        d_G.y = np.array(Sigma.imag)
        d_G.props['label'] = "it"+d_G.props['iteration']
        d_G.props['line']="scatter"
        d_G.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ \Sigma_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```

Because this is a stochastic Monte Carlo simulation, the actual numbers you obtain depend on `SEED`, `MAX_TIME`, and machine speed, but as in Tutorials 02 and 03, running the short script should reproduce the qualitative feature of Fig. 11: at $\beta=6$ both flavors of $G(\tau)$ nearly coincide (paramagnetic, metallic), while at $\beta=12$ they separate (antiferromagnetic order). Since $N=16$ is small, expect a visible offset relative to the continuous-time results of Tutorials 02 and 03 at the same $\beta$ — this offset is the $\Delta\tau$ discretization error discussed above.

### Summary and outlook

As a discrete-time method, Hirsch-Fye suffers from $\Delta\tau$ discretization errors that CT-HYB and CT-INT do not have. Reproducing the same Néel transition here, with a visible bias relative to Tutorials 02 and 03, illustrates concretely why continuous-time algorithms have largely replaced Hirsch-Fye.

1. Pick a single $(\,U,\beta)$ point and rerun it for successively larger $N$ (e.g. $8, 16, 32, 64$): does the converged $G(\tau)$ approach the CT-HYB/CT-INT result as $N$ increases? Try extrapolating your data in $(\Delta\tau)^2=(\beta/N)^2$ to $N\to\infty$.
2. [DMFT-06](../dmft06) compares CT-HYB and CT-INT directly to the Exact Diagonalization/Hirsch-Fye benchmark of Fig. 15 in [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). Reproduce that comparison yourself, using your extrapolated Hirsch-Fye result from question 1 in place of the literature curve.
3. At fixed wall-clock time, how does the statistical noise in $G(\tau)$ from Hirsch-Fye compare to CT-HYB (Tutorial 02) at the same $\beta$? Does increasing $N$ to reduce the discretization error also increase the noise, the runtime, or both?
4. [DMFT-09 Néel Transition](../dmft09) combines this Hirsch-Fye run with the CT-HYB (Tutorial 02) and CT-INT (Tutorial 03) results into a single comparison — try reproducing that comparison yourself.
