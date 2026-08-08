
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

The parameter file <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01b-equilibration-and-convergence/parm1a" download>`parm1a`</a> sets up a single simulation of the Ising model on a $48 \times 48$ square lattice at the critical temperature:

```
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=10000
SWEEPS=100000
UPDATE="local"
MODEL="Ising"
{L=48;}
```

Convert the parameter file to XML and run `spinmc`:

```
parameter2xml parm1a
spinmc --Tmin 10 --write-xml parm1a.in.xml
```

### Preparing and running the simulation in Python

The full script is available as <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01b-equilibration-and-convergence/tutorial1a.py" download>`tutorial1a.py`</a>.
It begins by importing the required modules and defining the simulation parameters:

```Python
import pyalps
import matplotlib.pyplot as plt

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'UPDATE'          : "local",
    'THERMALIZATION'  : 10000,
    'SWEEPS'          : 100000,
    }]
```

Write the parameters to an XML input file and run `spinmc`:

```Python
input_file = pyalps.writeInputFiles('parm1a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)
```

### How ALPS stores the time series

`pyalps.loadTimeSeries` does not return one value per sweep. ALPS keeps at most 128 bins, doubling the bin size as the run grows, and stores the **sum** over each bin — so this run's ~130,000 sweeps arrive as ~125 bins of 1024 sweeps each, with values a factor `bin_size` too large. Divide by the bin size, which is an HDF5 attribute on the dataset:

```Python
import h5py
import numpy as np

files = pyalps.getResultFiles(prefix='parm1a')

ts_M = np.array(pyalps.loadTimeSeries(files[0], '|Magnetization|'))
with h5py.File(files[0].replace('.xml', '.h5'), 'r') as f:
    bin_size = f['/simulation/results/|Magnetization|/timeseries/data'].attrs['binsize']
ts_M = ts_M / bin_size          # bin sums -> |M| per sweep
```

Plotting the raw array against its index instead labels the axis in bins while implying sweeps, understating the length of the run by three orders of magnitude.

### Inspecting the time series

Plot against the true sweep number and use the *running mean* — the average of all bins up to that point. Single bins fluctuate wildly, but the running mean of an equilibrated chain converges smoothly onto the final answer, while an unthermalized one stays biased for a long time.

```Python
sweep = 10000 + (np.arange(len(ts_M)) + 0.5) * bin_size   # 10000 = THERMALIZATION
running_mean = np.cumsum(ts_M) / np.arange(1, len(ts_M) + 1)

plt.plot(sweep, running_mean, lw=2.0, color='black')
plt.axhline(0.6240, ls='--', lw=1.4, color='0.55')
plt.xlabel('Monte Carlo sweep')
plt.ylabel('|M|')
plt.show()
```

![](/figs/mcs01btimeseries.png)

Each panel shows the running mean of $|M|$ for a different `THERMALIZATION`, with the dashed line marking the equilibrium value $|M| = 0.6240(16)$ measured from the thermalized runs. All three panels use the same bin size (512 sweeps) and the same ensemble of 62 `SEED` values, so `THERMALIZATION` is the only difference between them.

With `THERMALIZATION=0` the running mean starts near 0.70 — `spinmc` begins from an ordered configuration — and takes about 5000 sweeps to fall onto the dashed line. With 10000 or 20000 sweeps discarded there is no such decay: those panels sit on the line from the first measurement. Quantitatively, the first point departs from the run's own asymptote by $11\,\sigma$ at `THERMALIZATION=0`, against $0.5\,\sigma$ and $0.1\,\sigma$ for 10000 and 20000 — the remaining small wander there is noise in the running mean, not a transient. If the running mean is still drifting one way at the end of the run, increase `THERMALIZATION`.

{{< callout type="info" >}}
`spinmc` only checks whether it is finished at intervals set by `--Tmin`, so it overshoots `SWEEPS` — these runs recorded rather more than 100,000 measurements, and the overshoot varies from run to run. Harmless for statistics, but note that ALPS doubles its bin size as a run grows, so runs of different lengths can end up with *different* bin sizes. Check the `binsize` attribute before averaging several runs together.
{{< /callout >}}

### Automated check: `pyalps.checkSteadyState`

Rather than judging equilibration by eye, `pyalps.checkSteadyState` applies a statistical test to determine whether a time series has reached a stationary distribution.
It returns the data annotated with a flag indicating whether each observable has passed the test.
The default confidence level is 68.27% (one sigma); this can be raised:

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')

# Default: 68.27% confidence interval
data = pyalps.checkSteadyState(data)

# Stricter: 90% confidence interval
data = pyalps.checkSteadyState(data, confidenceInterval=0.9)
```

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

In practice, for this particular setup — the Ising model exactly at $T_c$ with **local** (single-spin-flip) updates — `checkConvergence` can keep failing even at many times the `SWEEPS` used above. This is *critical slowing down*: local-update autocorrelation times grow with system size near a critical point, so the run needs proportionally more sweeps for the binned error estimate to stabilize. Increasing `SWEEPS` further will eventually converge it, but a more efficient fix is to switch to a cluster algorithm (e.g. Wolff or Swendsen-Wang updates), which largely eliminates critical slowing down.

## Questions

- Shorten the `THERMALIZATION` period significantly (e.g. to 100 sweeps). Can you see the initial transient in the time series? Does `checkSteadyState` flag it?
- How does the required thermalization length change as you move away from the critical temperature? Try: $T=1.5$ and $T=3.5$.
- Increase and decrease `SWEEPS` by a factor of ten. How do the error bars on the magnetization change? Does this match the expected $1/\sqrt{N}$ scaling?
- Why is it important to check both equilibration and convergence? Can a simulation pass one check and fail the other?
