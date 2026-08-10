
---
title: DMFT-05 OSMT
math: true
toc: true
---

## Orbitally Selective Mott Transition

An interesting phenomenon in multi-orbital models is the orbitally selective Mott transition, first examined by [Anisimov et al., Eur. Phys. J. B 25, 191 (2002)](https://doi.org/10.1140/epjb/e20020021). A variant of this, a *momentum-selective* Mott transition, has recently been discussed in [cluster calculations](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.045120) as a cluster representation of pseudogap physics.

In an orbitally selective Mott transition some of the orbitals involved become Mott insulating as a function of doping or interactions, while others stay metallic.

As a minimal model we consider two bands: a wide band and a narrow band. In addition to the intra-orbital Coulomb repulsion $U$ we consider interactions $U'$ and $J$, with $U' = U-2J$. We limit ourselves to Ising-like interactions - a simplification that is often problematic for real compounds.

### Model

We consider a two-orbital (two-band) Hubbard-Kanamori model, restricted to its density-density ("Ising") terms:

$$
\hat{H} = -\sum_{m=0,1}t_m\sum_{\langle i,j\rangle,\sigma} \left(\hat{c}^\dagger_{im\sigma}\hat{c}_{jm\sigma} + \text{h.c.}\right) + U\sum_{i,m} \hat{n}_{im\uparrow}\hat{n}_{im\downarrow} + \sum_{i,\sigma,\sigma'}\left[U' - J\,\delta_{\sigma\sigma'}\right]\hat{n}_{i0\sigma}\hat{n}_{i1\sigma'} - \mu\sum_{i,m,\sigma}\hat{n}_{im\sigma},
$$

with orbital index $m=0,1$, intra-orbital hopping $t_m$, intra-orbital (Hubbard) interaction $U$, inter-orbital interaction $U'=U-2J$, and Hund's coupling $J$. Dropping the spin-flip and pair-hopping terms of the full Kanamori interaction (keeping only the density-density part shown above) is the "Ising-like" simplification mentioned above; see [Anisimov et al., Eur. Phys. J. B 25, 191 (2002)](https://doi.org/10.1140/epjb/e20020021) for the original discussion of the orbitally selective Mott transition (OSMT) in this class of models, and [de' Medici, Georges, and Biermann, Phys. Rev. B 72, 081103(R) (2005)](https://doi.org/10.1103/PhysRevB.72.081103) for the parameters reproduced here.

### Parameters

| Parameter | Meaning | Value(s) used |
| :-------- | :------ | :------------ |
| `U` | intra-orbital interaction | $1.8, 2.2, 2.8$ |
| `J` | Hund's coupling, set to $U/4$ for each $U$ | $0.45, 0.55, 0.7$ |
| (`U'`) | inter-orbital interaction, not set explicitly — defaults to $U-2J=U/2$ | $0.9, 1.1, 1.4$ |
| `t0` | hopping of orbital 0, the narrow band (half-bandwidth $D_0=2t_0$) | $0.5$ |
| `t1` | hopping of orbital 1, the wide band (half-bandwidth $D_1=2t_1$) | $1$ |
| `BETA` | inverse temperature | $30$ |
| `MU` | chemical potential | $0$ (half filling) |
| `H`, `H_INIT` | quantization-axis field / seed field for the initial Weiss field | $0$ / $0$ |
| `FLAVORS` | number of flavors: 2 orbitals $\times$ 2 spins | $4$ (flavors 0,1 = narrow band $\uparrow,\downarrow$; flavors 2,3 = wide band $\uparrow,\downarrow$) |
| `SYMMETRIZATION` | enforce spin-symmetric solutions within each orbital (flavor 0$\leftrightarrow$1, 2$\leftrightarrow$3) | $1$ |
| `N`, `NMATSUBARA` | imaginary-time / Matsubara discretization of $G$ and $G_0$ | $500$ |
| `MAX_IT`, `CONVERGED` | maximum self-consistency iterations / convergence threshold | $15$, $0.001$ |
| `SOLVER` | impurity solver | `"hybridization"` (CT-HYB, segment representation) |
| `N_ORDER` | histogram size for the hybridization expansion order | $50$ |
| `N_MEAS` | number of Monte Carlo updates between measurements | $2000$ |
| `SC_WRITE_DELTA` | write the hybridization function for the solver | $1$ |
| `CHECKPOINT` | filename prefix for checkpoint/restart files | `dump` |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | Monte Carlo sweep budget, thermalization sweeps, wall-clock cutoff per iteration (seconds) | $10000$, $500$, $600$ |

### Running the simulation

We choose here a case with two bandwidths, $t_0=0.5$ and $t_1=1$, and density-density-like interactions of $U'=U/2$, $J=U/4$, with $U$ between $1.8$ and $2.8$: $U=1.8$ shows a Fermi-liquid-like behavior in both orbitals, $U=2.2$ is orbitally selective, and $U=2.8$ is insulating in both orbitals.

The python command lines for running the simulations are found in [`tutorial5a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5a.py):

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u,j in [[1.8,0.45],[2.2,0.55],[2.8,0.7]]:
    parms.append(
            { 
              'CONVERGED'           : 0.001,
              'FLAVORS'             : 4,
              'H'                   : 0,
              'H_INIT'              : 0.,
              'MAX_IT'              : 15,
              'MAX_TIME'            : 600,
              'MU'                  : 0,
              'N'                   : 500,
              'NMATSUBARA'          : 500,
              'N_MEAS'              : 2000,
              'N_ORDER'             : 50,
              'SEED'                : 0,
              'SOLVER'              : 'hybridization',
              'SC_WRITE_DELTA'      : 1,
              'SYMMETRIZATION'      : 1,
              'SWEEPS'              : 10000,
              'BETA'                : 30,
              'THERMALIZATION'      : 500,
              'U'                   : u,
              'J'                   : j,
              't0'                  : 0.5,
              't1'                  : 1,
              'CHECKPOINT'          : 'dump'
        }
        )

# For more precise calculations we propose to enhance the SWEEPS

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_u_'+str(p['U'])+'_j_'+str(p['J']),p)
    res = pyalps.runDMFT(input_file)
```

A paper using the same sample parameters can be found in [de' Medici, Georges, and Biermann (2005)](https://doi.org/10.1103/PhysRevB.72.081103). As in the earlier tutorials, `pyalps.runDMFT` invokes the `dmft` application directly on each generated parameter file, once per iteration:

```
/path-to-alps-installation/bin/dmft parm_u_1.8_j_0.45
/path-to-alps-installation/bin/dmft parm_u_2.2_j_0.55
/path-to-alps-installation/bin/dmft parm_u_2.8_j_0.7
```

### The parameter file

The input file `parm_u_1.8_j_0.45` produced by the script above, with comments added:

```
CONVERGED = 0.001                 // convergence criterion for the self-consistency iteration
FLAVORS = 4                       // 2 orbitals x 2 spins: flavors 0,1 = narrow-band up/down; flavors 2,3 = wide-band up/down
H = 0                             // magnetic field along the quantization axis
H_INIT = 0.                       // no symmetry-breaking seed field for the initial Weiss field
MAX_IT = 15                       // maximum number of self-consistency iterations
MAX_TIME = 600                    // wall-clock time limit per iteration (seconds)
MU = 0                            // chemical potential; MU=0 is half filling
N = 500                           // discretization of the imaginary-time Green's function
NMATSUBARA = 500                  // cutoff for Matsubara frequencies
N_MEAS = 2000                     // number of updates between measurements
N_ORDER = 50                      // histogram size for the hybridization expansion order
SEED = 0                          // Monte Carlo random number seed
SOLVER = "hybridization"          // the CT-HYB solver (segment representation, requires density-density interactions)
SC_WRITE_DELTA = 1                // write out the hybridization function for the solver
SYMMETRIZATION = 1                // enforce spin-symmetric solutions within each orbital (flavors 0<->1 and 2<->3)
SWEEPS = 10000                    // total sweeps
BETA = 30                         // inverse temperature
THERMALIZATION = 500              // thermalization sweeps
U = 1.8                           // intra-orbital (Hubbard) interaction
J = 0.45                          // Hund's coupling
t0 = 0.5                          // hopping of the narrow band (half-bandwidth D0=2t0=1)
t1 = 1                            // hopping of the wide band (half-bandwidth D1=2t1=2)
CHECKPOINT = dump                 // filename prefix for checkpoint/restart files
```

Note that $U'$ is not set explicitly: as documented in the [DMFT parameter reference](../../../documentation/methods/dmft), it defaults to $U-2J$ whenever it is not given.

### Lattice

This is still single-site DMFT, but now with two orbitals: each orbital hops on its own copy of the Bethe lattice in the $z\to\infty$ limit (hopping $t_0$ for the narrow band, $t_1$ for the wide band, each again rescaled as $t_m=t_m^*/\sqrt{z}$), and the two orbitals are decoupled in hopping — they only talk to each other locally, through the interaction terms $U$, $U'$, and $J$ at each site:

```
        o(1)      o(1)
         \        /
      t1  \      /  t1        orbital 1 (wide band), hopping t1
           \    /
            o--o--o
            |
            |  U, U', J   (on-site intra- and inter-orbital interactions)
            |
            o--o--o
           /    \
      t0  /      \  t0        orbital 0 (narrow band), hopping t0
         /        \
        o(0)      o(0)
```

See [DMFT-08 Lattices](../dmft08) for running the self-consistency on other lattices, and the [ALPS lattice library](../../../documentation/intro/latticehowtos) for simulations built on explicit finite lattices.

### Method choice

We again use the hybridization-expansion solver CT-HYB, here in its segment representation. The segment algorithm evaluates the local trace analytically, which is only possible for density-density (Ising-like) local interactions — exactly the restriction adopted in the Model section above. This is why the spin-flip and pair-hopping terms of the full Kanamori interaction are dropped: keeping them would require a general-matrix (non-segment) CT-HYB trace evaluation over the full $2^{\text{FLAVORS}}=16$-dimensional local Hilbert space at every Monte Carlo move, which is substantially more expensive. With four flavors and $\beta=30$, the segment picture keeps the simulation tractable even close to the Mott transition in both orbitals.

### Output data and plots

As discussed in the previous tutorial [DMFT-04 Mott](../dmft04), the (non-)metallicity of the Green's function is best observed by plotting the data on a logarithmic scale. Flavor 0 (symmetrized with 1) is the narrow band, flavor 2 (symmetrized with 3) is the wide band:

```
listobs = ['0', '2']   # flavor 0 is SYMMETRIZED with 1, flavor 2 is SYMMETRIZED with 3
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_u_*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.y = -d.y
    d.props['label'] = r'$U=$'+str(d.props['U'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])
plt.figure()
plt.yscale('log')
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-05: Orbitally Selective Mott Transition on the Bethe lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

Because these are stochastic Monte Carlo results, the precise numbers depend on `SEED`, `MAX_TIME`, and machine speed, but the qualitative structure should reproduce the three regimes described above: at $U=1.8$ both flavors decay slowly on the log scale (both bands metallic); at $U=2.2$ the narrow-band flavor (0) decays much faster than the wide-band flavor (2) — this asymmetry between the two orbitals is the orbitally selective Mott transition itself; at $U=2.8$ both flavors decay quickly (both bands insulating).

### Checking convergence

Convergence may be checked with [`tutorial5b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-05-osmt/tutorial5b.py), which plots all iterations of $G_f^{it}(\tau)$ on a logarithmic scale, for both flavor 0 and flavor 2:

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot


## Please run the tutorial5a.py before this one

listobs = ['0', '2']   # we look at convergence of a single flavor (=0) 

## load all results
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_u_*.h5'), measurements=listobs, verbose=True)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['U', 'observable'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.y *= -1.
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$-G_{flavor=%8s}(\tau)$' % common_props['observable'])
    plt.title('DMFT-05: Orbitally Selective Mott Transition on the Bethe lattice: ' + r'$U = %.4s$' % common_props['U'])
    pyalps.plot.plot(sim)
    plt.legend()
    plt.yscale("log")

plt.show()
```

### Summary and outlook

By coupling two Bethe-lattice bands of different width ($t_0=0.5$, $t_1=1$) only through local density-density interactions, we reproduced the orbitally selective Mott transition: at intermediate $U$, the narrow band becomes Mott insulating while the wide band remains metallic, even though both orbitals share the same $U$, $U'$, and $J$.

1. Fix $U=2.2$ (the orbitally selective point) and vary $J$ at fixed $U'=U-2J$: how large does Hund's coupling need to be before the selective phase appears?
2. Change the bandwidth ratio $t_1/t_0$: does making the bands more (or less) asymmetric widen or narrow the orbitally selective region in $U$?
3. The Method choice section explains why the interactions are restricted to their density-density part. Look up how large the corrections from the dropped spin-flip and pair-hopping terms are expected to be for real materials (see [Anisimov et al. (2002)](https://doi.org/10.1140/epjb/e20020021)) — would you expect the selective phase to survive with the full Kanamori interaction?
4. [DMFT-06](../dmft06) applies the method used in Tutorials 02–05 to a paramagnetic metal; compare how the convergence behavior there differs from the multi-orbital case studied here.
