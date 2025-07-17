
---
title: DMFT-02 Hybridization
math: true
toc: true
---

## Hybridization Expansion CT-HYB

We start by running a continuous-time quantum Monte Carlo code - the hybridization expansion algorithm CT-HYB. As an example we reproduce Fig. 11 in the DMFT review by Georges et al.. The series of six curves shows how the system, a Hubbard model on the Bethe lattice with interaction $U=3D/\sqrt{2}$r at half filling, enters an antiferromagnetic phase upon cooling. In tutorials 03 and 07 we will reproduce the same results with the interaction expansion continuous-time solver and with the discrete-time Quantum Monte Carlo Hirsch-Fye code, respectively. The input parameters are the same, apart from a few solver-related parameters.

The CT-HYB simulation will run in total roughly 1 hour if you want to reproduce all 6 curves in the Fig. 11 mentioned above. The files for this tutorial may be found in the directory tutorials/dmft-02-hybridization.

All DMFT tutorials can be started using a python script. The python script generates parameter files, run them, and plot the results. You can run the short script [`tutorial2.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2.py) reproducing only 2 out of the 6 curves (runtime: roughly 20 minutes), or the long version [`tutorial2_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2_long.py) (runtime: roughly 1 hour) or the longer version to reproduce all curves in the figure.
    
The python script `tutorial2.py` automatically prepares the input files for the 2 simulations, `parm_beta_6.0` and `parm_beta_12.0`, and runs them (/path-to-alps-installation/bin/dmft parm_beta_x).

```
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

#prepare the input parameters
parms=[]
for b in [6., 12.]:
    parms.append(
        {
             'ANTIFERROMAGNET'     : 1,
             'CONVERGED'           : 0.003,
             'FLAVORS'             : 2,
             'H'                   : 0,
             'H_INIT'              : 0.03*b/8.,
             'MAX_IT'              : 6,
             'MAX_TIME'            : 300,
             'MU'                  : 0,
             'N'                   : 250,
             'NMATSUBARA'          : 250,
             'N_MEAS'              : 10000,
             'OMEGA_LOOP'          : 1,
             'SEED'                : 0,
             'SITES'               : 1,
             'SOLVER'              : 'hybridization',
             'SC_WRITE_DELTA'      : 1,
             'SYMMETRIZATION'      : 0,
             'U'                   : 3,
             't'                   : 0.707106781186547,
             'SWEEPS'              : int(10000*b/16.),
             'THERMALIZATION'      : 1000,
             'BETA'                : b
        }
    )


#write the input file and run the simulation
for p in parms:
    input_file = pyalps.writeParameterFile('parm_beta_'+str(p['BETA']),p)
    res = pyalps.runDMFT(input_file)
```

The input file `parm_beta_6.0` produced by the script above with added comments on the parameters:

```
H_INIT = 0.0225   //  initial magnetic field in the direction of quantization axis, to produce the initial Weiss field
ANTIFERROMAGNET = 1   // allow antiferromagnetic ordering; in single site DMFT it is meaningfull only for bipartite lattices
SEED = 0   // Monte Carlo Random Number Seed 
CONVERGED = 0.003   // criterion for the convergency of the iterations
MAX_IT = 6   // upper limit on the number of iterations (the selfconsistency may be stopped before if criterion based on CONVERGED is reached)
SWEEPS = 3750   // Total number of sweeps to be computed (the solver may be stopped before reaching this limit on run-time limit set by MAX_TIME)
FLAVORS = 2   // flavors 0 and 1 correspond to spin up and down
SYMMETRIZATION = 0   // We are not enforcing a paramagnetic self consistency condition (symmetry in flavor 0 and 1)
NMATSUBARA = 250   // The cut-off for Matsubara frequencies 
H = 0   // Magnetic field in the direction of quantization axis
OMEGA_LOOP = 1   // the selfconsistency runs in Matsubara frequencies
SITES = 1   // number of sites of the impurity: for single site DMFT simulation it is 1
N = 250   // auxiliary discretization of the imaginary-time Green's function
BETA = 6.0   // Inverse temperature
U = 3   // Interaction strength
MAX_TIME = 300   // Upper time limit in seconds to run the impurity solver (per iteration)
SC_WRITE_DELTA = 1   // option for selfconsistency to write the hybridization function for the impurity solver
N_MEAS = 10000   // number of updates in between measurements
SOLVER = "hybridization"   // The Hybridization solver
THERMALIZATION = 1000   // Thermalization Sweeps 
MU = 0   // Chemical potential; for particle-hole symmetric models corresponds MU=0 to half-filled case
t = 0.707106781187   // hopping parameter; for the Bethe lattice considered here $W=2D=4t$
```

Note that there is no parameter specifying the band structure or lattice type. By default a Bethe lattice is assumed, but this can be changed (see [DMFT-08 Setting a particular lattice](../dmft08)).

A specification of the initial Weiss field (set by the variables G0OMEGA_INPUT or G0TAU_INPUT) is missing as well - the program will thus at initialization compute the non-interacting Green's function. It will use the initial magnetic field H_INIT, which produces in this case a small difference between flavors (0 and 1 representing $\uparrow$,\ $\downarrow$) to start away from the paramagnetic solution - the reason for that is that in very short simulations (like this tutorial) starting from a paramagnetic Weiss field could mean that the random noise would not produce enough difference in the first few iterations to get the system away from the paramagnetic regime. A badly converged paramagnet would then appear as a solution. The dependence of H_INIT on BETA serves for optimization of the run, lowering the number of needed iterations.

The code will run up to 6 self-consistency iterations. For a precise simulation one can raise this number and the simulation shall stop on the convergency criterion specified by the parameter CONVERGED. In the directory in which you run the program you will find Green's functions files G_tau_i as well the self energies (selfenergy_i) and Green's functions in Matsubara representation (frequency space) G_omega_i. G_tau in these examples has two entries: a spin-up and a spin-down column. The entry at \tau=\beta^- is the negative occupation (density); by that we may get magnetization of the system.

Error bars may be estimated via successive iterations on a converged system.

To rerun a simulation, you can specify a starting solution by defining the input parameter G0OMEGA_INPUT, e.g. copy the desired G0omega_output to filename_X and specify input parameter 'G0OMEGA_INPUT':'filename_X' in the python script (or G0OMEGA_INPUT=filename_X in the input file directly) and rerun the code.

As in the Fig. 11 in the DMFT review Georges it et al. you can observe the transition to the antiferromagnetic phase by plotting the Green's functions in the imaginary-time represention (part of `tutorial2.py` and `tutorial2_long.py`):

```
listobs=['0', '1']   # we will plot both flavors 0 and 1

# load the imaginary-time Green's function in final iteration from all result files
data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='parm_beta_*h5'), respath='/simulation/results/G_tau', what=listobs)
for d in pyalps.flatten(data):
    d.x = d.x*d.props["BETA"]/float(d.props["N"])   # rescale horizontal axis
    d.props['label'] = r'$\beta=$'+str(d.props['BETA'])+'; flavor='+str(d.props['observable'][len(d.props['observable'])-1])

plt.figure()
plt.xlabel(r'$\tau$')
plt.ylabel(r'$G_{flavor}(\tau)$')
plt.title('DMFT-02: Neel transition for the Hubbard model on the Bethe lattice\n(using the Hybridization expansion impurity solver)')
pyalps.plot.plot(data)
plt.legend()
plt.show()
```

You will notice that the results are relatively noisy. The reason for that is that the expansion order at such high temperatures is very small, which renders the measurement procedure inefficient. You can improve statistics by increasing the total runtime (MAX_TIME) and/or the number of SWEEPS. The solver may run on more than one CPU using MPI, try `SOLVER = "mpirun -np procs /path-to-ALPS-installation/bin/hybridization"` (currently not working due to issue with path prefix) or consult the man page of your mpi installation.

If you want to check the convergence of your DMFT self-consistency, you can plot the Green's functions of different iterations using [`tutorial2eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-02-hybridization/tutorial2eval.py), whose code is shown here:

```
listobs=['0']   # we look at a single flavor (=0) 
res_files = pyalps.getResultFiles(pattern='parm_*.h5')  # we look for result files

## load all iterations of G_{flavor=0}(tau)
data = pyalps.loadDMFTIterations(res_files, observable="G_tau", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = d.x * d.props['BETA']/float(d.props['N'])
        d.props['label'] = 'it'+d.props['iteration']
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$\tau$')
    plt.ylabel(r'$G_{flavor=0}(\tau)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta= common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```

It has to be noted that the iteration-resolved results are loaded by a different function (`pyalps.loadDMFTIterations`) than the final results (`pyalps.loadMeasurements`), because the iteration-resolved data is stored using a different folder structure (/simulation/iteration/number/results/) than the ALPS default (/simulation/results/) used for storage of the final results.

As already mentioned above, the occupation $n_f$ equals to $G_f(\tau=\beta^-)$, which is the last entry of the imaginary time Green's function for flavor $f$. Code for printing the final occupancies and plotting them vs $\beta$ is a part of `tutorial2eval.py`,

```
## load the final iteration of G_{flavor=0}(tau)
data_G_tau = pyalps.loadMeasurements(res_files, respath='/simulation/results/G_tau', what=listobs, verbose=False)  

print("Occupation in the last iteration at flavor=0")
for d in pyalps.flatten(data_G_tau):
    # obtain occupation using relation: <n_{flavor=0}> = -<G_{flavor=0}(tau=beta)>
    d.y = np.array([-d.y[-1]])
    print("n_0(beta =",d.props['BETA'],") =",d.y[0])
    d.x = np.array([0])
    d.props['observable'] = 'occupation'

occupation = pyalps.collectXY(data_G_tau, 'BETA', 'occupation')
for d in occupation:
    d.props['line']="scatter"

plt.figure()
pyalps.plot.plot(occupation)
plt.xlabel(r'$\beta$')
plt.ylabel(r'$n_{flavor=0}$')
plt.title('Occupation versus BETA')

plt.show()
```

As our self-consistency is in Matsubara frequencies (recall parameter OMEGA_LOOP=1), the criterion for convergency is $\mathrm{max}|G_{f}^{it}(i\omega_n)-G_{f}^{it+1}(i\omega_n)|\lt$CONVERGED. The imaginary part (real part analogously) Matsubara frequency Green's function is plotted by

```
from math import pi

## load all iterations of G_{flavor=0}(i omega_n)
data = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped = pyalps.groupSets(pyalps.flatten(data), ['BETA'])
for sim in grouped:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## rescale x-axis and set label
    for d in sim:
        d.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d.x])
        d.y = np.array(d.y.imag)
        d.props['label'] = "it"+d.props['iteration']
        d.props['line']="scatter"
        d.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ G_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```

It is usually best to observe convergence in the selfenergy, which is much more sensitive. Note that longer simulations are required to obtain smoother Green's functions and selfenergies; in this simulation the noise in the intermediate range of Matsubara frequencies is very strong. The selfenergy is obtained via Dyson's equation as $\Sigma_f^{it}(i\omega_n)=G0_f^{it}(i\omega_n)^{-1}-G_f^{it}(i\omega_n)^{-1}$ and its imaginary part is plotted by this fragment of `tutorial2eval.py` (real part analogously):

```
## load all iterations of G_{flavor=0}(i omega_n) and G0_{flavor=0}(i omega_n)
data_G = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G_omega", measurements=listobs, verbose=False)
data_G0 = pyalps.loadDMFTIterations(pyalps.getResultFiles(pattern='parm_*.h5'), observable="G0_omega", measurements=listobs, verbose=False)

## create a figure for each BETA
grouped_G = pyalps.groupSets(pyalps.flatten(data_G), ['BETA','observable'])
for sim in grouped_G:
    common_props = pyalps.dict_intersect([ d.props for d in sim ])
    
    ## compute selfenergy using the Dyson equation, rescale x-axis and set label
    for d_G in sim:
        # find corresponding dataset from data_G0
        d_G0 = [s for s in pyalps.flatten(data_G0) if s.props['iteration']==d_G.props['iteration'] and s.props['BETA']==common_props['BETA']][0]
        d_G.x = np.array([(2.*n+1)*pi/common_props['BETA'] for n in d_G.x])
        # Dyson equation
        Sigma = np.array([1./d_G0.y[w] - 1./d_G.y[w] for w in range(len(d_G.y))])
        d_G.y = np.array(Sigma.imag)
        d_G.props['label'] = "it"+d_G.props['iteration']
        d_G.props['line']="scatter"
        d_G.props['fillmarkers'] = False
    
    ## plot all iterations for this BETA
    plt.figure()
    plt.xlabel(r'$i\omega_n$')
    plt.ylabel(r'$Im\ \Sigma_{flavor=0}(i\omega_n)$')
    plt.title('Simulation at ' + r'$\beta = {beta}$'.format(beta=common_props['BETA']))
    pyalps.plot.plot(sim)
    plt.legend()

plt.show()
```
