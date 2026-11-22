
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

### Preparing and running the simulation in Python

The full script is available as <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01b-equilibration-and-convergence/tutorial1a.py" data-filename="tutorial1a.py" target="_blank" rel="noopener">`tutorial1a.py`</a>.
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

There is currently a bug with the code where depending on your version of scipy you may get an error message along the lines of this:\
AttributeError(f"Module 'scipy' has no attribute '{name}'"\)
AttributeError: Module 'scipy' has no attribute 'linspace'

you can fix this by running this instead of the regular import statements at the start of a run:
```Python
import scipy
import numpy as np

for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))

import matplotlib.pyplot as plt
import pyalps
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
For the parameters above (`THERMALIZATION=10000`), the time series already fluctuates around a stable mean with no visible drift, indicating that thermalization was sufficient:

![](/figs/mcs01btimeseries.png)

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

## Questions

Click on a question to show its answer; click again to hide it.

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">1. Shorten the <code>THERMALIZATION</code> period significantly (e.g. to 100 sweeps). Can you see the initial transient in the time series? Does <code>checkSteadyState</code> flag it?</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

Running the simulation with just 100 sweeps:
```Python
import pyalps
import matplotlib.pyplot as plt

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'THERMALIZATION'  : 100,
    'SWEEPS'          : 50000,
    }]

input_file = pyalps.writeInputFiles('your_file_name', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix = "your_file_name"),'|Magnetization|')
check = pyalps.checkSteadyState(data)

for dataset in check:
    print("Steady state check: ", dataset.props['checkSteadyState']['value'])

file = pyalps.getResultFiles(prefix = 'MC2')
timeseries = pyalps.loadTimeSeries(file[0], '|Magnetization|')

plt.figure()
plt.plot(timeseries)
plt.xlabel('Monte Carlo sweep')
plt.ylabel('|Magnetization|')
plt.title('Magnetization time series for Thermalization = 100')
plt.show()
```

Gives the output:
Steady state check:  False

`checkSteadyState` has flagged that the system has not reached steady state, which tells us that a `THERMALIZATION` of 100 is too short.

Loading the time series gives a graph that looks like this:
![](/figs/mc01b_q1_answergraph.png)

The transient isn't visible due to the large binning size in the time series. Try incrementing the amount of sweeps eg. 1000, 10000, 20000, as you increase the amount, the magnetization on the y axis should increase as the system has more time to reach equilibrium.
</div>
</details>

<!-- Please check the answer for the time series graph on this one  -->

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">2. How does the required thermalization length change as you move away from the critical temperature? Try: T = 1.5 and T = 3.5.</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">
As a first check, we can look at the time series and judge whether or not each run has reached equilibrium.

```Python
import scipy
import numpy as np

for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))

import matplotlib.pyplot as plt
import pyalps

temperature = [1.5, 3.5]
parms = []
for t in temperature:
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : t,
        'THERMALIZATION'  : 10000,
        'SWEEPS'          : 50000,
        })

inputfile = pyalps.writeInputFiles('your_file_name', parms)
pyalps.runApplication('spinmc', inputfile, Tmin = 1, writexml = True)

file = pyalps.getResultFiles(prefix = 'your_file_name')
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix = 'your_file_name'),"|Magnetization|")

check = pyalps.checkSteadyState(data)

for dataset in check:
    print(dataset.props["T"],": ", dataset.props["checkSteadyState"]["value"])

for dataset in check:
    print(dataset.props["T"], dataset.props["checkSteadyState"])

for n, run in enumerate(file):
    plt.figure()
    plt.plot(pyalps.loadTimeSeries(run, "|Magnetization|"))
    plt.xlabel('Monte Carlo sweep')
    plt.ylabel('|Magnetization|')
    plt.title(f'Magnetization time series for T= {temperature[n]}')
    plt.show()
```

![](/figs/mc01b_q2_T1.5.png)

![](/figs/mc01b_q2_T3.5.png)

It's hard to tell from these graphs whether the runs have equilibrated, so we run a steady state check:

Returns false/true for both temps for different runs, suggesting that `checkSteadyState` is not able to flag a difference in thermalization length. Theoretically, thermalization is slowest near $T_c$ and shorter as the temperature moves away from it.

<!-- Honestly not too sure about this one, I changed the cofidence interval a couple times and my results still vary.  -->

</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">3. Increase and decrease <code>SWEEPS</code> by a factor of ten. How do the error bars on the magnetization change? Does this match the expected 1/&radic;<i>N</i> scaling?. Try with T = 3.5 instead of the critical temperature since the error bars are difficult to estimate.</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

If the errors do follow the behavior of $\dfrac{1}{\sqrt{N}}$, then going from 50000 to 500000 can be expressed as $\dfrac{1}{\sqrt{10 \cdot N}}$, we can factor out a $\dfrac{1}{\sqrt{10}}$ to get $\dfrac{1}{\sqrt{10}}$ $\cdot$ $\dfrac{1}{\sqrt{N}}$ where $\dfrac{1}{\sqrt{N}}$ is equal to the error bars at 50000 sweeps.

Doing the same for 5000 sweeps gets us $\dfrac{1}{\sqrt{0.1}}$ $\cdot$ $\dfrac{1}{\sqrt{N}}$

Run this code to print out the magnetization and its error bars:

```Python
import pyalps

parms = []
for sweeps in [5000, 50000, 500000]:
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : 3.5,
        'THERMALIZATION'  : 500000,
        'SWEEPS'          : sweeps,
        })

input_file = pyalps.writeInputFiles('your_file_name', parms)
pyalps.runApplication("spinmc", input_file, Tmin=1, writexml = True)

data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix = "your_file_name"), "|Magnetization|")
for run in pyalps.flatten(data):
    print(run.props["SWEEPS"], ":", f" {run.y}")
```
For me, I got these outputs, but keep in mind you may get different values after each run: 
5000.0 :  [0.03884575486874983 +/- 0.001357728236855422]\
50000.0 :  [0.042212537059260286 +/- 0.0010698501214214465]\
500000.0 :  [0.04021483669215428 +/- 0.00034333970841256414]

The error bars for 50000 is +/- 0.0010698501214214465:\
Multiplying by $\dfrac{1}{\sqrt{0.1}}$ gives 0.0033831631387\
Multiplying by $\dfrac{1}{\sqrt{10}}$ gives 0.00033831631387

The error bars for 500000 sweeps are very similar to the predicted value, while we have underestimated the error bars for 5000 sweeps. 
To investigate this further, you can run a binning analysis on the 5000 sweeps run to get binned values like this:
[0.00034858 0.00048968 0.00068608 0.00095405 0.00130493 0.00174905 0.00222402]

you can see the values are still increasing and have yet to reach a plateau, so the errors for the 5000 sweep run are not the true error bars. The $\dfrac{1}{\sqrt{N}}$ behavior for the error bars only apply once the binning analysis reaches that plateau.

Note that the `Tmin` value can change your binning analysis since pyalps will check the amount of runs after each time increment. If you use the default value of `Tmin = 60` (this happens if you don't set a Tmin parameter), you can overshoot your binning analysis for 5000 sweeps.

</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">4.  Why is it important to check both equilibration and convergence? Can a simulation pass one check and fail the other?</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

To make sure your simulated results are not being affected by the initial state, and to make sure your errors are reliable and not skewed. 

For the second part of the question, run this code:
```Python
import scipy
import numpy as np

for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))

import matplotlib.pyplot as plt
import pyalps

parms = [{
    'LATTICE'         : "square lattice",
    'MODEL'           : "Ising",
    'L'               : 48,
    'J'               : 1.,
    'T'               : 2.269186,
    'THERMALIZATION'  : 100,
    'SWEEPS'          : 50000,
    }]

input_file = pyalps.writeInputFiles('your_input_file', parms)
pyapls.runApplication("spinmc", input_file, Tmin = 1, writexml = True)

data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix = 'your_input_file'),'|Magnetization|')

check = pyalps.checkSteadyState(data)
checkc = pyalps.checkConvergence(data)

for dataset in check:
    print("Steady state check: ", dataset.props['checkSteadyState']['value'])

for dataset in checkc:
    print("Convergence checK: ", dataset.props['checkConvergence'])
```
Gives an output like this:\
Steady state check:  False\
Convergence check:  True

You may get both to be false and true since each simulation gives different results, but it can definitely fail one check and pass the other. Note that a system in steady state can still fluctuate, the mean can be constant, but the values don't have to be.
</div>
</details>