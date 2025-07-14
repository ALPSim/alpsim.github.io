
---
title: DMFT-09 Néel Transition
math: true
toc: true
---

## Néel transition in single site DMFT

In this example we reproduce Fig. 11 in the DMFT review by [Georges it et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). The series of six curves shows how the system, a Hubbard model on the Bethe lattice with interaction $U=3D/\sqrt{2}$ at half filling, enters an antiferromagnetic phase upon cooling.

These examples can either be started by directly invoking a command or python script on the command line. Running one of the dmft parameter sets manually, e.g. by entering the directory 'beta_14_U3_tsqrt2' in `tutorials/dmft-0j-xxx`, and running the dmft code '/opt/alps/bin/dmft xxx.param' leads to the same results.

Note: the example merges the tutorials [DMFT-02 CT-HYB: the CT-HYB QMC solver](../dmft02), [DMFT-03 CT-INT: the CT-INT QMC solver](../dmft03) and [DMFT-07 The Hirsch-Fye solver](../dmft07) .

### Hybridization Expansion CT-HYB

We start by running a continuous-time quantum Monte Carlo code - the hybridization expansion algorithm CT-HYB. The CT-HYB simulation will run for about a minute per iteration. The parameter files for running this simulation can be found in the directory `tutorials/dmft-02-hybridization`.

The main parameters are:

```
SEED = 0; //Monte Carlo Random Number Seed 
THERMALIZATION = 1000;  Thermalization Sweeps 
SWEEPS = 1000000; Total Sweeps to be computed 
MAX_TIME = 60;  Maximum time to run the simulation 
BETA = 12.;  Inverse temperature 
SITES = 1;  This is a single site DMFT simulation, so Sites is 1 
N = 16;  Number of time slices (you will see that this parameter is rather small) 
NMATSUBARA = 500;  The number of Matsubara frequencies 
U = 3;  Interaction energy 
t = 1;  hopping parameter. For the Bethe lattice considered here $W=2D=4t$
MU = 0;  Chemical potential 
H = 0;  Magnetic field 
SYMMETRIZATION = 0;  We are not enforcing a paramagnetic self consistency condition 
SOLVER = Hybridization;  The Hybridization solver
```

To start a simulation with the command line, type:

```
dmft hybrid.param
```

The code will run for up to 10 self-consistency iterations. In the directory in which you run the program you will find Green's functions files G_tau_i as well the self energies (selfenergy_i) and Green's functions in frequency space G_omega_i in your output directory. G_tau in these examples has two entries: a spin-up and a spin-down column. The entry at $\beta$ is the negative density; where it is different outside of error bars the system is in an antiferromagnetic phase. You can run the following lines in the python shell in order to plot the Green's functions for different $\beta$ and compare your result to Fig. 11 of [Georges it et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13). In the section ection Hirsch-Fye we will reproduce the same results with a discrete-time Quantum Monte Carlo code: the Hirsch Fye code. The parameters are the same, apart from the command for the solver.

You can find the parameter files (called \*tsqrt2) in the directory `tutorials/dmft-02-hybridization` in the examples. Alternatively you can run the python script `tutorial2a.py`:

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.pyplot

#prepare the input parameters
parms=[]
for b in [6.,8.,10.,12.,14.,16.]:
    parms.append(
        {
            'ANTIFERROMAGNET'     : 1,
            'CONVERGED'           : 0.03,
            'F'                   : 10,
            'FLAVORS'             : 2,
            'H'                   : 0,
            'H_INIT'              : 0.2,
            'MAX_IT'              : 10,
            'MAX_TIME'            : 60,
            'MU'                  : 0,
            'N'                   : 1000,
            'NMATSUBARA'          : 1000,
            'N_FLIP'              : 0,
            'N_MEAS'              : 10000,
            'N_MOVE'              : 0,
            'N_ORDER'             : 50,
            'N_SHIFT'             : 0,
            'OMEGA_LOOP'          : 1,
            'OVERLAP'             : 0,
            'SEED'                : 0,
            'SITES'               : 1,
            'SOLVER'              : 'Hybridization',
            'SYMMETRIZATION'      : 0,
            'TOLERANCE'           : 0.01,
            'U'                   : 3,
            't'                   : 0.707106781186547,
            'SWEEPS'              : 100000000,
            'THERMALIZATION'      : 1000,
            'BETA'                : b,
            'CHECKPOINT'          : 'solverdump_beta_'+str(b)+'.task1.out.h5',
            'G0TAU_INPUT'         : 'G0_tau_input_beta_'+str(b)
        }
    )
#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

After running these simulations compare the output to the Hirsch-Fye results of the section [Hirsch-Fye]() or the DMFT review, or to the interaction expansion results of the section Interaction Expansion CT-INT . To rerun a simulation, you can specify a starting solution by defining G0OMEGA_INPUT, e.g. copy G0omga_output to G0_omega_input, specify G0OMEGA_INPUT = G0_omega_input in the parameter file and rerun the code. You can observe the transition to the antiferromagnetic phase by plotting the Green's functions using the script:

```
flavors=parms[0]['FLAVORS']
listobs=[]   
for f in range(0,flavors):
    listobs.append('Green_'+str(f))

ll=pyalps.load.Hdf5Loader()
data = ll.ReadMeasurementFromFile(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', measurements=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G(\tau)$')
plt.title('Hubbard model on the Bethe lattice')
pyalps.pyplot.plot(data)
plt.legend()
plt.show()
```

You will notice that the results are relatively noisy. The reason for that is that the expansion order at such high temperatures is very small, which renders the measurement procedure inefficient. You can improve statistics by increasing the total run time (MAX_TIME) or by running it on more than one CPU. For running it with MPI, try `mpirun -np procs dmft parameter_file` or consult the man page of your mpi installation.

If you want to check the convergence of your DMFT self-consistency, you can plot the Green's functions of different iterations using `tutorial2b.py`:

```
ll=pyalps.load.Hdf5Loader()
for p in parms:
    data = ll.ReadDMFTIterations(pyalps.getResultFiles(pattern='parm_beta_'+str(p['BETA'])+'.h5'), measurements=listobs, verbose=True)
    grouped = pyalps.groupSets(pyalps.flatten(data), ['iteration'])
    nd=[]
    for group in grouped:
        r = pyalps.DataSet()
        r.y = np.array(group[0].y)
        r.x = np.array([e*group[0].props['BETA']/float(group[0].props['N']) for e in group[0].x])
        r.props = group[0].props
        r.props['label'] = r.props['iteration']
        nd.append( r )
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G(\tau)$')
    plt.title(r'\beta = %.4s' %nd[0].props['BETA'])
    pyalps.pyplot.plot(nd)
    plt.legend()
    plt.show()
```

It is usually best to observe convergence in the self energy, which is much more sensitive. Note that longer simulations are required to obtain smoother Green's fuctions and self energies.

### Interaction Expansion CT-INT

It is instructive to run the same calculations as in the section Hybridization Expansion CT-HYB with a CT-INT code. This code performs an expansion in the interaction (instead of the hybridization). The corresponding parameter files are very similar, you can find them in the directory `tutorials/dmft-03-interaction`. If you prefer to run the simulations in python you can use `tutorial3a.py` and `tutorial3b.py` files.

### Hirsch Fye

We compare the continous time results by running a discrete time Monte Carlo code: the [Hirsch Fye code](https://link.aps.org/doi/10.1103/PhysRevLett.56.2521). The Hirsch Fye algorithm is described in [here](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13), and this review also provides an open source implementation for the codes. More information can also be found in [Blümer's PhD](http://komet337.physik.uni-mainz.de/Bluemer/Thesis/bluemer_color.pdf). While many improvements have been developed (see e.g. Alvarez08 or [Nukala09](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111)), the algorithm has been replaced by [continuous-time algorithms](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123).

The Hirsch Fye simulation will run for about a minute per iteration. The parameter files for running this simulation can be found in the directory `tutorials/dmft-07-hirschfye`.

The main parameters are:

```
SEED = 0; //Monte Carlo Random Number Seed 
THERMALIZATION = 10000;  Thermalization Sweeps 
SWEEPS = 1000000; Total Sweeps to be computed 
MAX_TIME = 60;  Maximum time to run the simulation 
BETA = 12.;  Inverse temperature 
SITES = 1;  This is a single site DMFT simulation, so Sites is 1 
N = 16;  Number of time slices (you will see that this parameter is rather small) 
NMATSUBARA = 500;  The number of Matsubara frequencies 
U = 3;  Interaction energy 
t = 1;  hopping parameter. For the Bethe lattice considered here $W=2D=4t$
MU = 0;  Chemical potential 
H = 0;  Magnetic field 
SYMMETRIZATION = 0;  We are not enforcing a paramagnetic self consistency condition 
SOLVER = /opt/alps/bin/hirschfye;  The path to the external Hirsch Fye solver
```

To start a simulation type:

```
dmft hirschfye.param
```

or run the python script `tutorial7a.py`:

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.pyplot

#prepare the input parameters 
parms=[]
for b in [6.,8.,10.,12.,14.,16.]: 
    parms.append(
        { 
            'ANTIFERROMAGNET'     : 1,
            'CONVERGED'           : 0.03,
            'FLAVORS'             : 2,
            'H'                   : 0,
            'MAX_IT'              : 10,
            'MAX_TIME'            : 60,
            'MU'                  : 0,
            'N'                   : 16,
            'NMATSUBARA'          : 500, 
            'OMEGA_LOOP'          : 1,
            'SEED'                : 0, 
            'SITES'               : 1,
            'SOLVER'              : '/opt/alps/bin/hirschfye',
            'SYMMETRIZATION'      : 0,
            'TOLERANCE'           : 0.01,
            'U'                   : 3,
            't'                   : 0.707106781186547,
            'SWEEPS'              : 1000000,
            'THERMALIZATION'      : 10000,
            'BETA'                : b,
            'G0OMEGA_INPUT'       : 'G0_omega_input_beta_'+str(b),
            'BASENAME'            : 'hirschfye.param'
        }
    )

#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

The code will run for up to 10 self-consistency iterations. In the directory in which you run the program you will find Green's functions files G_tau_i as well the self energies (selfenergy_i) and Green's functions in frequency space G_omega_i in your output directory. G_tau in these examples has two entries: a spin-up and a spin-down column. The entry at $\beta$ is the negative density; where it is different outside of error bars the system is in an antiferromagnetic phase. You can run the following lines in the python shell in order to plot the Green's functions for different $\beta$ and compare your result to Fig. 11 of [Georges it et al.](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13).

```
flavors=parms[0]['FLAVORS']
listobs=[]   
for f in range(0,flavors):
    listobs.append('Green_'+str(f))

ll=pyalps.load.Hdf5Loader()
data = ll.ReadMeasurementFromFile(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', measurements=listobs, verbose=True)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])
plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G(\tau)$')
plt.title('Hubbard model on the Bethe lattice')
pyalps.pyplot.plot(data)
plt.legend()
plt.show()
```

As a discrete time method, HF suffers from $\Delta\tau$ - errors. Pick a set of parameters and run it for sucessively larger N! Also: you're running the DMFT simulation using an (almost) converged input bath function. By deleting the file G0_omega_input you can restart the calculation from the free solution and observe convergence.

