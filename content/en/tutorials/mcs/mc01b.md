
---
title: MC-01b Equilibration
math: true
toc: true
weight: 3
---

Every Monte Carlo simulation starts from some initial configuration — often a random or fully ordered state — that is far from equilibrium.
During the first phase of the run, the Markov chain relaxes towards the equilibrium distribution, and measurements taken during this *thermalization* period are biased by the choice of starting point.
They must be discarded before computing averages.
The number of sweeps needed for the system to lose memory of its initial state is set by the autocorrelation time (see [MC-01a](mc01a)); close to a phase transition, where correlations are long-ranged, thermalization can require many thousands of sweeps.

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
    'THERMALIZATION'  : 10000,
    'SWEEPS'          : 50000,
    }]
```

Write the parameters to an XML input file and run `spinmc`:

```Python
input_file = pyalps.writeInputFiles('parm1a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)
```

### Inspecting the time series

The most direct way to check equilibration is to plot the time series of a measured observable.
We load the magnetization time series from the output file and plot it:

```Python
files = pyalps.getResultFiles(prefix='parm1a')
ts_M = pyalps.loadTimeSeries(files[0], '|Magnetization|')

plt.plot(ts_M)
plt.xlabel('Monte Carlo sweep')
plt.ylabel('|Magnetization|')
plt.title('Magnetization time series')
plt.show()
```

Inspect the resulting plot: the observable should settle to a roughly stationary value after an initial transient.
If the time series is still drifting at the end of the run, or if it shows a clear trend in the early sweeps that extends well into the measurement phase, the thermalization period (`THERMALIZATION`) is too short and must be increased.

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

`pyalps.checkConvergence` tests whether the errors in the measured averages have stabilised.
It is used in the same way as `checkSteadyState`:

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')
data = pyalps.checkConvergence(data)
```

If the check fails, increase `SWEEPS` and rerun the simulation.

## Questions

- Shorten the `THERMALIZATION` period significantly (e.g. to 100 sweeps). Can you see the initial transient in the time series? Does `checkSteadyState` flag it?
- How does the required thermalization length change as you move away from the critical temperature? Try $T = 1.5$ and $T = 3.5$.
- Increase and decrease `SWEEPS` by a factor of ten. How do the error bars on the magnetization change? Does this match the expected $1/\sqrt{N}$ scaling?
- Why is it important to check both equilibration and convergence? Can a simulation pass one check and fail the other?
