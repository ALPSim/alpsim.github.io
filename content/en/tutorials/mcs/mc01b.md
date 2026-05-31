
---
title: MC-01b Equilibration
math: true
toc: true
weight: 3
---

Before trusting any Monte Carlo result, the simulation must have *equilibrated*: it must have forgotten its starting configuration and be sampling from the correct stationary distribution.
Measurements taken before equilibration are biased and should be discarded.
The initial discarded phase is called *thermalization* or *burn-in*.

This tutorial shows how to detect whether a simulation has equilibrated by inspecting the time series of an observable, and how to use the ALPS tools `checkSteadyState` and `checkConvergence` to automate the check.

## Equilibration

We simulate the 2D Ising model on a $48 \times 48$ square lattice at the critical temperature $T_c = 2.269186$ using local updates, with 10000 thermalization steps and 50000 measurement sweeps.

#### Setting up and running on the command line

Download <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01b-equilibration-and-convergence/parm1a" download>`parm1a`</a>:

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

Convert and run:

```
parameter2xml parm1a
spinmc --Tmin 10 --write-xml parm1a.in.xml
```

#### Setting up and running in Python

The script <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01b-equilibration-and-convergence/tutorial1a.py" download>`tutorial1a.py`</a> sets up and runs the same simulation:

```Python
import pyalps
import matplotlib.pyplot as plt

parms = [{
    'LATTICE'        : "square lattice",
    'MODEL'          : "Ising",
    'L'              : 48,
    'J'              : 1,
    'T'              : 2.269186,
    'THERMALIZATION' : 10000,
    'SWEEPS'         : 50000,
    'UPDATE'         : "local",
}]

input_file = pyalps.writeInputFiles('parm1a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)
```

#### Checking equilibration via the time series

The most direct way to check equilibration is to plot the time series of an observable.
A well-equilibrated simulation shows a time series that fluctuates around a stable mean without any visible drift:

```Python
files = pyalps.getResultFiles(prefix='parm1a')
ts_M  = pyalps.loadTimeSeries(files[0], '|Magnetization|')

plt.figure()
plt.xlabel('Monte Carlo step')
plt.ylabel('|Magnetization|')
plt.plot(ts_M)
plt.show()
```

If the time series shows a systematic drift at the beginning, `THERMALIZATION` should be increased until the drift disappears before the measurement phase begins.

#### Automated check with `checkSteadyState`

ALPS provides `pyalps.checkSteadyState` to test statistically whether an observable has reached a steady state.
It checks whether the mean in the first half of the time series is consistent with the mean in the second half, using the specified confidence interval (default 68.27%):

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')
data = pyalps.checkSteadyState(data)
```

For a stricter test use a higher confidence interval:

```Python
data = pyalps.checkSteadyState(data, confidenceInterval=0.9)
```

The function prints a warning for any observable that has not reached steady state, so you do not need to inspect the time series by eye for every run.

## Convergence of error estimates

Even after equilibration, the statistical error on a measurement depends on how many independent samples were collected.
Because consecutive measurements are correlated (see MC-01a), the effective number of independent samples is smaller than the raw number of sweeps.
The error estimate converges to its true value only once the simulation is long enough that the autocorrelation time is well resolved.

`pyalps.checkConvergence` runs a binning analysis (see MC-01a) and reports whether the error estimate has converged:

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')
data = pyalps.checkConvergence(data)
```

If the error has not converged, increase `SWEEPS` and re-run.
At the critical temperature with local updates, very long runs may be required for large system sizes — this is the critical slowing-down problem addressed in MC-01a by switching to cluster updates.

## Questions

- Plot the time series of `|Magnetization|` and `Energy`. Do both appear equilibrated within the first 10000 steps?
- What happens to the time series if you start the simulation from a fully ordered (all spins up) initial configuration? How does the equilibration behavior change?
- Try reducing `THERMALIZATION` to 100 and check whether `checkSteadyState` raises a warning.
- Does `checkConvergence` report that the errors have converged with 50000 sweeps? How many sweeps are needed for convergence at this system size and temperature?
