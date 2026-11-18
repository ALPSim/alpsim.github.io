
---
title: MC-01b Equilibration
math: true
toc: true
weight: 3
---

Every Monte Carlo simulation starts from some initial configuration — often a random or fully ordered state — that is far from equilibrium.
During the first phase of the run, the Markov chain relaxes towards the equilibrium distribution, and measurements taken during this *thermalization* period are biased by the choice of starting point.
They must be discarded before computing averages.
The number of sweeps needed for the system to lose memory of its initial state is set by the autocorrelation time (see [MC-01a](../mc01a)); close to a phase transition, where correlations are long-ranged, thermalization can require many thousands of sweeps.

This tutorial covers two related diagnostics:

- **Equilibration**: has the simulation left its initial state and reached the equilibrium distribution?
- **Convergence**: has the simulation run long enough that the statistical errors in the measured averages are acceptably small?

Both are checked by inspecting the time series of a measured observable — in this case the magnetization of a 2D Ising model at its critical temperature.

## Equilibration

### Preparing and running the simulation on the command line

The parameter file <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01b-equilibration-and-convergence/parm1a" data-filename="parm1a" target="_blank" rel="noopener">`parm1a`</a> sets up a single simulation of the Ising model on a $48 \times 48$ square lattice at the critical temperature:

```
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=10000
SWEEPS=50000
UPDATE="local"
MODEL="Ising"
{L=48;}
```

Convert the parameter file to XML and run `spinmc`:

```
parameter2xml parm1a
spinmc --Tmin 10 --write-xml parm1a.in.xml
```

To compare with cluster updates, a second parameter file `parm1b` is identical except for the update scheme:

```
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=10000
SWEEPS=50000
UPDATE="cluster"
MODEL="Ising"
{L=48;}
```

```
parameter2xml parm1b
spinmc --Tmin 10 --write-xml parm1b.in.xml
```

### Preparing and running the simulation in Python

The full script is available as <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01b-equilibration-and-convergence/tutorial1a.py" data-filename="tutorial1a.py" target="_blank" rel="noopener">`tutorial1a.py`</a>.
It begins by importing the required modules and defining the simulation parameters:

```Python
import pyalps
import numpy as np
import matplotlib.pyplot as plt

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'THERMALIZATION'  : 10000,
    'SWEEPS'          : 50000,
    'UPDATE'          : "local",
    }]

parms_cluster = [dict(parms[0], UPDATE="cluster")]
```

`UPDATE` selects local single-spin updates (`"local"`) or cluster updates (`"cluster"`).
If it is omitted, `spinmc` uses cluster updates, so we set it explicitly and define a second, otherwise identical, parameter set for a cluster-update run.

Write both parameter sets to XML input files and run `spinmc`:

```Python
input_file = pyalps.writeInputFiles('parm1a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)

input_file = pyalps.writeInputFiles('parm1b', parms_cluster)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)
```

`Tmin` is the minimum time in seconds between the scheduler's checks of whether a simulation has finished.
The simulation keeps measuring until the next check, so a run can contain more than `SWEEPS` measurements.
In our runs this gave about $1.5 \times 10^5$ measurements with local updates and $2.5 \times 10^5$ with cluster updates, which is why the time axes in the figures below extend beyond 50000 sweeps.

### Inspecting the time series

The most direct way to check equilibration is to plot the time series of a measured observable.
We load the magnetization time series of both runs and plot them.
ALPS does not store every single measurement in the time series: it keeps at most about 128 bins, and the bin size doubles as the run grows.
Each entry returned by `loadTimeSeries` is the *sum* of the measurements in one bin, so we divide by the bin size (a power of two, recovered here from the mean) to obtain $|M|$ per site, and place each point at the middle of its bin:

```Python
for prefix, update in [('parm1a', 'local'), ('parm1b', 'cluster')]:
    files = pyalps.getResultFiles(prefix=prefix)
    ts_M = np.array(pyalps.loadTimeSeries(files[0], '|Magnetization|'))
    M = pyalps.loadMeasurements(files, '|Magnetization|')[0][0].y[0].mean

    # each entry of ts_M is the sum of |M| per site over one bin of measurements
    binsize = 2 ** int(round(np.log2(ts_M.mean() / M)))
    sweeps = (np.arange(len(ts_M)) + 0.5) * binsize

    plt.figure()
    plt.plot(sweeps, ts_M / binsize, 'o-')
    plt.axhline(M, ls='--', color='gray', label='mean')
    plt.ylim(0, 1)
    plt.xlabel('Monte Carlo sweep')
    plt.ylabel('|Magnetization| per site')
    plt.title('T = T_c, %s updates (each point: mean over %d sweeps)' % (update, binsize))
    plt.legend()
plt.show()
```

Inspect the resulting plot: the observable should settle to a roughly stationary value after an initial transient.
If the time series is still drifting at the end of the run, or if it shows a clear trend in the early sweeps that extends well into the measurement phase, the thermalization period (`THERMALIZATION`) is too short and must be increased.
For the parameters above (`THERMALIZATION=10000`), both runs fluctuate around a stable mean with no visible drift, indicating that thermalization was sufficient.
The two time series nevertheless look very different:

![](/figs/mcs01btimeseries_local.png)

With local updates, $|M|$ still swings between about 0.3 and 0.7 even after averaging over 2048 sweeps.
This is not a failure to equilibrate — there is no drift — but *critical slowing down*: at $T_c$ the autocorrelation time of single-spin updates is hundreds of sweeps or more (see [MC-01a](../mc01a)).
Consecutive bins are therefore strongly correlated, and the run contains comparatively few independent samples.

![](/figs/mcs01btimeseries_cluster.png)

Cluster updates flip whole correlated clusters and decorrelate within a few steps, so the bin averages stay close to the mean, $\langle |M| \rangle \approx 0.62$.
Individual measurements still fluctuate strongly (a standard deviation of about 0.17 per measurement, a genuine critical fluctuation), but these fluctuations average out within each bin.
Both runs give the same mean within their error bars — in our runs $0.611 \pm 0.010$ with local updates and $0.622 \pm 0.001$ with cluster updates — but the cluster-update error bar is more than ten times smaller.

### Automated check: `pyalps.checkSteadyState`

Rather than judging equilibration by eye, `pyalps.checkSteadyState` tests the time series for a linear drift.
It fits a straight line to the time series and passes if the fitted slope is compatible with zero, i.e. if $|\text{slope}| / \sigma_\text{slope} < z_0$, where $z_0$ is the two-sided normal quantile for the chosen `confidenceInterval`.
It returns the data annotated with a flag indicating whether each observable has passed the test.
The default `confidenceInterval` is 68.27%, giving $z_0 = 1$ (one sigma).
Raising it widens the acceptance region (90% gives $z_0 \approx 1.64$), so a larger value makes the check *more lenient*, not stricter.
This describes pyalps after [ALPS #159](https://github.com/ALPSim/ALPS/pull/159); in pyalps 3.0.0 and earlier the cutoff used the complementary level, $z_0 = \Phi^{-1}(1 - \texttt{confidenceInterval}/2)$ (about 0.41 at the default and 0.13 at 90%), so there a larger value made the check stricter:

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')

# Default: 68.27%, passes if |slope| < 1.0 sigma
data = pyalps.checkSteadyState(data)

# More lenient: 90%, passes if |slope| < 1.64 sigma
data = pyalps.checkSteadyState(data, confidenceInterval=0.9)
```

Passing this check does not prove equilibration: it only detects a linear trend, so autocorrelation and a chain stuck in one region of configuration space have to be inspected separately, for example with the time-series plots above.

## Convergence

Convergence is a separate question from equilibration: even after the system has fully equilibrated, the statistical errors in the measured averages decrease only as $1/\sqrt{N}$ with the number of independent samples $N$.
A convergence check verifies that the simulation has accumulated enough measurements for the error estimates to be reliable and stable.

`pyalps.checkConvergence` tests whether the errors in the measured averages have stabilized.
It is used in the same way as `checkSteadyState`:

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')
data = pyalps.checkConvergence(data)
```

If the check fails, increase `SWEEPS` and rerun the simulation.

## Questions

- Shorten the `THERMALIZATION` period significantly (e.g. to 100 sweeps). Can you see the initial transient in the time series? Does `checkSteadyState` flag it?
- How does the required thermalization length change as you move away from the critical temperature? Try: $T=1.5$ and $T=3.5$.
- Increase and decrease `SWEEPS` by a factor of ten. How do the error bars on the magnetization change? Does this match the expected $1/\sqrt{N}$ scaling?
- Why is it important to check both equilibration and convergence? Can a simulation pass one check and fail the other?
