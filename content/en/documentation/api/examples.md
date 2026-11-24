
---
title: Measurement Examples
linkTitle: Examples
math: true
toc: true
weight: 4
---

This page lists the physical quantities that each ALPS application measures, and shows complete scripts that go from running a simulation to loading the data, extracting the quantities of interest, and plotting them.
Every script on this page was run with ALPS 3.0.0, and the figures are the output of these scripts.

All examples follow the same four steps:

1. **Run**: write the parameters with [`pyalps.writeInputFiles`](../runapp) and start the application with [`pyalps.runApplication`](../runapp).
2. **Load**: read the results with one of the [loading functions](../loadat). Which one depends on the method (see the table below).
3. **Extract**: pick observables by name and, if needed, turn them into curves with [`pyalps.collectXY`](../eval) or into NumPy arrays.
4. **Plot**: with [`pyalps.plot.plot`](../eval) or directly with matplotlib.

## Available measurements

Observable names are exact strings: `pyalps.loadMeasurements(files, 'Sz Correlations')` silently returns an empty list if no observable has that name.
The names below are the ones the applications write.

### Overview

| Method (application) | Thermodynamics | Correlations, structure factor, Green function | Loading function |
|---|---|---|---|
| Classical Monte Carlo (`spinmc`) | energy, magnetization, susceptibility; specific heat and Binder cumulant after `pyalps.evaluateSpinMC` | — | `loadMeasurements` |
| QMC, loop algorithm (`loop`) | energy, specific heat, (staggered) magnetization and susceptibility, Binder ratios, stiffness | spin correlations, structure factor, Green function (fails in 3.0.0, see [known issues](#known-issues-in-alps-300)) | `loadMeasurements` |
| QMC, directed loops (`dirloop_sse`) | energy, kinetic energy, (staggered) magnetization, susceptibility, stiffness; density for particle models | spin or density correlations, structure factor, Green function (with caveats, see [known issues](#known-issues-in-alps-300)) | `loadMeasurements` |
| QMC, worm algorithm (`worm`) | energy, density, stiffness, winding number, charge order | density correlations, structure factor, Green function | `loadMeasurements` |
| Quantum Wang–Landau (`qwl`) | energy, free energy, entropy, specific heat, susceptibility, as continuous functions of $T$ | uniform and staggered structure factor | `evaluateQWL` |
| Full diagonalization (`fulldiag`) | energy, free energy, entropy, specific heat, susceptibility, magnetization versus $T$ or $h$ | custom `MEASURE_*` per eigenstate | `evaluateFulldiagVersusT`, `evaluateFulldiagVersusH`, `loadSpectra`, `loadEigenstateMeasurements` |
| Sparse diagonalization (`sparsediag`) | energies of low-lying states | custom `MEASURE_*` per eigenstate | `loadEigenstateMeasurements`, `loadSpectra` |
| DMRG (`dmrg`) | ground- and excited-state energies, truncation error | custom `MEASURE_*` per eigenstate | `loadEigenstateMeasurements` |

In the QMC codes the correlations, structure factor and Green function are switched on with `MEASURE[Correlations]`, `MEASURE[Structure Factor]` and `MEASURE[Green Function]`.

### Monte Carlo applications

Scalar observables are always measured.
Vector observables (one value per site, distance, or wavevector) are only measured when the matching flag is set to `true`.

| Application | Scalar observables | Vector observables (flag) |
|---|---|---|
| `spinmc` (models `Ising`, `XY`, `Heisenberg`) | `Energy`, `Energy Density`, `Energy^2`, `\|Magnetization\|`, `Magnetization^2`, `Magnetization^4`, `\|Staggered Magnetization\|`, `Staggered Magnetization^2`, `Susceptibility`, `Magnetization along Field`, `Bond-type Energy`, `Cluster size`. After `pyalps.evaluateSpinMC`: `Specific Heat`, `Binder Cumulant`, `Binder Cumulant U2`, `Connected Susceptibility` | none |
| `loop` | `Energy`, `Energy Density`, `Specific Heat`, `Magnetization`, `\|Magnetization\|`, `Magnetization^2`, `Magnetization^4` (and `... Density` versions), `Susceptibility`, the same for `Staggered`, `Binder Ratio of Magnetization`, `Binder Ratio of Staggered Magnetization`, `Stiffness`, and `Generalized ...` versions | `Spin Correlations`, `Staggered Spin Correlations`, `Generalized Spin Correlations`, `Generalized Staggered Spin Correlations` (`MEASURE[Correlations]`); `Spin Structure Factor` (`MEASURE[Structure Factor]`); `Green's Function` (`MEASURE[Green Function]`) |
| `dirloop_sse`, spin models | `Energy`, `Energy Density`, `Kinetic Energy`, `Magnetization`, `\|Magnetization\|`, `Magnetization^2`, `Magnetization^4` (and `... Density` versions), the same for `Staggered`, `Susceptibility`, `Stiffness`, `n`, `n^2`, `n^3` (SSE expansion order) | `Spin Correlations` (`MEASURE[Correlations]`); `Spin Structure Factor` (`MEASURE[Structure Factor]`); `Green's Function` (`MEASURE[Green Function]`) |
| `dirloop_sse`, particle models | `Energy`, `Kinetic Energy`, `Density`, `Density^2`, `Checkerboard Charge Order` (and `^2`, `^4`), `Stiffness`, `n`, `n^2`, `n^3` | `Density Correlations` (`MEASURE[Correlations]`); `Density Structure Factor` (`MEASURE[Structure Factor]`); `Green's Function` (`MEASURE[Green Function]`) |
| `worm` (boson models) | `Energy`, `Energy Density`, `Density`, `Density^2`, `Stiffness`, `Winding number^2`, `Checkerboard Charge Order` (and `^2`, `^4`) | `Density Correlations` (`MEASURE[Correlations]`); `Density Structure Factor` (`MEASURE[Structure Factor]`); `Green's Function` (`MEASURE[Green Function]`) |

What the vector observables contain:

- `Spin Correlations`: $\langle S^z_0 S^z_{\mathbf{r}} \rangle$. The x-values are the displacements $\mathbf{r}$ from site 0 in lattice units, for example `[1 0]`.
- `Spin Structure Factor`: $S(\mathbf{q}) = \sum_{\mathbf{r}} e^{i\mathbf{q}\cdot\mathbf{r}} \langle S^z_0 S^z_{\mathbf{r}} \rangle$. The x-values are the wavevectors $\mathbf{q}$ allowed by the lattice, for example `[3.14159 3.14159]`.
- `Green's Function`: the equal-time off-diagonal correlation $\langle S^+_0 S^-_{\mathbf{r}} \rangle$ (for bosons $\langle b^\dagger_0 b_{\mathbf{r}} \rangle$), with the displacement $\mathbf{r}$ as x-value. This is a function of distance, not of imaginary time.
- `Density Correlations` and `Density Structure Factor`: the same for the particle density.

To see what a Monte Carlo result file contains, print the observable names:

```Python
import pyalps
files = pyalps.getResultFiles(prefix='parm')
print(sorted(pyalps.loadObservableList(files)[0]))
```

### Evaluation tools: qwl and fulldiag

`qwl` stores the coefficients of a high-temperature expansion and `fulldiag` stores the full spectrum.
Their evaluation functions turn these into thermodynamic quantities on a temperature grid (`T_MIN`, `T_MAX`, `DELTA_T`) and return one DataSet per quantity:

| Function | Quantities returned |
|---|---|
| `pyalps.evaluateQWL` | `Energy Density`, `Free Energy Density`, `Entropy Density`, `Specific Heat per Site`, `Uniform Susceptibility per Site`, `Uniform Structure Factor per Site`, `Staggered Structure Factor per Site` |
| `pyalps.evaluateFulldiagVersusT` | `Energy Density`, `Free Energy Density`, `Entropy Density`, `Specific Heat per Site`, `Uniform Susceptibility per Site`, `Magnetization per Site` |
| `pyalps.evaluateFulldiagVersusH` | the same quantities as a function of the magnetic field at fixed `T` |

`pyalps.loadSpectra` returns the eigenvalues of each symmetry sector of a `fulldiag` or `sparsediag` run.

### Custom measurements: sparsediag, fulldiag and dmrg

The diagonalization and DMRG codes measure the operators you name, built from the site operators of the model (for the spin model `Sz`, `Splus`, `Sminus`) and bond operators such as `exchange`.
You choose the observable name in the brackets:

| Parameter | Measures | Example |
|---|---|---|
| `MEASURE_AVERAGE[name]=op` | $\langle \sum_i \mathrm{op}_i \rangle$ | `MEASURE_AVERAGE[Magnetization]=Sz` |
| `MEASURE_LOCAL[name]=op` | $\langle \mathrm{op}_i \rangle$ for every site $i$ | `MEASURE_LOCAL[Local magnetization]=Sz` |
| `MEASURE_CORRELATIONS[name]=op` or `"op1:op2"` | $\langle \mathrm{op1}_i\, \mathrm{op2}_j \rangle$ for all site pairs | `MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"` |
| `MEASURE_STRUCTURE_FACTOR[name]=op` | the Fourier transform of the correlations of `op` | `MEASURE_STRUCTURE_FACTOR[Structure Factor S]=Sz` |

The results are loaded with `pyalps.loadEigenstateMeasurements`, which returns one value per eigenstate.
`Energy` is always included, and `dmrg` also writes `Truncation error`.
`dmrg` does not write `MEASURE_STRUCTURE_FACTOR` results; compute the structure factor from the correlations instead.

## Example 1: classical Monte Carlo, observables versus temperature

This example scans the temperature of the 2D Ising model for two system sizes and plots $\langle|M|\rangle$, the Binder cumulant $\langle M^4\rangle/\langle M^2\rangle^2$, and the specific heat.
`pyalps.collectXY` turns the scalar observables of many runs into one curve per system size.

```Python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

# 1. Run: 2D Ising model, two system sizes, temperatures around T_c = 2.269
parms = []
for L in [8, 16]:
    for T in [2.0, 2.1, 2.2, 2.25, 2.3, 2.35, 2.4, 2.5, 2.6]:
        parms.append({
            'LATTICE'        : "square lattice",
            'MODEL'          : "Ising",
            'J'              : 1.,
            'L'              : L,
            'T'              : T,
            'THERMALIZATION' : 5000,
            'SWEEPS'         : 50000,
        })
input_file = pyalps.writeInputFiles('ising', parms)
pyalps.runApplication('spinmc', input_file, Tmin=5)

# spinmc_evaluate adds derived quantities (Binder cumulant, specific heat, ...)
files = pyalps.getResultFiles(prefix='ising')
pyalps.evaluateSpinMC(files)

# 2. Load: list what is in the files, then load the observables of interest
print(sorted(pyalps.loadObservableList(files)[0]))
data = pyalps.loadMeasurements(files, ['|Magnetization|', 'Binder Cumulant', 'Specific Heat'])

# 3. Extract: one curve per system size, observable as a function of T
for obs in ['|Magnetization|', 'Binder Cumulant', 'Specific Heat']:
    curves = pyalps.collectXY(data, x='T', y=obs, foreach=['L'])
    for c in curves:
        c.props['label'] = 'L = %d' % c.props['L']
    # 4. Plot with error bars
    plt.figure()
    pyalps.plot.plot(curves)
    plt.xlabel('Temperature $T$')
    plt.ylabel(obs)
    plt.legend()
plt.show()
```

The script runs in about half a minute.
The Binder cumulants of the two sizes cross close to $T_c = 2.269$:

![](/figs/api_examples_ising.png)

## Example 2: quantum Monte Carlo, correlations and structure factor

Vector observables are loaded as one DataSet whose `x` holds the lattice vectors and whose `y` holds the values with error bars.
This example runs `dirloop_sse` for the $S=1/2$ Heisenberg antiferromagnet on an $8\times8$ lattice, plots the correlations against distance and shows the structure factor over the Brillouin zone.

```Python
import numpy as np
import pyalps
import matplotlib.pyplot as plt

# 1. Run: S=1/2 Heisenberg antiferromagnet on an 8x8 square lattice
L = 8
parms = [{
    'LATTICE'                   : "square lattice",
    'MODEL'                     : "spin",
    'local_S'                   : 0.5,
    'J'                         : 1,
    'L'                         : L,
    'T'                         : 0.3,
    'THERMALIZATION'            : 10000,
    'SWEEPS'                    : 100000,
    'MEASURE[Correlations]'     : True,
    'MEASURE[Structure Factor]' : True,
    'MEASURE[Green Function]'   : True,
}]
input_file = pyalps.writeInputFiles('heis', parms)
pyalps.runApplication('dirloop_sse', input_file, Tmin=5)
files = pyalps.getResultFiles(prefix='heis')

# 2. Load: vector observables come back as one DataSet each;
#    x holds one lattice vector per entry and y the values with errors
corr = pyalps.loadMeasurements(files, 'Spin Correlations')[0][0]
sq   = pyalps.loadMeasurements(files, 'Spin Structure Factor')[0][0]
gf   = pyalps.loadMeasurements(files, "Green's Function")[0][0]

# 3. Extract: x is the displacement (dx, dy) from site 0 in lattice units;
#    with periodic boundaries the distance uses the nearest image
d = np.minimum(corr.x, L - corr.x)
r = np.hypot(d[:, 0], d[:, 1])
C     = np.array([y.mean for y in corr.y])
C_err = np.array([y.error for y in corr.y])
G     = np.array([y.mean for y in gf.y])
G_err = np.array([y.error for y in gf.y])

# for the structure factor x is the wavevector (qx, qy)
S = np.array([y.mean for y in sq.y])
i = np.argmax(S)
print('S(q) is largest at q = %s: %s' % (sq.x[i], sq.y[i]))

# 4. Plot. On the bipartite lattice the correlations alternate in sign;
#    multiplying by (-1)^(dx+dy) makes them positive. For the isotropic
#    Heisenberg model at h = 0, |<S+_0 S-_r>| = 2 |<Sz_0 Sz_r>| for r > 0
stagger = (-1) ** (corr.x[:, 0] + corr.x[:, 1])
plt.figure()
plt.errorbar(r, stagger * C, C_err, fmt='o', label=r'$(-1)^{d_x+d_y} \langle S^z_0 S^z_r \rangle$')
plt.errorbar(r, np.abs(G) / 2, G_err / 2, fmt='s', mfc='none', label="|Green's Function| / 2")
plt.yscale('log')
plt.xlabel('distance $r$')
plt.ylabel('correlation')
plt.legend()
plt.tight_layout()

plt.figure(figsize=(4.8, 4))
qx, qy = sq.x[:, 0], sq.x[:, 1]
plt.scatter(qx / np.pi, qy / np.pi, c=S, s=250, marker='s', cmap='viridis')
plt.colorbar(label=r'$S(\mathbf{q})$')
plt.xlabel(r'$q_x/\pi$')
plt.ylabel(r'$q_y/\pi$')
plt.gca().set_aspect('equal')
plt.tight_layout()
plt.show()
```

The structure factor is largest at $\mathbf{q} = (\pi, \pi)$, about 3.7, the signature of antiferromagnetic (Néel) correlations.
The correlations alternate in sign with distance, and $|\langle S^+_0 S^-_r\rangle| = 2|\langle S^z_0 S^z_r\rangle|$ as required by spin-rotation symmetry:

![](/figs/api_examples_qmc.png)

For the same model on an 8-site chain, `Spin Correlations` and the magnitude of `Green's Function` agree with exact diagonalization within the error bars.
Only the magnitude is compared because in 3.0.0 the sign of `Green's Function` is wrong on an antiferromagnet (see [known issues](#known-issues-in-alps-300)).

## Example 3: thermodynamics from fulldiag and QWL

`fulldiag` and `qwl` produce whole temperature curves from one run.
This example computes the specific heat and uniform susceptibility of a 10-site Heisenberg chain with both methods.

```Python
import pyalps
import matplotlib.pyplot as plt

# 1. Run: S=1/2 Heisenberg chain with 10 sites, once with full diagonalization
#    and once with quantum Wang-Landau (QWL)
model = {
    'LATTICE' : "chain lattice",
    'MODEL'   : "spin",
    'local_S' : 0.5,
    'J'       : 1,
    'L'       : 10,
}
ed_input = pyalps.writeInputFiles('chain_ed', [dict(model, CONSERVED_QUANTUMNUMBERS='Sz')])
pyalps.runApplication('fulldiag', ed_input)
# QWL: CUTOFF bounds the expansion order (enough for T >= 0.05 here);
# more Wang-Landau stages are needed to converge the density of states
qwl_input = pyalps.writeInputFiles('chain_qwl', [dict(model, CUTOFF=200,
                                                      NUMBER_OF_WANG_LANDAU_STEPS=24)])
pyalps.runApplication('qwl', qwl_input, Tmin=5)

# 2. Load: both evaluation tools compute thermodynamics on a temperature grid
#    from the stored spectrum (fulldiag) or density of states (QWL) and return
#    one DataSet per quantity, already as a function of T
ed  = pyalps.evaluateFulldiagVersusT(pyalps.getResultFiles(prefix='chain_ed'),
                                     DELTA_T=0.05, T_MIN=0.05, T_MAX=3.0)
qwl = pyalps.evaluateQWL(pyalps.getResultFiles(prefix='chain_qwl'),
                         DELTA_T=0.05, T_MIN=0.05, T_MAX=3.0)

# 3. Extract: pick quantities by name
def select(data, name):
    return [s for s in pyalps.flatten(data) if s.props['observable'] == name]

# 4. Plot the two methods on top of each other
for name in ['Specific Heat per Site', 'Uniform Susceptibility per Site']:
    plt.figure()
    for data, label, style in [(ed, 'fulldiag', '-'), (qwl, 'QWL', 'o')]:
        for s in select(data, name):
            plt.plot(s.x, s.y, style, mfc='none', label=label)
    plt.xlabel('Temperature $T$')
    plt.ylabel(name)
    plt.legend()
plt.show()
```

The QWL run takes about three minutes.
The two methods agree to within about 1%:

![](/figs/api_examples_thermo.png)

`NUMBER_OF_WANG_LANDAU_STEPS=24` matters here.
With only `CUTOFF=500` set, the QWL energies above $T \approx 1$ were off by up to 40% in our tests.
Comparing with `fulldiag` on a small system is a good way to check the QWL settings.

## Example 4: DMRG, correlation functions and local observables

This example computes the ground states of a 32-site open Heisenberg chain in the $S^z_{\mathrm{total}} = 0$ and $1$ sectors.
It extracts the spin gap from the two energies, the correlations from one reference site, and the magnetization profile in the $S^z_{\mathrm{total}} = 1$ state.

```Python
import numpy as np
import pyalps
import matplotlib.pyplot as plt

# 1. Run: S=1/2 Heisenberg chain with open ends, ground states in the
#    Sz_total = 0 and Sz_total = 1 sectors. DMRG and the ED codes measure
#    whatever operators are named in MEASURE_* parameters
L = 32
parms = []
for sz in [0, 1]:
    parms.append({
        'LATTICE'                  : "open chain lattice",
        'MODEL'                    : "spin",
        'local_S'                  : 0.5,
        'J'                        : 1,
        'L'                        : L,
        'CONSERVED_QUANTUMNUMBERS' : 'N,Sz',
        'Sz_total'                 : sz,
        'SWEEPS'                   : 4,
        'MAXSTATES'                : 100,
        'NUMBER_EIGENVALUES'       : 1,
        'MEASURE_AVERAGE[Magnetization]'                      : 'Sz',
        'MEASURE_LOCAL[Local magnetization]'                  : 'Sz',
        'MEASURE_CORRELATIONS[Diagonal spin correlations]'    : 'Sz',
        'MEASURE_CORRELATIONS[Offdiagonal spin correlations]' : 'Splus:Sminus',
    })
input_file = pyalps.writeInputFiles('chain_dmrg', parms)
pyalps.runApplication('dmrg', input_file, writexml=True)

# 2. Load: one list of DataSets per sector; y[0] belongs to the ground state
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='chain_dmrg'))
sector = {}
for task in data:
    sz = int(task[0].props['Sz_total'])
    sector[sz] = {s.props['observable']: s for s in task}
    print('Sz_total = %d: E = %.6f' % (sz, sector[sz]['Energy'].y[0]))
print('spin gap E(1) - E(0) = %.4f' % (sector[1]['Energy'].y[0] - sector[0]['Energy'].y[0]))

# 3. Extract: for correlations x holds the site pair (i, j);
#    take pairs starting from a reference site away from the open ends
zz = sector[0]['Diagonal spin correlations']
pm = sector[0]['Offdiagonal spin correlations']
i0 = L // 4
def from_site(obs):
    pairs = np.array(obs.x)
    values = np.array(obs.y[0])
    keep = (pairs[:, 0] == i0) & (pairs[:, 1] > i0)
    return pairs[keep, 1] - i0, values[keep]
r, C_zz = from_site(zz)
r, C_pm = from_site(pm)

# local observables: x is the site index
mloc = sector[1]['Local magnetization']

# 4. Plot
plt.figure()
plt.loglog(r, np.abs(C_zz), 'o', label=r'$|\langle S^z_{i_0} S^z_{i_0+r} \rangle|$')
plt.loglog(r, np.abs(C_pm) / 2, 's', mfc='none', label=r'$|\langle S^+_{i_0} S^-_{i_0+r} \rangle| / 2$')
plt.xlabel('distance $r$')
plt.ylabel('correlation')
plt.legend()

plt.figure()
plt.plot(mloc.x, mloc.y[0], 'o-')
plt.xlabel('site $i$')
plt.ylabel(r'$\langle S^z_i \rangle$ ($S^z_{\mathrm{total}} = 1$)')
plt.show()
```

The script prints the spin gap $E(S^z{=}1) - E(S^z{=}0) = 0.118$ for $L = 32$.
The two correlation functions agree, as required by spin-rotation symmetry, and decay as a power law.
In the $S^z_{\mathrm{total}} = 1$ state the magnetization alternates and is largest near the open ends:

![](/figs/api_examples_dmrg.png)

On an 8-site open chain the DMRG correlations are identical to those from `sparsediag`.

## Known issues in ALPS 3.0.0

These problems affect the measurements on this page. Each item says what to do until a fix is released; the linked issues track the fixes, and the release notes list them.

- `loop` with `MEASURE[Green Function]=true`: the evaluation at the end of the run fails with `scalar - vector conflict in path: .../Green's Function/labels` and no result file is written. Measure the Green function with `dirloop_sse` instead ([ALPS #420](https://github.com/ALPSim/ALPS/issues/420)).
- `dirloop_sse` `Green's Function` is wrong in some configurations ([ALPS #390](https://github.com/ALPSim/ALPS/issues/390)). On an antiferromagnet the sign $(-1)^{r}$ is missing, so use the magnitudes, as in Example 2. With `SKIP` the values are `SKIP` times too large, and `RESTRICT_MEASUREMENTS` and, for soft-core bosons, `NO_WORMWEIGHT=1` also give wrong values: leave these parameters unset when you measure the Green function.
- `worm`: `pyalps.loadMeasurements(files)` without observable names returns an empty list because an internal observable (`Time interval`) cannot be read. Pass the names you need, for example `pyalps.loadMeasurements(files, ['Density', 'Stiffness'])` ([ALPS #421](https://github.com/ALPSim/ALPS/issues/421)).
- `fulldiag` with `MEASURE_CORRELATIONS` or `MEASURE_STRUCTURE_FACTOR`: `fulldiag_evaluate` (called by `evaluateFulldiagVersusT`) crashes. `MEASURE_AVERAGE` and `MEASURE_LOCAL` work. Run the thermodynamics and the correlations as separate jobs ([ALPS #422](https://github.com/ALPSim/ALPS/issues/422)).
- `dmrg` `MEASURE_CORRELATIONS` on periodic lattices and ladders gives wrong values ([ALPS #390](https://github.com/ALPSim/ALPS/issues/390)). On open chains, as in Example 4, the values match exact diagonalization.
- The evaluation functions (`evaluateSpinMC`, `evaluateQWL`, `evaluateFulldiagVersusT`, ...) only find their helper programs if `runApplication` was called earlier in the same Python session. In a separate analysis script, add the `bin` directory of the `pyalps` package to `PATH`. This is fixed after 3.0.0 by [ALPS #158](https://github.com/ALPSim/ALPS/pull/158).
