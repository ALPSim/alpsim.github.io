
---
title: DMFT-08 Lattices
math: true
toc: true
---

## Setting a particular lattice

### Option DOSFILE

All the previous tutorials dealt with the Bethe lattice, which has semicircular density of states. Now we show how to set the input parameters in order to specify density of states of a particular lattice. In order to run the simulation, you may take scripts from the previous tutorials and just replace the parameters list in order to do similar simulations. You may for instance look at the MIT transition as it was done in the Tutorial 4.

For a general lattice, you have to provide the density of states of your lattice. Apart from that, several other changes are necessary in order to run the simulation. A working python script [`tutorial8a.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8a.py) setting an input file and running the simulation follows:

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
```

Lattice-specific parameters which appear in the input files are listed below:

```
DOSFILE = DOS_Square_GRID4000; // specification of the file with density of states
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                      // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                      // the second moment of the bandstructure for the flavor 1
```

Note1: if you do not provide the bandstructure parameters (EPS_i, EPSSQ_i) in the input file, then they will be calculated using the given DOS (since revision 6146) as  $EPS\_{flavor=i} = \int \mathrm{d}\epsilon\ DOS\_{band=i/2}(\epsilon)\ \epsilon$, $EPSSQ\_{flavor=i} = \int \mathrm{d}\epsilon\ DOS\_{band=i/2}(\epsilon)\ \epsilon^2$.

Note2: the antiferromagnetic selfconsistency loop assumes Neel order. Therefore it is only applicable for bipartite lattices.

Note3: the density of states has to be provided by the user. In the tutorial we provide the DOS for

- the square lattice DOS_Square_GRID4000 (generated by [`DOS_Square.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Square.py) for setting GRID=4000); the corresponding parameters are EPSSQ_i=4
- the cubic lattice DOS_Cubic_GRID360 (generated by [`DOS_Cubic.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Cubic.py) for setting GRID=360); the corresponding parameters are EPSSQ_i=6
- the hexagonal lattice DOS_Hexagonal_GRID4000 (generated by [`DOS_Hexagonal.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/DOS/DOS_Hexagonal.py) for setting GRID=4000); the corresponding parameters are EPSSQ_i=3
- the Bethe lattice DOS_Bethe (generated by `DOS_Bethe.py`); the corresponding parameters are EPSSQ_i=1; for testing

Note4: for a multiband simulation [$n_{bands}=FLAVORS/2$] with known DOS, the DOS-file has to consist of $2\*n\_{bands} columns$. The number of bins [=number of lines of the input file] for DOS has to be the same for all bands. The $i$-th line has the structure as follows

$$
e\_{1,i}\ \ \ DOS\_{band1}(e\_{1,i})\ \ \ e\_{2,i}\ \ \ DOS\_{band2}(e\_{2,i})\ \ \ \ldots
$$

### Option TWODBS

For the case of 2-dimensional lattice, there is an implementation of the Hilbert transformation with integral over k-space [parameter L sets the discretization in each dimension of the reciprocal space]. Currently, there is implementation for these dispersions:

- square lattice [set TWODBS=square] with nearest-neighbor [corresponding parameter: t] and next-nearest-neighbor hoppings [corresponding parameter: tprime]; the second moment EPSSQ_i is $4(t^2 + tprime^2)$;
- hexagonal lattice [set TWODBS=hexagonal] with nearest-neighbor hoppings [corresponding parameter: t]; the second moment EPSSQ_i is $3t^2$.

A working python script [`tutorial8b.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-08-lattices/tutorial8b.py) to produce the input file and run the simulation is shown here:

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
```

The lattice-specific parameters are listed here:

```
TWODBS = 1;     // the Hilbert transformation integral runs in k-space; sets square lattice
t = 1;          // the nearest-neighbor hopping
tprime = 0;     // the second nearest-neighbor hopping
L = 128;        // discretization in k-space in the Hilbert transformation
GENERAL_FOURIER_TRANSFORMER = 1;  // Fourier transformer for a general bandstructure
EPS_0 = 0;                        // potential shift for the flavor 0
EPS_1 = 0;                        // potential shift for the flavor 1
EPSSQ_0 = 4;                   // the second moment of the bandstructure for the flavor 0
EPSSQ_1 = 4;                   // the second moment of the bandstructure for the flavor 1
```

### Final remarks

Question: what lattice information does enter into the DMFT calculation? Compare with classical mean-field.

Task: try to redo the Tutorial 4 for a different lattice (than the Bethe lattice) and inspect the MIT. Are there any significant changes?

Recall the mean-field predictions for Ising model (for different dimensions).
