
---
title: DMFT-08 Lattices
math: true
toc: true
---

## Setting a particular lattice

All of the previous tutorials dealt with the Bethe lattice, whose semicircular density of states (DOS) makes the self-consistency loop analytically simple ($\Omega$-loop, no k-space integral needed). Real materials, however, live on square, cubic, hexagonal, or more complicated lattices, whose density of states has van Hove singularities and hard band edges instead of a smooth semicircle. Because these features can shift where a Mott transition happens, or how sharp it looks, it is useful to know how to run single-site DMFT for a lattice other than the Bethe lattice. This tutorial shows how to do so, and you may reuse scripts from the previous tutorials (e.g. the Mott-transition scan of [DMFT-04 Mott](../dmft04)) with the lattice-specific parameters introduced below substituted in.

### Model

The lattice Hamiltonian is still the single-band Hubbard model

$$
\hat{H} = -\sum_{\langle i,j\rangle,\sigma} t_{ij}\left(\hat{c}^\dagger_{i\sigma}\hat{c}_{j\sigma} + \text{h.c.}\right) + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow} - \mu\sum_{i,\sigma}\hat{n}_{i\sigma},
$$

now with $t_{ij}$ ranging over the bonds of whichever lattice is chosen, rather than the Bethe lattice's $z\to\infty$ tree. Within single-site DMFT, however, the lattice never enters the impurity problem directly: the self-consistency only ever needs the local, k-integrated non-interacting density of states $\rho_0(\epsilon)=\sum_{\mathbf{k}}\delta(\epsilon-\epsilon_{\mathbf{k}})$ (or, equivalently, the dispersion $\epsilon_{\mathbf{k}}$ if the Hilbert transform is done live in k-space). This is the DMFT analogue of how classical mean-field theory replaces the full lattice geometry by a single effective (coordination-number-dependent) field; see [Georges et al. (1996)](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13) for the general derivation of the self-consistency condition in terms of $\rho_0(\epsilon)$.

### Parameters

Parameters shared by both approaches below (values as used in `tutorial8a.py`/`tutorial8b.py`):

| Parameter | Meaning | Value(s) used |
| :-------- | :------ | :------------ |
| `U` | on-site interaction | $3$ |
| `BETA` | inverse temperature | $6$ |
| `MU` | chemical potential | $0$ (half filling) |
| `H`, `H_INIT` | quantization-axis field / seed field for the initial Weiss field | $0$ / $0.05$ |
| `FLAVORS` | number of spin flavors | $2$ |
| `SITES` | number of impurity sites | $1$ |
| `ANTIFERROMAGNET` | enable the Néel self-consistency | $1$ |
| `SYMMETRIZATION` | enforce a paramagnetic solution | $0$ |
| `N`, `NMATSUBARA` | imaginary-time / Matsubara discretization of $G$ and $G_0$ | $500$ |
| `OMEGA_LOOP` | run the self-consistency in Matsubara frequencies | $1$ |
| `G0OMEGA_INPUT` | set to an empty string to force the initial Weiss field to be computed from the non-interacting Green's function | `""` |
| `MAX_IT`, `CONVERGED` | maximum self-consistency iterations / convergence threshold | $10$, $0.005$ |
| `SOLVER` | impurity solver | `"hybridization"` (CT-HYB) |
| `SC_WRITE_DELTA`, `N_MEAS`, `N_ORDER` | write the hybridization function / MC updates between measurements / expansion-order histogram size | $1$, $5000$, $50$ |
| `SWEEPS`, `THERMALIZATION`, `MAX_TIME` | Monte Carlo sweep budget, thermalization sweeps, wall-clock cutoff per iteration (seconds) | $10^4$, $500$, $60$ |

### Lattice

Two lattice-specific mechanisms are available; both feed a k-integrated density of states into the same self-consistency loop used in every earlier tutorial.

**DOSFILE**: any lattice can be used, as long as you supply a table of its density of states. This tutorial ships pre-generated DOS tables (histograms) for four lattices, each with hopping normalized to $t=1$:

- **square lattice** (`DOS_Square_GRID4000`, coordination $z=4$, second moment `EPSSQ_i=4`):
  ```
  o---o---o
  |   |   |
  o---o---o        o : lattice site, interaction U (on site)
  |   |   |        --- , | : bond, nearest-neighbor hopping t
  o---o---o
  ```
- **cubic lattice** (`DOS_Cubic_GRID360`, coordination $z=6$, second moment `EPSSQ_i=6`): the 3D generalization of the square lattice above, with an additional bond of hopping $t$ out of the page in each direction.
- **hexagonal (honeycomb) lattice** (`DOS_Hexagonal_GRID4000`, coordination $z=3$, second moment `EPSSQ_i=3`):
  ```
        o---o       o---o
       /     \     /     \
      o       o---o       o     o : lattice site, interaction U (on site)
       \     /     \     /      --- , / , \ : bond, nearest-neighbor hopping t
        o---o       o---o
  ```
- **Bethe lattice** (`DOS_Bethe`, second moment `EPSSQ_i=1`, included for testing): the same lattice used in Tutorials 02–07, shown for reference:
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

Each DOS table was produced by a small histogram script — [`DOS_Square.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Square.py) (`GRID=4000`), [`DOS_Cubic.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Cubic.py) (`GRID=360`), and [`DOS_Hexagonal.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Hexagonal.py) (`GRID=4000`) — each integrating the tight-binding dispersion over the Brillouin zone on a `GRID`$\times$`GRID` k-point mesh. You can generate a DOS table for any other lattice the same way, or use the [ALPS lattice library](../../../documentation/intro/latticehowtos) as a reference for lattice geometries and coordination numbers when building your own.

**TWODBS**: for the square and hexagonal lattices specifically, ALPS can instead evaluate the Hilbert transform directly as a live k-space integral at every self-consistency step (discretized on an $L\times L$ k-point mesh), without needing a pre-tabulated DOS file at all.

### Method choice

`DOSFILE` and `TWODBS` trade off generality against convenience. `DOSFILE` works for *any* lattice, since only a one-time histogram of $\rho_0(\epsilon)$ is needed (generated once by a script like `DOS_Square.py` above) — but its accuracy is limited by the histogram's `GRID` resolution and bin count, and it must be regenerated if the hopping parameters change. `TWODBS` is exact up to the k-space discretization `L`, and needs no separate preprocessing step, but is currently implemented only for the square lattice (nearest-neighbor hopping `t` and next-nearest-neighbor hopping `tprime`) and the hexagonal lattice (nearest-neighbor hopping `t` only) — see [DMFT parameter reference](../../../documentation/methods/dmft) for the full parameter list. In both cases, the only lattice information that ever reaches the impurity solver is $\rho_0(\epsilon)$ (via `DOSFILE`) or $\epsilon_{\mathbf k}$ (via `TWODBS`) and its first two moments `EPS_i`, `EPSSQ_i` — confirming the point made in the Model section above: single-site DMFT only sees the lattice through its (integrated) non-interacting dispersion.

### Option DOSFILE

For a general lattice, you have to provide the density of states of your lattice. Apart from that, several other changes are necessary in order to run the simulation. A working python script [`tutorial8a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8a.py) setting an input file, running the simulation, and plotting the result follows:

```
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u in [3.]: 
  for b in [6.]:
    parms.append(
            { 
                'BETA' : b,          # inverse temperature
                'MU' : 0.0,          # chemical potential corresponding to half-filling
                'U' : u,             # Hubbard interaction
                'FLAVORS' : 2,       # corresponds to spin up/down
                'SITES' : 1,         # number of sites in the impurity
                'H' : 0.0,           # there is no magnetic field
                'H_INIT' : 0.05,     #  we set initial field to split spin up/down in order to trigger AF phase
                'OMEGA_LOOP' : 1,        # the selfconsistency runs in Matsubara frequencies
                'ANTIFERROMAGNET' : 1,   # allow Neel order
                'SYMMETRIZATION' : 0,    # do not enforce paramagnetic solution
                'NMATSUBARA' : 500,      # number of Matsubara frequencies
                'N' : 500,               # bins in imaginary time
                'CONVERGED' : 0.005,     # criterion for convergency
                'MAX_TIME' : 60,         # max. time spent in solver in a single iteration in seconds
                'G0OMEGA_INPUT' : "",    # forces to start from the local non-interacting Green's function
                'MAX_IT' : 10,           # max. number of self-consistency iterations
                'SWEEPS' : 10000,    # max. number of sweeps in a single iteration
                'THERMALIZATION' : 500, # number of thermalization sweeps
                'SEED' : 0,              # random seed
                'SOLVER' : "hybridization",   # we take the hybridization impurity solver
                'SC_WRITE_DELTA' : 1,         # input for the hybridization impurity solver is the hybridization function Delta, which has to be written by the selfconsistency
                'N_MEAS' : 5000,              # number of Monte Carlo steps between measurements
                'N_ORDER' : 50,               # histogram size
                'DOSFILE' : "DOS/DOS_Square_GRID4000", # specification of the file with density of states
                'GENERAL_FOURIER_TRANSFORMER' : 1,  # Fourier transformer for a general bandstructure
                'EPS_0' : 0,                        # potential shift for the flavor 0
                'EPS_1' : 0,                        # potential shift for the flavor 1
                'EPSSQ_0' : 4,                      # the second moment of the bandstructure for the flavor 0
                'EPSSQ_1' : 4,                      # the second moment of the bandstructure for the flavor 1
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('hybrid_DOS_beta_'+str(p['BETA'])+'_U_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)

listobs=['0']  # we look only at flavor=0
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='hybrid_DOS*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()

plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-08, DOS-based approach: Hubbard model on the square lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

Internally, `pyalps.runDMFT` invokes the `dmft` application directly on the generated parameter file:

```
/path-to-alps-installation/bin/dmft hybrid_DOS_beta_6.0_U_3.0
```

The input file `hybrid_DOS_beta_6.0_U_3.0` produced by the script above has the lattice-specific parameters

```
DOSFILE = DOS/DOS_Square_GRID4000; // specification of the file with density of states
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                      // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                      // the second moment of the bandstructure for the flavor 1
```

in addition to the physical/solver parameters listed in the Parameters table above. Note that the nearest-neighbor hopping is not an explicit parameter here — it is baked into the DOS table itself, and `DOS_Square.py` fixes it to $t=1$ by construction.

Note 1: if you do not provide the bandstructure parameters (EPS_i, EPSSQ_i) in the input file, then they will be calculated using the given DOS (since revision 6146) as  $EPS_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon$, $EPSSQ_{flavor=i} = \int \mathrm{d}\epsilon\ DOS_{band=i/2}(\epsilon)\ \epsilon^2$.

Note 2: the antiferromagnetic selfconsistency loop assumes Neel order. Therefore it is only applicable for bipartite lattices.

Note 3: the density of states has to be provided by the user. In the tutorial we provide the DOS for the square, cubic, hexagonal, and Bethe lattices listed in the Lattice section above.

Note 4: for a multiband simulation [$n_{\text{bands}}=FLAVORS/2$] with known DOS, the DOS-file has to consist of $2n_{\text{bands}}$ columns. The number of bins [=number of lines of the input file] for DOS has to be the same for all bands. The $i$-th line has the structure as follows

$$
e_{1,i}\ \ \ DOS_{band1}(e_{1,i})\ \ \ e_{2,i}\ \ \ DOS_{band2}(e_{2,i})\ \ \ \ldots
$$

### Option TWODBS

For the case of two-dimensional lattices, there is an implementation of the Hilbert transformation with integral over k-space [parameter L sets the discretization in each dimension of the reciprocal space]. Currently, there is implementation for these dispersions:

- square lattice [set TWODBS=square] with nearest-neighbor [corresponding parameter: t] and next-nearest-neighbor hoppings [corresponding parameter: tprime]; the second moment EPSSQ_i is $4(t^2 + tprime^2)$;
- hexagonal lattice [set TWODBS=hexagonal] with nearest-neighbor hoppings [corresponding parameter: t]; the second moment EPSSQ_i is $3t^2$.

A working python script [`tutorial8b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8b.py) to produce the input file, run the simulation, and plot the result is shown here:

```
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot


#prepare the input parameters
parms=[]
for u in [3.]: 
  for b in [6.]:
    parms.append(
            { 
                'BETA' : b,          # inverse temperature
                'MU' : 0.0,          # chemical potential corresponding to half-filling
                'U' : u,             # Hubbard interaction
                'FLAVORS' : 2,       # corresponds to spin up/down
                'SITES' : 1,         # number of sites in the impurity
                'H' : 0.0,           # there is no magnetic field
                'H_INIT' : 0.05,     #  we set initial field to split spin up/down in order to trigger AF phase
                'OMEGA_LOOP' : 1,        # the selfconsistency runs in Matsubara frequencies
                'ANTIFERROMAGNET' : 1,   # allow Neel order
                'SYMMETRIZATION' : 0,    # do not enforce paramagnetic solution
                'NMATSUBARA' : 500,      # number of Matsubara frequencies
                'N' : 500,               # bins in imaginary time
                'CONVERGED' : 0.005,     # criterion for convergency
                'MAX_TIME' : 60,         # max. time spent in solver in a single iteration in seconds
                'G0OMEGA_INPUT' : "",    # forces to start from the local non-interacting Green's function
                'MAX_IT' : 10,           # max. number of self-consistency iterations
                'SWEEPS' : 10000,    # max. number of sweeps in a single iteration
                'THERMALIZATION' : 500, # number of thermalization sweeps
                'SEED' : 0,              # random seed
                'SOLVER' : "hybridization",   # we take the hybridization impurity solver
                'SC_WRITE_DELTA' : 1,         # input for the hybridization impurity solver is the hybridization function Delta, which has to be written by the selfconsistency
                'N_MEAS' : 5000,              # number of Monte Carlo steps between measurements
                'N_ORDER' : 50,               # histogram size
                'TWODBS' : 1,     # the Hilbert transformation integral runs in k-space, sets square lattice
                't' : 1,          # the nearest-neighbor hopping
                'tprime' : 0,     # the second nearest-neighbor hopping
                'L' : 64,         # discretization in k-space in the Hilbert transformation
                'GENERAL_FOURIER_TRANSFORMER' : 1,  # Fourier transformer for a general bandstructure
                'EPS_0' : 0,                        # potential shift for the flavor 0
                'EPS_1' : 0,                        # potential shift for the flavor 1
                'EPSSQ_0' : 4,                      # the second moment of the bandstructure for the flavor 0
                'EPSSQ_1' : 4,                      # the second moment of the bandstructure for the flavor 1
            }
        )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('hybrid_TWODBS_beta_'+str(p['BETA'])+'_U_'+str(p['U']),p)
    res = pyalps.runDMFT(input_file)

listobs=['0']  # we look only at flavor=0
    
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='hybrid_TWODBS*h5'), respath='/simulation/results/G_tau', what=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()

plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor=0}(\tau)$')
plt.title('DMFT-08, TWODBS option: Hubbard model on the square lattice')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

```
/path-to-alps-installation/bin/dmft hybrid_TWODBS_beta_6.0_U_3.0
```

The lattice-specific parameters in the resulting input file `hybrid_TWODBS_beta_6.0_U_3.0` are:

```
TWODBS = 1;     // the Hilbert transformation integral runs in k-space; sets square lattice
t = 1;          // the nearest-neighbor hopping
tprime = 0;     // the second nearest-neighbor hopping
L = 64;         // discretization in k-space in the Hilbert transformation
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                   // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                   // the second moment of the bandstructure for the flavor 1
```

Here `t=1` and `tprime=0` are explicit parameters (unlike the DOSFILE approach, where the hopping is fixed inside the pre-tabulated file), so `EPSSQ_i=4(t^2+tprime'^2)=4` follows directly from the formula given above.

### Output data and plots

Both `tutorial8a.py` (DOSFILE) and `tutorial8b.py` (TWODBS) end with the same kind of plot used throughout the earlier tutorials: the imaginary-time Green's function $G_{\text{flavor}=0}(\tau)$ at the end of the self-consistency loop, here for the square lattice at $U=3$, $\beta=6$. Because both scripts target the same lattice (square, $t=1$) and the same physical point, their converged $G(\tau)$ should agree with each other within statistical error — this is a useful cross-check that the DOSFILE histogram and the live TWODBS k-space integral describe the same physics.

Comparing this run to the Bethe-lattice results of [DMFT-02 Hybridization](../dmft02) and [DMFT-04 Mott](../dmft04) at the same $U$ and $\beta$, expect visible differences: the square lattice's DOS has a logarithmic van Hove singularity at the band center and hard edges at $\epsilon=\pm4t$, instead of the Bethe lattice's smooth semicircle, so the metal-insulator crossover happens at a different critical $U$ and the Green's function's short-time behavior differs even in the metallic phase.

### Summary and outlook

Single-site DMFT only ever needs the lattice's local density of states (or dispersion) — not its full real-space geometry — to close the self-consistency loop, whether that DOS comes from a pre-tabulated histogram (`DOSFILE`) or a live k-space Hilbert transform (`TWODBS`).

1. What lattice information enters the DMFT calculation, precisely? Compare your answer to what enters a classical (Weiss) mean-field treatment of, say, the Ising model — in what sense is single-site DMFT itself a mean-field theory?
2. Redo the Mott-transition scan of [DMFT-04 Mott](../dmft04) for the square lattice (`DOSFILE=DOS/DOS_Square_GRID4000` or `TWODBS=1`) instead of the Bethe lattice. Are there any significant changes to the critical $U$ or the shape of the crossover?
3. Recall the mean-field predictions for the Ising model in different spatial dimensions (e.g. the mean-field critical temperature scales with the coordination number $z$). Does the coordination number of the lattices compared here ($z=3,4,6$ for hexagonal, square, cubic) leave a similar trace in the DMFT results?
4. Run both `tutorial8a.py` (DOSFILE) and `tutorial8b.py` (TWODBS) at the same $U$, $\beta$, and compare the converged $G(\tau)$ curves directly. How does their agreement depend on the DOS histogram's `GRID` resolution versus the k-space discretization `L`?
