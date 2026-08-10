
---
title: DMFT-09 Néel Transition
math: true
toc: true
---

## Néel transition in single site DMFT

In this example we reproduce Fig. 11 in the DMFT review by [Georges et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). The series of six curves shows how the system, a Hubbard model on the Bethe lattice with interaction $U=3D/\sqrt{2}$ at half filling, enters an antiferromagnetic phase upon cooling.

This tutorial merges [DMFT-02 Hybridization](../dmft02), [DMFT-03 Interaction](../dmft03), and [DMFT-07 Hirsch-Fye](../dmft07): the same physical point is solved with three algorithmically independent impurity solvers, and the results are compared directly on one plot.

### Model

As in Tutorials 02, 03, and 07, we solve the single-band Hubbard model

$$
\hat{H} = -t\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma}
$$

on the Bethe lattice at half filling ($\mu=0$), with $t=0.707106781186547=1/\sqrt{2}$ (half-bandwidth $D=2t=\sqrt{2}$) and $U=3$, so that $U=3D/\sqrt{2}$ as in [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). `ANTIFERROMAGNET=1` allows the Néel self-consistency, so cooling this point through a range of $\beta$ reproduces the metal-to-antiferromagnetic-insulator crossover of Fig. 11, independently of which impurity solver is used.

### Parameters

Full annotated parameter files for each solver are given in the corresponding tutorial; only the solver-differentiating settings are repeated here, at the common point $\beta=12$:

| Parameter | Meaning | CT-HYB ([DMFT-02](../dmft02)) | CT-INT ([DMFT-03](../dmft03)) | Hirsch-Fye ([DMFT-07](../dmft07)) |
| :-------- | :------ | :----------------------------- | :----------------------------- | :---------------------------------- |
| `SOLVER` | impurity solver | `"hybridization"` | `"Interaction Expansion"` | `"hirschfye"` |
| `N` | imaginary-time discretization | $250$ | $500$ | $16$ (small by construction, see [DMFT-07](../dmft07#method-choice)) |
| solver-specific | additional parameters | `N_MEAS`, `N_ORDER`, `SC_WRITE_DELTA` | `ALPHA`, `HISTOGRAM_MEASUREMENT` | `TOLERANCE` |
| shared | `U`, `t`, `BETA`, `MU`, `H`, `FLAVORS`, `ANTIFERROMAGNET`, `SYMMETRIZATION`, `NMATSUBARA`, `OMEGA_LOOP`, `SITES`, `SEED` | identical across all three solvers (see Model above) | | |

### Running the simulations

Each solver's short script writes `parm_beta_6.0` and `parm_beta_12.0` into its own tutorial directory and runs them:

```
cd tutorials/dmft-02-hybridization && python tutorial2.py    # CT-HYB
cd tutorials/dmft-03-interaction   && python tutorial3.py    # CT-INT
cd tutorials/dmft-07-hirschfye     && python tutorial7.py    # Hirsch-Fye
```

or, directly on the command line, once the parameter files have been written:

```
/path-to-alps-installation/bin/dmft tutorials/dmft-02-hybridization/parm_beta_12.0
/path-to-alps-installation/bin/dmft tutorials/dmft-03-interaction/parm_beta_12.0
/path-to-alps-installation/bin/dmft tutorials/dmft-07-hirschfye/parm_beta_12.0
```

See [DMFT-02](../dmft02#running-the-simulation), [DMFT-03](../dmft03#running-the-simulation), and [DMFT-07](../dmft07#running-the-simulation) for the full scripts and annotated parameter files.

### Lattice

All three solvers are run on the same Bethe lattice in the $z\to\infty$ limit used throughout this series, with hopping rescaled as $t=t^*/\sqrt{z}$ so that the semicircular density of states (half-bandwidth $D=2t$) is evaluated analytically in the self-consistency loop:

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

See [DMFT-08 Lattices](../dmft08) for running the same comparison on a different lattice.

### Method choice

CT-HYB, CT-INT, and Hirsch-Fye are built on unrelated approximations: CT-HYB expands in the hybridization and is most efficient at strong coupling; CT-INT expands in the interaction and is most efficient at weak-to-moderate coupling; Hirsch-Fye discretizes imaginary time into $N$ slices and carries a systematic $(\Delta\tau)^2$ bias that must be extrapolated away (see [DMFT-02](../dmft02), and the Method choice sections of [DMFT-03](../dmft03#method-choice) and [DMFT-07](../dmft07#method-choice), for the details of each). At $U=3D/\sqrt{2}$, none of these three algorithms is working in a regime that is obviously favorable or unfavorable for it, which makes this point a good place to cross-check them against each other: since the three solvers share no common systematic bias, any feature that appears in all three converged results — in particular, the antiferromagnetic splitting of $G(\tau)$ on cooling — must be a property of the physical model and the DMFT self-consistency, not an artifact of one particular Monte Carlo algorithm.

### Output data and plots

Rather than plotting each solver's result separately (as in Tutorials 02, 03, and 07), the point of this tutorial is to overlay all three on the same figure:

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

listobs = ['0']  # flavor 0

files = {
    'CT-HYB'     : 'tutorials/dmft-02-hybridization/parm_beta_12.0.h5',
    'CT-INT'     : 'tutorials/dmft-03-interaction/parm_beta_12.0.h5',
    'Hirsch-Fye' : 'tutorials/dmft-07-hirschfye/parm_beta_12.0.h5',
}

alldata = []
for solver, fname in files.items():
    data = pyalps.loadMeasurements([fname], respath='/simulation/results/G_tau', what=listobs, verbose=False)
    for d in pyalps.flatten(data):
        d.x = d.x*d.props["BETA"]/float(d.props["N"])
        d.props['label'] = solver
        alldata.append(d)

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-09: Neel transition at BETA=12, solver comparison')
pyalps.plot.plot(alldata)
plt.legend()
plt.show()
```

Because this compares three independent stochastic simulations, the actual numbers depend on `SEED`, `MAX_TIME`, and machine speed for each run, but the three curves should agree within their respective error bars — Hirsch-Fye's `N=16` discretization bias is visible relative to CT-HYB and CT-INT unless you extrapolate it as suggested in [DMFT-07](../dmft07#summary-and-outlook). You can rerun a solver from a partially converged solution rather than from scratch: copy the desired `G0omega_output` to a new filename and specify it via `G0OMEGA_INPUT` in the parameter file (or the corresponding python dictionary) before rerunning.

### Summary and outlook

Solving the same Néel transition with CT-HYB, CT-INT, and Hirsch-Fye and finding agreement between all three is a direct check that DMFT-02, DMFT-03, and DMFT-07 are converging to the same physics rather than to solver-specific artifacts.

1. Extend the combined plot above to all six values of $\beta$ (using `tutorial2_long.py`, `tutorial3_long.py`, and `tutorial7_long.py`) and reproduce the full Fig. 11 comparison, with all three solvers overlaid at each temperature.
2. At fixed wall-clock budget, which of the three solvers gives the smallest error bars at $\beta=12$? Does the ranking change at $\beta=6$, where the system is closer to the paramagnetic side?
3. Extrapolate the Hirsch-Fye result to $\Delta\tau\to0$ (see [DMFT-07](../dmft07#summary-and-outlook)) before including it in the combined plot. Does the extrapolated curve move noticeably closer to CT-HYB and CT-INT?
4. [DMFT-06](../dmft06) performs a similar cross-solver comparison, but in the paramagnetic metallic phase and against the numerically exact Exact Diagonalization/Hirsch-Fye benchmark of Fig. 15 in [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). Compare the two comparisons: is solver agreement easier to achieve in the paramagnetic metal of Tutorial 06 or in the antiferromagnetic phase studied here?
