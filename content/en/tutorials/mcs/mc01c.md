---
title: MC-01c The Steady-State Test
math: true
toc: true
weight: 4
---

A Monte Carlo simulation produces a Markov chain of configurations, and only after the chain has forgotten its initial state do its measurements sample the equilibrium distribution.
[MC-01b](../mc01b) showed how to inspect the time series of an observable for this, and introduced `pyalps.checkSteadyState`, which automates the inspection with a statistical test.
This tutorial looks at that test in detail: what it computes, how its cutoff $z_0$ follows from the standard normal distribution $\Phi$, how often it passes when nothing is wrong, and which kinds of non-equilibrium it can and cannot detect.

The test is applied to two applications: classical Monte Carlo of the 2D Ising model with `spinmc`, and quantum Monte Carlo of the spin-1/2 Heisenberg antiferromagnet with the directed-loop stochastic series expansion code `dirloop_sse`.
In both, the main finding is the same: the test detects a drift that lasts a large part of the run, reacts only weakly to a large but short transient at the start, and raises false alarms more often than its confidence level suggests whenever the time series is autocorrelated.

## The steady-state test

### The test statistic

ALPS stores the time series of each observable as at most about 128 bins of consecutive measurements (see *How the time series is stored* in [MC-01b](../mc01b)).
`checkSteadyState` takes these $N$ bin values $y_1, \dots, y_N$ and fits a straight line $y \approx \beta_0 + \beta_1 t$ through the points $(t, y_t)$, $t = 1, \dots, N$, by least squares.
The fitted slope is

$$\beta_1 = \frac{\sum_t (t - \bar t)(y_t - \bar y)}{\sum_t (t - \bar t)^2}, \qquad \sum_{t=1}^{N} (t - \bar t)^2 = \frac{N(N^2-1)}{12}.$$

If the series has no drift and its $N$ values are independent with standard deviation $\sigma_y$, the slope scatters around zero with standard error $\sigma_y \big/ \sqrt{\sum_t (t - \bar t)^2}$.
The test estimates $\sigma_y$ by the sample standard deviation $s$ of the series, so the slope error is

$$\sigma_{\beta_1} = s \sqrt{\frac{12}{N(N^2-1)}},$$

and the test statistic is the slope in units of its error,

$$z = \frac{|\beta_1|}{\sigma_{\beta_1}}.$$

Under these assumptions the signed ratio $\beta_1 / \sigma_{\beta_1}$ is approximately a standard normal variable $Z$ (mean 0, standard deviation 1).
The test passes if $z < z_0$ for a cutoff $z_0$ that depends on the confidence level you choose.

Two details matter later.
First, $s$ is the standard deviation of the series itself, not of the residuals from the fitted line, so a strong drift also raises $s$ and caps $z$ at about $\sqrt{N}$.
Second, the slope error assumes that the bins are independent; [MC-01a](../mc01a) showed that consecutive measurements are not, and neither are consecutive bins unless each bin is much longer than the autocorrelation time.

### The standard normal distribution $\Phi$

$\Phi$ is the cumulative distribution function of the standard normal distribution: the probability that $Z$ is at most $x$,

$$\Phi(x) = P(Z \le x) = \frac{1}{\sqrt{2\pi}} \int_{-\infty}^{x} e^{-u^2/2}\, du = \frac{1}{2}\left[1 + \operatorname{erf}\!\left(\frac{x}{\sqrt 2}\right)\right].$$

It rises from 0 to 1, with $\Phi(0) = 1/2$, $\Phi(1) \approx 0.8413$ and $\Phi(1.96) \approx 0.975$, and it is symmetric: $\Phi(-x) = 1 - \Phi(x)$.
Its inverse $\Phi^{-1}$, the quantile function, returns the $x$ at which $\Phi$ reaches a given probability $p$.
In SciPy, $\Phi$ is `scipy.stats.norm.cdf` and $\Phi^{-1}$ is `scipy.stats.norm.ppf`.

### The cutoff $z_0$

The `confidenceInterval` argument $c$ of `checkSteadyState` is the probability that a series without drift passes.
The acceptance region $-z_0 < Z < z_0$ is symmetric, so

$$P(|Z| < z_0) = \Phi(z_0) - \Phi(-z_0) = 2\Phi(z_0) - 1 = c \quad\Longrightarrow\quad z_0 = \Phi^{-1}\!\left(\frac{1+c}{2}\right).$$

The probability $1 - c$ outside the region is split equally between the two tails, $(1-c)/2$ each, which is where $(1+c)/2$ comes from.
The default $c = 0.6827$ gives $z_0 = 1$: the test passes if the slope is within one standard error of zero.
A larger $c$ widens the region, so it makes the test *more lenient*, not stricter.

pyalps 3.0.0 and earlier computed the cutoff as $\Phi^{-1}(1 - c/2)$ instead, which puts $c/2$ in each tail: it is the cutoff for the complementary level $1 - c$.
This makes the default test pass a series without drift only 32% of the time, and a larger $c$ makes it stricter.
The ALPS master branch uses $\Phi^{-1}((1+c)/2)$.

The script <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/tutorial1c_test.py" data-filename="tutorial1c_test.py" target="_blank" rel="noopener">`tutorial1c_test.py`</a> computes the test by hand, without ALPS.
Its two functions reproduce `checkSteadyState`:

```Python
import numpy as np
from scipy.signal import lfilter
from scipy.stats import norm

def steady_state_z(ts):
    """Return the fitted slope, its standard error and z = |slope| / error."""
    ts = np.asarray(ts, dtype=float)
    N = len(ts)
    t = np.arange(1, N + 1)
    slope = np.polyfit(t, ts, 1)[0]
    error = np.std(ts, ddof=1) * np.sqrt(12. / (N * (N**2 - 1)))
    if error == 0.:
        return slope, error, 0.  # a constant series, as in pyalps.checkSteadyState
    return slope, error, abs(slope) / error

def cutoff(c):
    """z0 such that a standard normal Z satisfies P(|Z| < z0) = c."""
    return norm.ppf((1. + c) / 2.)
```

The script then prints $z_0$ for common confidence levels, together with the fraction of series without drift that pass, $2\Phi(z_0) - 1$:

```
     c      z0   pass rate   z0 (3.0.0)   pass rate (3.0.0)
0.6827   1.000       0.683        0.409               0.317
0.9000   1.645       0.900        0.126               0.100
0.9500   1.960       0.950        0.063               0.050
0.9900   2.576       0.990        0.013               0.010
```

and plots the acceptance region on the standard normal density:

![](/figs/mc01c_acceptance.png)

### Autocorrelated series

The pass rate $c$ holds only if the $N$ points are independent.
To see what autocorrelation does, `tutorial1c_test.py` applies the test to 10000 synthetic series of $N = 128$ points without any drift, generated by $x_i = a\, x_{i-1} + \text{noise}$.
Such a series has the integrated autocorrelation time $\tau = (1+a)/(2(1-a))$ in units of points, the quantity defined in [MC-01a](../mc01a):

```Python
rng = np.random.default_rng(2026)
N, samples = 128, 10000
z0 = cutoff(0.6827)
for a in [0., 0.5, 0.8, 0.95]:
    noise = rng.normal(size=(samples, N))
    noise[:, 0] /= np.sqrt(1 - a**2)
    series = lfilter([1.], [1., -a], noise, axis=1)
    z = np.array([steady_state_z(s)[2] for s in series])
    tau = (1 + a) / (2 * (1 - a))
    print('%7.1f   %.3f' % (tau, np.mean(z < z0)))
```

```
    tau   fraction passing at c = 0.6827 (N = 128 points)
    0.5   0.685
    1.5   0.441
    4.5   0.250
   19.5   0.124
```

Independent points ($\tau = 1/2$) pass at the nominal rate.
With correlated points, the slope scatters more than $\sigma_{\beta_1}$ assumes, $z$ is inflated by roughly $\sqrt{2\tau}$, and a series without any drift fails most of the time.
For ALPS time series, $\tau$ here is the autocorrelation time measured in bins: it is small when each bin is much longer than the autocorrelation time of the measurements, and of order one or larger when it is not.

## Models

Classical Monte Carlo is applied to the ferromagnetic Ising model on the square lattice,

$$H = -J \sum_{\langle i,j \rangle} \sigma_i \sigma_j, \qquad \sigma_i = \pm 1,$$

introduced by [E. Ising, Z. Phys. 31, 253 (1925)](https://doi.org/10.1007/BF02980577).
Its critical temperature $T_c = 2J / \ln(1+\sqrt{2}) \approx 2.269186\, J$ is known exactly from [L. Onsager, Phys. Rev. 65, 117 (1944)](https://doi.org/10.1103/PhysRev.65.117).
At $T_c$ the autocorrelation time of local updates is long, which makes it a demanding case for any equilibration test.

Quantum Monte Carlo is applied to the spin-1/2 Heisenberg antiferromagnet on the square lattice,

$$H = J \sum_{\langle i,j \rangle} \mathbf{S}_i \cdot \mathbf{S}_j, \qquad J > 0,$$

([W. Heisenberg, Z. Phys. 49, 619 (1928)](https://doi.org/10.1007/BF01328601)), simulated with the directed-loop algorithm in the stochastic series expansion of [O. F. Syljuåsen and A. W. Sandvik, Phys. Rev. E 66, 046701 (2002)](https://doi.org/10.1103/PhysRevE.66.046701).
The observable is the energy.

## Parameters

| Parameter | Meaning | `spinmc` drift run | `spinmc` equilibrated runs | `dirloop_sse` runs without thermalization | `dirloop_sse` equilibrated runs |
|---|---|---|---|---|---|
| `LATTICE` | lattice | `square lattice` | `square lattice` | `square lattice` | `square lattice` |
| `MODEL` | Hamiltonian | `Ising` | `Ising` | `spin` | `spin` |
| `local_S` | spin per site | – | – | `1/2` | `1/2` |
| `L` | linear lattice size ($L \times L$ sites, periodic) | `128` | `48` | `32` | `32` |
| `J` | coupling | `1` (ferromagnetic) | `1` | `1` (antiferromagnetic) | `1` |
| `T` | temperature | `2.269186` ($T_c$) | `2.269186` | `0.25` | `0.25` |
| `UPDATE` | local or cluster updates | `local` | `local` and `cluster` | – | – |
| `THERMALIZATION` | steps discarded before measuring | `0` | `10000` | `0` | `1000` |
| `INITIAL_CUTOFF` | initial operator-string length (SSE) | – | – | `40000` | – |
| `SWEEPS` | measurement steps | `2000` | `20000` | `2000` | `4000` |
| number of runs | independent runs with these parameters | 1 | 100 per update | 10 | 100 |

With local updates a step is a sweep over all sites; with cluster updates `SWEEPS` counts single Wolff cluster flips (see [MC-01b](../mc01b)).

## Parameter files

The command-line runs use two parameter files.
<a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/parm1c_drift" data-filename="parm1c_drift" target="_blank" rel="noopener">`parm1c_drift`</a> starts a large Ising lattice at $T_c$ without thermalization:

```
LATTICE="square lattice"
MODEL="Ising"
T=2.269186
J=1
UPDATE="local"
THERMALIZATION=0
SWEEPS=2000
{L=128;}
```

<a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/parm1c_sse" data-filename="parm1c_sse" target="_blank" rel="noopener">`parm1c_sse`</a> starts the Heisenberg antiferromagnet without thermalization:

```
LATTICE="square lattice"
MODEL="spin"
local_S=1/2
T=0.25
J=1
THERMALIZATION=0
INITIAL_CUTOFF=40000
SWEEPS=2000
{L=32;}
```

The repeated runs are set up in the Python scripts below, which build the same parameters in a loop.

## Lattice

Both models live on the periodic square lattice, with the coupling $J$ on every nearest-neighbor bond:

```
  :       :       :       :
--o---J---o---J---o---J---o---J--
  |       |       |       |
  J       J       J       J
  |       |       |       |
--o---J---o---J---o---J---o---J--      L x L sites, periodic in both directions
  |       |       |       |
  J       J       J       J
  |       |       |       |
--o---J---o---J---o---J---o---J--
  :       :       :       :
```

The square lattice gives the Ising model a finite-temperature transition at an exactly known $T_c$, and it is bipartite, so the Heisenberg antiferromagnet has no sign problem in quantum Monte Carlo.
It is the built-in `square lattice` of the [ALPS lattice library](../../../documentation/intro/latticehowtos).

## Method choice

`spinmc` offers local Metropolis updates and Wolff cluster updates.
At $T_c$ the autocorrelation time of local updates grows with the system size roughly as $L^{2.17}$ (critical slowing down), while cluster updates decorrelate within a few cluster flips (see [MC-01a](../mc01a)).
Comparing the two shows how the autocorrelation of the time series affects the test.
A $48 \times 48$ run of 30000 steps takes a second or two.

For the quantum model, the Hilbert space of $32 \times 32$ spins has $2^{1024}$ states, far beyond exact diagonalization, while `dirloop_sse` samples it at $T = 0.25$ in a few seconds per run.
The directed-loop code has no local and cluster variants to compare, but its energy decorrelates quickly, and its operator string starts empty and has to grow to its equilibrium length.
During thermalization the code also adjusts the cutoff of the operator string; without thermalization it stops with "nnonzero reached the maximum value" unless `INITIAL_CUTOFF` is set large enough.

## Running the simulations

On the command line, convert the parameter files to XML and run the two applications:

```
parameter2xml parm1c_drift
spinmc --Tmin 1 --write-xml parm1c_drift.in.xml

parameter2xml parm1c_sse
dirloop_sse --Tmin 1 --write-xml parm1c_sse.in.xml
```

Then apply the test to the results in Python (with pyalps 3.0.0, see the note at the end first):

```Python
import pyalps

for prefix, observable in [('parm1c_drift', '|Magnetization|'), ('parm1c_sse', 'Energy')]:
    data = pyalps.loadMeasurements(pyalps.getResultFiles(prefix=prefix), observable)
    for d in pyalps.checkSteadyState(data):
        print(prefix, d.props['checkSteadyState'])
```

The three scripts run everything, including the repeated runs, and print the numbers and plots shown below:

```
python tutorial1c_test.py
python tutorial1c_spinmc.py
python tutorial1c_sse.py
```

Download <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/tutorial1c_spinmc.py" data-filename="tutorial1c_spinmc.py" target="_blank" rel="noopener">`tutorial1c_spinmc.py`</a> and <a class="alps-download" href="https://raw.githubusercontent.com/ALPSim/ALPS/master/tutorials/mc-01c-steady-state/tutorial1c_sse.py" data-filename="tutorial1c_sse.py" target="_blank" rel="noopener">`tutorial1c_sse.py`</a> next to `tutorial1c_test.py`.
Each defines `steady_state_z` and `cutoff` as above, so that the numbers do not depend on the pyalps version (see the note at the end).
The repeated runs take a few minutes per script.

## Results: classical Monte Carlo

### A run that is still drifting

`tutorial1c_spinmc.py` first runs `parm1c_drift` and computes the test by hand and with `pyalps.checkSteadyState`:

```Python
files = pyalps.getResultFiles(prefix='parm1c_drift')
ts = np.array(pyalps.loadTimeSeries(files[0], '|Magnetization|'))
slope, error, z = steady_state_z(ts)
print('drift run: %d bins, z = %.2f, cutoff z0 = %.2f, passes: %s'
      % (len(ts), z, cutoff(0.6827), z < cutoff(0.6827)))

data = pyalps.loadMeasurements(files, '|Magnetization|')
try:
    for d in pyalps.checkSteadyState(data):
        s = d.props['checkSteadyState']
        print('pyalps.checkSteadyState: z = %.2f, z0 = %.2f, passes: %s'
              % (s['statistics']['z'], s['statistics']['z0'], s['value']))
except AttributeError as error:
    # pyalps 3.0.0 calls scipy.linspace, which current SciPy no longer has
    print('pyalps.checkSteadyState failed with this pyalps and SciPy:', error)
```

In our run this printed:

```
drift run: 124 bins, z = 8.45, cutoff z0 = 1.00, passes: False
pyalps.checkSteadyState: z = 8.45, z0 = 1.00, passes: False
```

The hand-computed $z$ and $z_0$ agree with the library's.
With pyalps 3.0.0 the library prints $z_0 = 0.41$ instead (see the note at the end), and the run fails as well.

![](/figs/mc01c_spinmc_drift.png)

`spinmc` starts with all spins up, and the magnetization first relaxes from 1 to about 0.6 within a few hundred sweeps.
After that it keeps wandering slowly between about 0.35 and 0.75: at $T_c$ the autocorrelation time of local updates on a $128 \times 128$ lattice is far longer than this run.
The test is right to fail: on the time scale of this run, the magnetization is not in a steady state, whether one calls the slow wandering the end of the initial relaxation or critical slowing down.

### Many equilibrated runs

Next the script repeats an equilibrated run, with 10000 steps of thermalization, 100 times each with local and with cluster updates, and records how often the test passes:

```Python
NRUNS = 100
c = 0.6827
for update in ['local', 'cluster']:
    parms = [{
        'LATTICE'        : "square lattice",
        'MODEL'          : "Ising",
        'L'              : 48,
        'J'              : 1.,
        'T'              : 2.269186,
        'UPDATE'         : update,
        'THERMALIZATION' : 10000,
        'SWEEPS'         : 20000,
    } for run in range(NRUNS)]
    prefix = 'parm1c_' + update
    input_file = pyalps.writeInputFiles(prefix, parms)
    pyalps.runApplication('spinmc', input_file, Tmin=1, writexml=True)

    z = np.array([steady_state_z(pyalps.loadTimeSeries(f, '|Magnetization|'))[2]
                  for f in pyalps.getResultFiles(prefix=prefix)])
    print('%-7s updates: %d runs, fraction passing at c = %g: %.2f (expected %.2f)'
          % (update, len(z), c, np.mean(z < cutoff(c)), c))
```

```
local   updates: 100 runs, fraction passing at c = 0.6827: 0.41 (expected 0.68)
cluster updates: 100 runs, fraction passing at c = 0.6827: 0.72 (expected 0.68)
```

| Update | Runs | Fraction passing at $c = 0.6827$ | Expected for independent bins |
|---|---|---|---|
| local | 100 | 0.41 | 0.68 |
| cluster | 100 | 0.72 | 0.68 |

With 100 runs the fractions carry a statistical uncertainty of about $\pm 0.05$.
The cluster-update runs pass at the nominal rate, and their values of $z$ follow the distribution of $|Z|$ for a standard normal $Z$.
The local-update runs fail more than half the time although every one of them is equilibrated: their distribution of $z$ has a long tail beyond 2.

![](/figs/mc01c_spinmc_z.png)

The reason is the autocorrelation between bins.
Each bin of a local-update run averages 256 sweeps, which at $T_c$ is not much longer than the autocorrelation time, so consecutive bins are correlated and the test sees slow fluctuations as drift.
Cluster updates decorrelate within each bin, and the bins behave as independent samples.

## Results: quantum Monte Carlo

### A short transient at the start

`tutorial1c_sse.py` first repeats `parm1c_sse` ten times and computes the test with and without the first bin of each time series:

```Python
NSTART = 10
parms = [{
    'LATTICE'        : "square lattice",
    'MODEL'          : "spin",
    'local_S'        : 0.5,
    'L'              : 32,
    'J'              : 1.,
    'T'              : 0.25,
    'THERMALIZATION' : 0,
    'INITIAL_CUTOFF' : 40000,
    'SWEEPS'         : 2000,
} for run in range(NSTART)]
input_file = pyalps.writeInputFiles('parm1c_start_sse', parms)
pyalps.runApplication('dirloop_sse', input_file, Tmin=1, writexml=True)

files = pyalps.getResultFiles(prefix='parm1c_start_sse')
series = [np.array(pyalps.loadTimeSeries(f, 'Energy')) for f in files]
z = np.array([steady_state_z(ts)[2] for ts in series])
z_rest = np.array([steady_state_z(ts[1:])[2] for ts in series])
```

In our run this printed:

```
runs without thermalization: z = 1.6 2.1 1.8 2.5 1.2 2.1 1.8 1.8 2.1 1.4
the same runs without the first bin: z = 0.3 1.4 0.3 3.1 1.6 1.8 0.4 0.4 1.5 0.6
fraction passing at c = 0.6827 (z0 = 1.00): 0.0 with the first bin, 0.5 without
fraction passing at c = 0.95 (z0 = 1.96): 0.6 with the first bin, 0.9 without
```

![](/figs/mc01c_sse_transient.png)

The energy relaxes within the first bin of 16 sweeps, while the operator string grows from its empty initial state.
That first bin lies about 300 above the equilibrium energy, some forty times the scatter of the later bins, yet the run plotted here has only $z = 1.6$: it fails the default test, where $z_0 = 1$, but passes at $c = 0.95$.
A single outlying point at the start produces a slope of only modest significance, and it also raises the standard deviation $s$ that the slope is divided by.
At $c = 0.6827$ all ten runs fail, so at the default level the test does flag the transient, but with $z$ between 1.2 and 2.5 rather than the large value of the drift run; at $c = 0.95$ six of the ten pass.
The test is built to detect a linear trend over the whole series; a transient confined to the first bins is better found by looking at the time series, or simply avoided by thermalizing for a few hundred sweeps.

### Many equilibrated runs

With 1000 sweeps of thermalization, 100 repeated runs give:

```
100 equilibrated runs, fraction passing at c = 0.6827: 0.70 (expected 0.68)
```

![](/figs/mc01c_sse_z.png)

Here each bin averages 32 sweeps, already longer than the autocorrelation time of the SSE energy, so the bins are nearly independent and the test passes at its nominal rate, as for the cluster-update Ising runs.

## pyalps 3.0.0

{{< callout type="warning" >}}
**pyalps 3.0.0 and earlier.** `checkSteadyState` uses the cutoff $\Phi^{-1}(1 - c/2)$, about 0.41 at the default, so it fails about two thirds of series without drift, and a larger `confidenceInterval` makes it stricter.
It also calls `scipy.linspace`, which newer SciPy releases no longer provide, so it stops with `AttributeError: Module 'scipy' has no attribute 'linspace'`.
Both are fixed in the ALPS master branch.
The scripts of this tutorial compute $z$ and $z_0$ themselves; if the one call of `checkSteadyState` in `tutorial1c_spinmc.py` fails, the script prints a message and goes on. To call `checkSteadyState` with pyalps 3.0.0, run the following before importing pyalps:

```Python
# pyalps 3.0.0 only: restore the NumPy aliases that newer SciPy releases removed
import scipy
import numpy as np

for name in dir(np):
    if not hasattr(scipy, name):
        setattr(scipy, name, getattr(np, name))
```

The results on this page were produced with the ALPS master branch, in which a run takes exactly `SWEEPS` measurements. With pyalps 3.0.0 a run keeps measuring until the scheduler's next check (see `Tmin` in [MC-01b](../mc01b)), so it can take more.
This changes the number of bins, not the behavior of the test.
{{< /callout >}}

## Summary and outlook

`checkSteadyState` divides the fitted slope of the binned time series by its standard error for independent bins and passes if the ratio is below $z_0 = \Phi^{-1}((1+c)/2)$.
It catches a drift that lasts a large part of the run, reacts only weakly to a transient confined to the first bins, however large, and fails equilibrated runs far more often than $1 - c$ when consecutive bins are correlated, as for local updates at $T_c$.
Use it as a warning, together with the time series itself and the binning analysis of [MC-01a](../mc01a), not as proof of equilibration.

1. Rerun Part 2 of `tutorial1c_spinmc.py` with $c = 0.95$. How close are the pass fractions of local and cluster updates to 0.95?
2. Give the drift run 50000 sweeps of thermalization. Does it pass now? How does the answer depend on $L$?
3. Add consecutive pairs of bins, dropping the last bin if their number is odd, before computing $z$ for the local-update runs. How does the pass fraction change, and why?
4. Run the local-update experiment at $T_c$ for $L = 16$, 32 and 48. How does the false-alarm rate depend on $L$, and how does that relate to the autocorrelation time of MC-01a?
5. Add a single outlier to the first point of a synthetic series without drift in `tutorial1c_test.py`. How large must it be, in units of the noise, for the test to fail at $c = 0.95$?
6. Design a better test for a transient at the start of a run, for example by comparing the means of the first and last quarters of the time series. Does it detect the transient in the SSE runs?
