
---
title: DMFT-03 Interaction
math: true
toc: true
---

## Interaction Expansion CT-INT

We repeat the calculation of [DMFT-02 Hybridization](../dmft02) with a different continuous-time quantum Monte Carlo impurity solver: the interaction-expansion algorithm CT-INT. Instead of expanding the partition function in the impurity-bath hybridization (as CT-HYB does), CT-INT expands in powers of the interaction $U$ and samples the resulting diagrams stochastically using an auxiliary Ising field, following [Rubtsov, Savkin, and Lichtenstein, Phys. Rev. B 72, 035122 (2005)](https://doi.org/10.1103/PhysRevB.72.035122). Because it expands around the *non*-interacting limit, CT-INT tends to be most efficient at weak-to-moderate coupling, complementing the strong-coupling CT-HYB solver used in Tutorial 02.

As in Tutorial 02, we reproduce Fig. 11 of the DMFT review by [Georges, Kotliar, Krauth, and Rozenberg, Rev. Mod. Phys. 68, 13 (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13): a series of curves showing a half-filled, single-band Hubbard model on the Bethe lattice entering an antiferromagnetic phase as the temperature is lowered.

### Model

The lattice model solved self-consistently by DMFT is the single-band Hubbard model

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma},
$$

with nearest-neighbor hopping $t$, on-site interaction $U$, and chemical potential $\mu$ ($\mu=0$ at half filling by particle-hole symmetry). See [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) for the derivation of the DMFT mapping of this lattice model onto a self-consistent quantum impurity problem, and [Rubtsov, Savkin, and Lichtenstein (2005)](https://doi.org/10.1103/PhysRevB.72.035122) for the CT-INT algorithm used to solve the impurity problem here.

### Parameters

| Parameter | Meaning | Value(s) used |
| :-------- | :------ | :------------ |
| `U` | on-site interaction | $3$ |
| `t` | nearest-neighbor hopping (Bethe lattice half-bandwidth $D=2t$) | $0.707106781186547 = 1/\sqrt{2}$, so that $U=3D/\sqrt{2}$ as in Fig. 11 of Georges et al. |
| `BETA` | inverse temperature | $6, 8, 10, 12, 14, 16$ (short script: $6, 12$ only) |
| `MU` | chemical potential | $0$ (half filling) |
| `H`, `H_INIT` | quantization-axis field / symmetry-breaking seed field for the initial Weiss field | $0$ / $0.05$ |
| `FLAVORS` | number of spin flavors | $2$ |
| `ANTIFERROMAGNET` | enable the Néel (two-sublattice) self-consistency | $1$ |
| `SYMMETRIZATION` | enforce a paramagnetic solution | $0$ (we want to allow AFM order) |
| `N`, `NMATSUBARA` | imaginary-time / Matsubara discretization of $G$ and $G_0$ | $500$ |
| `OMEGA_LOOP` | run the self-consistency in Matsubara frequencies | $1$ |
| `MAX_IT`, `CONVERGED` | maximum self-consistency iterations / convergence threshold | $10$, $0.005$ (short); $18$, $0.003$ (long) |
| `SOLVER` | impurity solver | `"Interaction Expansion"` |
| `ALPHA` | shift of the auxiliary Ising field used in CT-INT to control the sign problem, see [Rubtsov et al. (2005)](https://doi.org/10.1103/PhysRevB.72.035122) | $-0.01$ |
| `HISTOGRAM_MEASUREMENT` | record a histogram of the perturbation order | $1$ |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | Monte Carlo sweep budget, thermalization sweeps, wall-clock cutoff per iteration (seconds) | $10^8$, $1000$, $10$ |

### Running the simulation

The files for this tutorial can be found in the directory `tutorials/dmft-03-interaction`. As in Tutorial 02, you can run the short script [`tutorial3.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3.py), reproducing 2 of the 6 curves (runtime: roughly 10 minutes), or the long version [`tutorial3_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3_long.py), reproducing all 6 curves (runtime: roughly 30 minutes). CT-INT reaches a given statistical accuracy faster than CT-HYB in this weak-coupling regime, which is why `MAX_TIME` is set much lower here (10 seconds per iteration) than in Tutorial 02 (300 seconds).

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
              'ANTIFERROMAGNET'         : 1,
              'CONVERGED'               : 0.005,
              'FLAVORS'                 : 2,
              'H'                       : 0,
              'H_INIT'                  : 0.05,
              'MAX_IT'                  : 10,
              'MAX_TIME'                : 10,
              'MU'                      : 0,
              'N'                       : 500,
              'NMATSUBARA'              : 500,
              'OMEGA_LOOP'              : 1,
              'SEED'                    : 0,
              'SITES'                   : 1,
              'SOLVER'                  : 'Interaction Expansion',
              'SYMMETRIZATION'          : 0,
              'U'                       : 3,
              't'                       : 0.707106781186547,
              'SWEEPS'                  : 100000000,
              'THERMALIZATION'          : 1000,
              'ALPHA'                   : -0.01,
              'HISTOGRAM_MEASUREMENT'   : 1,
              'BETA'                    : b
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

Internally, `pyalps.runDMFT` invokes the `dmft` application directly on the generated parameter file, once per iteration:

```
/path-to-alps-installation/bin/dmft parm_beta_6.0
/path-to-alps-installation/bin/dmft parm_beta_12.0
```

Unlike the finite-lattice ALPS applications, the `dmft` code reads the plain-text parameter file directly (no `parameter2xml` preprocessing step is needed).

### The parameter file

The input file `parm_beta_6.0` produced by the script above, with comments added, reads:

```
H_INIT = 0.05                        // seed field for the initial Weiss field, breaks the up/down symmetry
ANTIFERROMAGNET = 1                  // allow Neel order; meaningful for bipartite lattices in single-site DMFT
SEED = 0                             // Monte Carlo random number seed
CONVERGED = 0.005                    // convergence criterion for the self-consistency iteration
MAX_IT = 10                          // maximum number of self-consistency iterations
SWEEPS = 100000000                   // upper bound on sweeps; in practice MAX_TIME stops the run first
FLAVORS = 2                          // flavors 0 and 1 correspond to spin up and down
SYMMETRIZATION = 0                   // paramagnetic self-consistency is NOT enforced (we want AFM order)
NMATSUBARA = 500                     // cutoff for Matsubara frequencies
H = 0                                // magnetic field along the quantization axis
OMEGA_LOOP = 1                       // self-consistency runs in Matsubara frequencies
SITES = 1                            // one impurity site, as in single-site DMFT
N = 500                              // discretization of the imaginary-time Green's function
BETA = 6.0                           // inverse temperature
U = 3                                // interaction strength
MAX_TIME = 10                        // wall-clock time limit per iteration (seconds)
ALPHA = -0.01                        // shift of the auxiliary Ising field (CT-INT sign-problem control)
HISTOGRAM_MEASUREMENT = 1            // record a histogram of the CT-INT perturbation order
SOLVER = "Interaction Expansion"     // the CT-INT solver
THERMALIZATION = 1000                // thermalization sweeps
MU = 0                               // chemical potential; MU=0 is half filling for particle-hole symmetric models
t = 0.707106781187                   // hopping; for the Bethe lattice considered here $W=2D=4t$
```

As in Tutorial 02, there is no parameter specifying the lattice or band structure: a Bethe lattice is assumed by default (see [DMFT-08 Lattices](../dmft08) for other choices), and no `G0OMEGA_INPUT`/`G0TAU_INPUT` is given, so the initial Weiss field is computed from the non-interacting Green's function using `H_INIT`.

### Lattice

Single-site DMFT maps the lattice problem onto a self-consistently determined quantum impurity coupled to a Weiss field; no finite cluster is diagonalized directly. Here the lattice entering the self-consistency is the Bethe lattice in the limit of infinite coordination number $z\to\infty$, with the hopping rescaled as $t=t^*/\sqrt{z}$ so that the density of states stays finite; this recovers a semicircular density of states of half-bandwidth $D=2t^*$, which the DMFT self-consistency evaluates analytically (`OMEGA_LOOP=1` without a `DOSFILE`). Each site carries the same on-site interaction $U$; every bond carries the same (rescaled) hopping $t$:

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

The Bethe lattice is the standard choice for introductory single-site DMFT because its semicircular density of states admits a closed-form self-consistency relation, avoiding the k-space integral needed for other lattices (see [DMFT-08 Lattices](../dmft08) and the [ALPS lattice library](../../../documentation/intro/latticehowtos) for simulations built on explicit finite lattices).

### Method choice

CT-INT and CT-HYB solve the same impurity problem with different diagrammatic expansions, and comparing them is a useful cross-check of solver-independent DMFT physics. CT-HYB (Tutorial 02) expands in the hybridization and works best at strong coupling, where the average perturbation order stays moderate even at large $U$. CT-INT expands in $U$ instead; its average perturbation order grows roughly linearly with $\beta U$, so it is most efficient in the weak-to-moderate coupling regime studied here ($U=3D/\sqrt{2}$). The impurity itself is trivial to diagonalize (a single site with `FLAVORS=2` has only $2^2=4$ local states: empty, singly occupied up, singly occupied down, and doubly occupied); the computational cost lies entirely in the stochastic sampling of the perturbation series, not in an exact-diagonalization step. This is why `MAX_TIME` can be set much lower than for CT-HYB (10 s vs. 300 s per iteration) while still resolving the transition.

### Output data and plots

Evaluation proceeds exactly as in [DMFT-02 Hybridization](../dmft02), using [`tutorial3eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3eval.py) (identical in structure to `tutorial2eval.py`). First, the imaginary-time Green's function for both flavors, directly appended to `tutorial3.py`:

```
listobs=['0', '1']   # we will plot both flavors 0 and 1

data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-03: Neel transition for the Hubbard model on the Bethe lattice\n(using the Interaction expansion impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

The occupation of flavor 0, $n_0=-G_0(\tau=\beta^-)$, versus $\beta$ (part of `tutorial3eval.py`):

```
listobs=['0']
res_files = pyalps.getResultFiles(pattern='parm_*.h5')

data_G_tau = pyalps.loadMeasurements(res_files, respath='/simulation/results/G_tau', what=listobs, verbose=False)

print("Occupation in the last iteration at flavor=0")
for d in pyalps.flatten(data_G_tau):
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
```

The same script also reproduces the iteration-resolved convergence plots and the Matsubara-frequency Green's function and self-energy plots described in detail in [DMFT-02 Hybridization](../dmft02#checking-convergence); the code is unchanged apart from the solver used to produce the underlying `.h5` files, since both solvers write results into the same ALPS output schema.

Because this is a stochastic Monte Carlo simulation, the actual numbers you obtain depend on `SEED`, `MAX_TIME`, and machine speed; running the short script should reproduce the qualitative feature of Fig. 11: at $\beta=6$ the two flavors of $G(\tau)$ nearly coincide (paramagnetic, metallic), while at $\beta=12$ they separate visibly (antiferromagnetic order has set in), matching the trend already seen with CT-HYB in Tutorial 02.

### Summary and outlook

Reproducing the same Néel transition with an independent impurity solver — CT-INT here, CT-HYB in Tutorial 02 — cross-validates that the transition is a property of the DMFT self-consistency and lattice model, not an artifact of a particular Monte Carlo algorithm.

1. At fixed `MAX_TIME`, which solver gives smaller error bars on $G(\tau)$ at $\beta=12$: CT-INT or CT-HYB? How does the answer change if you increase $U$ towards the Mott transition studied in [DMFT-04 Mott](../dmft04)?
2. Plot the perturbation-order histogram written out because of `HISTOGRAM_MEASUREMENT=1`, and check how its mean scales with $\beta$ and $U$.
3. Try varying `ALPHA`: does moving it away from $-0.01$ toward $0$ change the severity of the sign problem at low temperature?
4. [DMFT-09 Néel Transition](../dmft09) combines this CT-INT run with the CT-HYB (Tutorial 02) and Hirsch-Fye (Tutorial 07) results in a single comparison — try reproducing that comparison yourself.
