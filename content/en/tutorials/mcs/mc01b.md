
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
If it is omitted, `spinmc` uses cluster updates for unfrustrated models such as this Ising model, so we set it explicitly and define a second, otherwise identical, parameter set for a cluster-update run.
Note what the step counts mean: with local updates one step is a sweep over all sites, but with cluster updates `SWEEPS` counts single Wolff cluster flips (one measurement each), while `THERMALIZATION` counts sweeps for local updates and the summed cluster size divided by the number of sites for cluster updates.

Write both parameter sets to XML input files and run `spinmc`:

```Python
input_file = pyalps.writeInputFiles('parm1a', parms)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)

input_file = pyalps.writeInputFiles('parm1b', parms_cluster)
pyalps.runApplication('spinmc', input_file, Tmin=10, writexml=True)
```

`Tmin` is the minimum time in seconds between the scheduler's checks of whether a simulation has finished.
With ALPS 3.0.0 the simulation keeps measuring until the next check, so a run can contain more than `SWEEPS` measurements; the ALPS master branch stops after exactly `SWEEPS`.
In our runs, made with ALPS 3.0.0, this gave about $1.5 \times 10^5$ measurements with local updates and $2.5 \times 10^5$ with cluster updates, which is why the time axes in the figures below extend beyond 50000 steps.

### Inspecting the time series

The most direct way to check equilibration is to plot the time series of a measured observable.
We load the magnetization time series of both runs and plot them.
Each point is the average of $|M|$ over one bin of consecutive measurements:

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
    # spinmc counts one step as a full sweep for local updates,
    # but as a single Wolff cluster flip for cluster updates
    unit = 'sweeps' if update == 'local' else 'cluster updates'
    plt.xlabel('Monte Carlo ' + unit)
    plt.ylabel('|Magnetization| per site')
    plt.title('T = T_c, %s updates (each point: mean over %d %s)' % (update, binsize, unit))
    plt.legend()
plt.show()
```

{{< callout type="info" >}}
**How the time series is stored.** ALPS does not store every single measurement in the time series: it keeps at most about 128 bins, and the bin size doubles as the run grows.
Each entry returned by `loadTimeSeries` is the *sum* of the measurements in one bin, so the script divides by the bin size (a power of two, recovered here from the mean) to obtain $|M|$ per site, and places each point at the middle of its bin.
{{< /callout >}}

Inspect the resulting plot: the observable should settle to a roughly stationary value after an initial transient.
If the time series is still drifting at the end of the run, or if it shows a clear trend in the early sweeps that extends well into the measurement phase, the thermalization period (`THERMALIZATION`) is too short and must be increased.
For the parameters above (`THERMALIZATION=10000`), both runs fluctuate around a stable mean with no visible drift, indicating that thermalization was sufficient.
The two time series nevertheless look very different:

![](/figs/mcs01btimeseries_local.png)

With local updates, $|M|$ still swings between about 0.3 and 0.7 even after averaging over 2048 sweeps.
This is not a failure to equilibrate — there is no drift — but *critical slowing down*: at $T_c$ the autocorrelation time of single-spin updates is hundreds of sweeps or more (see [MC-01a](../mc01a)).
Consecutive bins are therefore strongly correlated, and the run contains comparatively few independent samples.

![](/figs/mcs01btimeseries_cluster.png)

Cluster updates flip whole correlated clusters and decorrelate within a few cluster updates, so the bin averages stay close to the mean, $\langle |M| \rangle \approx 0.62$.
Individual measurements still fluctuate strongly (a standard deviation of about 0.17 per measurement, a genuine critical fluctuation), but these fluctuations average out within each bin.
Both runs give the same mean within their error bars — in our runs $0.611 \pm 0.010$ with local updates and $0.622 \pm 0.001$ with cluster updates — but the cluster-update error bar is more than ten times smaller.

### Automated check: `pyalps.checkSteadyState`

Rather than judging equilibration by eye, `pyalps.checkSteadyState` tests the time series for a linear drift.
It fits a straight line to the time series and passes if the fitted slope is compatible with zero, i.e. if $|\text{slope}| / \sigma_\text{slope} < z_0$, where $z_0$ is the two-sided normal quantile for the chosen `confidenceInterval`.
It returns the data annotated with a flag indicating whether each observable has passed the test.
The default `confidenceInterval` is 68.27%, giving $z_0 = 1$ (one sigma).
Raising it widens the acceptance region (90% gives $z_0 \approx 1.64$), so a larger value makes the check *more lenient*, not stricter.
In pyalps 3.0.0 and earlier the cutoff used the complementary level, $z_0 = \Phi^{-1}(1 - \texttt{confidenceInterval}/2)$ (about 0.41 at the default and 0.13 at 90%), so there a larger value made the check stricter:

```Python
data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm1a'), '|Magnetization|')

# Default: 68.27%, passes if |slope| < 1.0 sigma
data = pyalps.checkSteadyState(data)

# More lenient: 90%, passes if |slope| < 1.64 sigma
data = pyalps.checkSteadyState(data, confidenceInterval=0.9)
```

Passing this check does not prove equilibration: it only detects a linear trend, so autocorrelation and a chain stuck in one region of configuration space have to be inspected separately, for example with the time-series plots above.

{{< callout type="warning" >}}
**pyalps 3.0.0 and SciPy.** `checkSteadyState` in pyalps 3.0.0 calls `scipy.linspace`, which newer SciPy releases no longer provide, so it fails with `AttributeError: Module 'scipy' has no attribute 'linspace'`.
This is fixed in the ALPS master branch. Until the fix is released, run the following before importing pyalps:

```Python
# pyalps 3.0.0 only: restore the NumPy aliases that newer SciPy releases removed
import scipy
import numpy as np

for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))
```
{{< /callout >}}

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

Use local updates, as in `parm1a`: cluster updates thermalize within a few updates, so 100 steps of thermalization would be plenty for them.

```Python
# pyalps 3.0.0 only: see the SciPy note in the checkSteadyState section
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
    'UPDATE'          : "local",
    }]

input_file = pyalps.writeInputFiles('mc01b_q1', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

files = pyalps.getResultFiles(prefix='mc01b_q1')
data = pyalps.loadMeasurements(files, '|Magnetization|')
for dataset in pyalps.checkSteadyState(data):
    print('Steady state check:', dataset.props['checkSteadyState']['value'])

# each time-series entry is the sum of |M| per site over one bin of measurements
ts_M = np.array(pyalps.loadTimeSeries(files[0], '|Magnetization|'))
M = data[0][0].y[0].mean
binsize = 2 ** int(round(np.log2(ts_M.mean() / M)))
sweeps = (np.arange(len(ts_M)) + 0.5) * binsize

plt.figure()
plt.plot(sweeps, ts_M / binsize, 'o-')
plt.axhline(M, ls='--', color='gray', label='mean')
plt.ylim(0, 1)
plt.xlabel('Monte Carlo sweeps after thermalization')
plt.ylabel('|Magnetization| per site')
plt.title('T = T_c, THERMALIZATION = 100 (each point: mean over %d sweeps)' % binsize)
plt.legend()
plt.show()
```

![](/figs/mc01b_q1_answergraph.png)

No initial transient is visible, for three reasons:

- Measurements only start after the thermalization phase, so the first 100 sweeps never appear in the time series.
- Each point is the mean over a bin of 1024 sweeps (see *How the time series is stored* above), so anything that happens within the first thousand sweeps is averaged into the first point.
- `spinmc` starts with all spins up. At $T_c$ the magnetization relaxes from that state within roughly the first thousand sweeps (see the figure in question 2), which again falls inside the first point.

The deep dips are not a transient either: they are the slow critical fluctuations of local updates at $T_c$ (critical slowing down, see [MC-01a](../mc01a)).
To see the transient itself, set `THERMALIZATION` to 0 and use fewer `SWEEPS`, so that the bins are short, as in question 2.

In our run `checkSteadyState` printed `False`, but that does not tell you that 100 sweeps were too few.
With pyalps 3.0.0 the default cutoff is $|\text{slope}| / \sigma_\text{slope} < 0.41$ (see the `checkSteadyState` section above), so even a well-equilibrated run fails most of the time, as question 4 shows.
Passing the check does not prove equilibration either, since it only detects a linear drift.
Always look at the time series as well.
</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">2. How does the required thermalization length change as you move away from the critical temperature? Try: T = 1.5 and T = 3.5.</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

Run without any thermalization at $T = 1.5$, $T_c$ and $T = 3.5$, and watch how long the magnetization takes to settle.
A short run keeps the bins short, so the start of the relaxation stays visible:

```Python
import numpy as np
import matplotlib.pyplot as plt
import pyalps

temperatures = [1.5, 2.269186, 3.5]
parms = []
for t in temperatures:
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : t,
        'THERMALIZATION'  : 0,
        'SWEEPS'          : 1000,
        'UPDATE'          : "local",
        })

input_file = pyalps.writeInputFiles('mc01b_q2', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

plt.figure()
for f in pyalps.getResultFiles(prefix='mc01b_q2'):
    data = pyalps.loadMeasurements([f], '|Magnetization|')[0][0]
    ts_M = np.array(pyalps.loadTimeSeries(f, '|Magnetization|'))
    # each time-series entry is the sum of |M| per site over one bin of measurements
    binsize = 2 ** int(round(np.log2(ts_M.mean() / data.y[0].mean)))
    sweeps = (np.arange(len(ts_M)) + 0.5) * binsize
    # label each curve from the run's own parameters: result files are not in parms order
    plt.plot(sweeps, ts_M / binsize, 'o-', markersize=3, label='T = %g' % data.props['T'])
plt.ylim(0, 1.05)
plt.xlabel('Monte Carlo sweeps (no thermalization)')
plt.ylabel('|Magnetization| per site')
plt.title('Relaxation from the initial state, local updates')
plt.legend(loc='center right')
plt.show()
```

With ALPS 3.0.0, which produced these figures, the runs go on well past 1000 sweeps because of `Tmin` (see the note on `Tmin` above).

![](/figs/mc01b_q2_relaxation.png)

Every run starts from `spinmc`'s initial state, with all spins up ($|M| = 1$):

- At $T = 1.5$ the equilibrium magnetization is about 0.99, close to the starting state, so the run is in equilibrium from the first point on.
- At $T = 3.5$ only the first point (the first 128 sweeps) lies above the equilibrium value of about 0.04, so the system forgets its initial state in well under 128 sweeps.
- At $T_c$ the magnetization swings slowly between about 0.4 and 0.8, with excursions lasting hundreds to thousands of sweeps. The system needs a comparable time to forget its initial state.

The required thermalization is therefore longest at $T_c$ and much shorter on either side, because the autocorrelation time of local updates peaks at the critical point (critical slowing down).
`THERMALIZATION = 10000` is ample at $T = 1.5$ and $T = 3.5$.

This depends on the starting state and the update.
From a random initial state, local updates at $T = 1.5$ would take much longer, because ordered domains would have to grow to the size of the whole lattice.
Cluster updates thermalize within a few updates at all three temperatures.

`checkSteadyState` cannot answer this question: it only tests the whole series for a linear drift, so it cannot tell how long a transient lasts, and in pyalps 3.0.0 its result changes from run to run (see question 1).
</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">3. Increase and decrease <code>SWEEPS</code> by a factor of ten. How do the error bars on the magnetization change? Does this match the expected 1/&radic;<i>N</i> scaling?</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

Use $T = 3.5$ rather than $T_c$: at $T_c$, local updates are so strongly correlated that the error bars themselves are hard to estimate.
Use local updates as well.
With the default cluster updates, `SWEEPS` counts single Wolff cluster flips, and at $T = 3.5$ the clusters are tiny, so successive measurements are strongly correlated.

If the error scales as $1/\sqrt{N}$ in the number of measurements $N$, ten times more measurements give an error smaller by $1/\sqrt{10} \approx 0.32$, and the product $\text{error} \cdot \sqrt{N}$ stays constant.
The script below prints the number of measurements actually taken alongside each error bar:

```Python
import numpy as np
import pyalps

parms = []
for sweeps in [5000, 50000, 500000]:
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : 3.5,
        'THERMALIZATION'  : 10000,
        'SWEEPS'          : sweeps,
        'UPDATE'          : "local",
        })

input_file = pyalps.writeInputFiles('mc01b_q3', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

files = pyalps.getResultFiles(prefix='mc01b_q3')
data = pyalps.loadMeasurements(files, '|Magnetization|')
for run in sorted(pyalps.flatten(data), key=lambda run: run.props['SWEEPS']):
    # the number of measurements actually taken, which can exceed SWEEPS
    archive = pyalps.hdf5.archive(run.props['filename'])
    n = archive['/simulation/results/|Magnetization|/count']
    m = run.y[0]
    print('SWEEPS = %6d   measurements = %6d   |M| = %.5f +/- %.5f   error * sqrt(n) = %.3f'
          % (run.props['SWEEPS'], n, m.mean, m.error, m.error * np.sqrt(n)))
```

In our run this printed (your numbers will differ):

```
SWEEPS =   5000   measurements =  25915   |M| = 0.04246 +/- 0.00049   error * sqrt(n) = 0.079
SWEEPS =  50000   measurements =  50189   |M| = 0.04091 +/- 0.00030   error * sqrt(n) = 0.068
SWEEPS = 500000   measurements = 509100   |M| = 0.04106 +/- 0.00010   error * sqrt(n) = 0.073
```

`SWEEPS` is not the number of measurements.
As explained above for `Tmin`, with ALPS 3.0.0 a run keeps measuring until the scheduler's next check, once per second here, so the 5000-sweep run actually took about 26000 measurements. On the ALPS master branch it takes exactly 5000.
Compared by `SWEEPS`, the error bars seem to follow no clear rule.
Compared by the actual number of measurements, $\text{error} \cdot \sqrt{N}$ is about 0.07 for all three runs, as $1/\sqrt{N}$ scaling predicts.

The error bars are only meaningful if the binning analysis has converged.
It estimates the error from increasingly large bins of measurements, and the estimate rises until the bins are longer than the autocorrelation time, then levels off:

```Python
binning = pyalps.loadBinningAnalysis(files, '|Magnetization|')
for run in sorted(pyalps.flatten(binning), key=lambda run: run.props['SWEEPS']):
    print('%6d' % run.props['SWEEPS'], ' '.join('%.1e' % e for e in run.y))
```

```
  5000 2.0e-04 2.6e-04 3.2e-04 3.8e-04 4.3e-04 4.6e-04 4.9e-04 4.9e-04
 50000 1.4e-04 1.8e-04 2.2e-04 2.6e-04 2.9e-04 3.0e-04 3.0e-04 3.0e-04 3.0e-04
500000 4.3e-05 5.6e-05 7.0e-05 8.3e-05 9.1e-05 9.6e-05 9.8e-05 9.8e-05 9.8e-05 9.9e-05 1.0e-04 1.0e-04
```

All three level off, so the error bars can be trusted.
Correlations between successive measurements make each error bar larger than for independent samples, but they do not change the $1/\sqrt{N}$ scaling.
</div>
</details>

<details style="margin-bottom: 1rem">
<summary style="font-weight: 600; cursor: pointer">4. Why is it important to check both equilibration and convergence? Can a simulation pass one check and fail the other?</summary>
<div style="margin: 0.6rem 0 0 1.2rem; padding-left: 0.9rem; border-left: 3px solid rgba(128,128,128,0.35)">

Equilibration makes sure the averages are not biased by the initial state.
Convergence makes sure the error bars on those averages are reliable.
A run can fail either one independently: a run with too little thermalization can have small, stable error bars around a biased mean, and a well-thermalized run that is too short for its autocorrelation time has unreliable error bars.

The two checks also test different things.
`checkSteadyState` looks for a linear drift in the time series, while `checkConvergence` asks whether the binning analysis of the error has levelled off (question 3).
In our runs, local updates at $T_c$ never passed `checkConvergence` with up to 50000 sweeps, whether or not we thermalized first, because the autocorrelation time there is too long for runs of that length.

Both checks are statistical tests, so even identical, well-thermalized runs do not always agree.
The script below repeats the same equilibrated cluster-update run five times:

```Python
# pyalps 3.0.0 only: see the SciPy note in the checkSteadyState section
import scipy
import numpy as np
for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))

import pyalps

parms = []
for run in range(5):
    parms.append({
        'LATTICE'         : "square lattice",
        'MODEL'           : "Ising",
        'L'               : 48,
        'J'               : 1.,
        'T'               : 2.269186,
        'THERMALIZATION'  : 10000,
        'SWEEPS'          : 50000,
        'UPDATE'          : "cluster",
        })

input_file = pyalps.writeInputFiles('mc01b_q4', parms)
pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='mc01b_q4'), '|Magnetization|')
steady = pyalps.checkSteadyState(data)
converged = pyalps.checkConvergence(data)

for run, (s, c) in enumerate(zip(steady, converged)):
    print('run %d   |M| = %.4f +/- %.4f   steady state: %s   converged: %s'
          % (run + 1, s.y[0].mean, s.y[0].error, s.props['checkSteadyState']['value'], c.props['checkConvergence']))
```

In our run this printed (your flags will differ):

```
run 1   |M| = 0.6205 +/- 0.0016   steady state: False   converged: True
run 2   |M| = 0.6237 +/- 0.0019   steady state: True   converged: True
run 3   |M| = 0.6226 +/- 0.0018   steady state: False   converged: True
run 4   |M| = 0.6239 +/- 0.0014   steady state: False   converged: True
run 5   |M| = 0.6216 +/- 0.0021   steady state: False   converged: False
```

All five means agree within their error bars, yet the flags differ: one run passes both checks, three fail only the steady-state check, and one fails both.
The steady-state failures here are false alarms caused by the strict pyalps 3.0.0 cutoff described in question 1.
So yes, a simulation can pass one check and fail the other.
Treat both checks as warnings that tell you where to look, and confirm with the time series and the binning analysis.
</div>
</details>
