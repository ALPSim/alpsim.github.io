
---
title: DMRG-04 Correlations
math: true
toc: true
---

## Correlation Functions

The most important correlation functions in many-body physics are two-point correlators, i.e. correlators that involve two sites $i$ and $j$, such as $\langle S^+_i S^-_j \rangle$. Short-ranged ones determine energies (in the typical short-ranged Hamiltonians of correlation physics), long-ranged ones determine correlation lengths.

### Another Go At The Energy Per Bond

As already mentioned above, the ground state energy per bond in both spin-1/2 and spin-1 chain is given by

$$
e_0(i) = \frac{1}{2} (\langle S^+\_i S^-\_{i+1}\rangle  + \langle S^-\_i S^+\_{i+1}\rangle ) + \langle S^z_i S^z\_{i+1} \rangle 
$$

This gives the energy of each bond individually, but we are interested in the thermodynamic limit, where all bonds are on equal footing and hence should have the same energy unless there is some physical breaking of translational invariance.

Obviously, the bonds that are closest to the thermodynamic limit behaviour are those in the chain center. So, the direct approach would be to calculate $e_0(L/2)$ and extrapolate it first in $D$ for fixed $L$ and then in $L$.

Before you do this, however, plot for some values of $D$ and not too small $L e_0(i)$ versus $i$ (as a check of the program, you may also consider the three contributions individually before you do the sum. What relationship between them should exist?).

What do you observe for spin-1? And what for spin-1/2?

For the spin-1/2 chain, bond energies oscillate strongly between odd and even numbered bonds. This is because the open ends make themselves felt very strongly due to criticality and because the spin-1/2 chain is on the verge of dimerization, i.e. a spontaneous breaking of translational symmetry of the ground state down to a periodicity of 2. It is therefore more meaningful to extrapolate the average energy of a strong and a weak bond; you immediately gain lots of accuracy. This is yet another example that it is worthwhile to have a close look at the actual output of DMRG by considering various local or (here) almost local observables.

### Spin-Spin Correlations: Spin-1/2

Take a relatively long chain (say, $L=192$), and calculate  $\langle S^z_i S^z_j \rangle$ for various increasing $D$.

Now plot $C_l = \langle S^z\_{L/2-l/2} S^z\_{L/2+l/2} \rangle$ where you round the positions such that their distance is l. The purpose of this is to center the correlators about the chain center to make boundary effects as small as possible; there are also other ways of doing this (like averaging over several correlators with same site distance, also more or less centered). As we expect a power law, use a log-log plot. Take absolute values or multiply out the antiferromagnetic factor $(-1)^l$.

What you should see, is a power law on short distances, but a faster (in fact, exponential) decay for larger distances. This has two reasons: (i) the finite system size cuts off the power-law correlations; but as we took a large system size here, this should not matter too much. (ii) DMRG's algorithmic structure effectively generates correlators which are superpositions of up to $D^2$ purely exponential decays, and therefore can only mimic power laws by such superpositions - at large distance, the slowest exponential decay will survive all the others, replacing the power law by an exponential law. The larger you choose $D$, the further you push out this crossover.

#### Using parameter files

The following parameter file [`spin_one_half`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one_half) will setup this run for us (once again, for illustration we shall use a smaller system and number of states than the more realistic numbers stated above). In this example we consider a chain of length $L=32$ and we setup multiple runs with different numbers of states $D$. We use 6 sweeps. Make sure that the correlations look symmetric.

    LATTICE="open chain lattice"
    MODEL="spin"
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    Sz_total=0
    SWEEPS=6
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_AVERAGE[Magnetization]=Sz
    MEASURE_AVERAGE[Exchange]=exchange
    MEASURE_LOCAL[Local magnetization]=Sz
    MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz
    MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"
    L=32
    { MAXSTATES=20 }
    { MAXSTATES=40 }
    { MAXSTATES=60 }

#### Using Python

The script [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one_half.py) sets up three runs with different numbers of states $D$ and loads the results.

    import pyalps
    import numpy as np
    import matplotlib.pyplot as plt
    import pyalps.plot
    parms = []
    for D in [20,40,60]:
        parms.append( { 
            'LATTICE'                               : 'open chain lattice', 
            'MODEL'                                 : 'spin',
            'CONSERVED_QUANTUMNUMBERS'              : 'N,Sz',
            'Sz_total'                              : 0,
            'J'                                     : 1,
            'SWEEPS'                                : 6,
            'NUMBER_EIGENVALUES'                    : 1,
            'L'                                     : 32,
            'MAXSTATES'                             : D,
            'MEASURE_AVERAGE[Magnetization]'        : 'Sz',
            'MEASURE_AVERAGE[Exchange]'             : 'exchange',
            'MEASURE_LOCAL[Local magnetization]'    : 'Sz',
            'MEASURE_CORRELATIONS[Diagonal spin correlations]'      : 'Sz',
            'MEASURE_CORRELATIONS[Offdiagonal spin correlations]'   : 'Splus:Sminus'
            } )
            
    input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
    res = pyalps.runApplication('dmrg',input_file,writexml=True)
    
    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))

Now we can extract e.g. Sz:Sz correlations

    curves = []
    for run in data:
        for s in run:
            if s.props['observable'] == 'Diagonal spin correlations':
                d = pyalps.DataSet()
                d.props['observable'] = 'Sz correlations'
                d.props['label'] = 'D = '+str(s.props['MAXSTATES'])
                L = int(s.props['L'])
                d.x = np.arange(L)
           
                # sites with increasing distance l symmetric to the chain center
                site1 = np.array([int(-(l+1)/2.0) for l in range(0,L)]) + L/2
                site2 = np.array([int(  l   /2.0) for l in range(0,L)]) + L/2
                indices = L*site1 + site2
                d.y = abs(s.y[0][indices])
           
                curves.append(d)
and plot them vs. site distance.

    plt.figure()
    pyalps.plot.plot(curves)
    plt.xscale('log')
    plt.yscale('log')
    plt.legend()
    plt.title('Spin correlations in antiferromagnetic Heisenberg chain (S=1/2)')
    plt.ylabel('correlations $| \\langle S^z_{L/2-l/2} S^z_{L/2+l/2} \\rangle |$')
    plt.xlabel('distance $l$')
    plt.show()

### Spin-Spin Correlations: Spin-1

In the spin-1 chain, we do expect exponential decay (with an analytic modification), so the exponential nature of the correlators of DMRG should fit well. Again, choose a long chain (say,$L=192$), and calculate  $\langle S^z_i S^z_j \rangle$ for various increasing $D$.

Now plot $C_l = \langle S^z\_{L/2-l/2} S^z\_{L/2+l/2} \rangle$ where you round the positions such that their distance is $l$, as before. As we expect an exponential law, use a log-lin plot, again eliminating the negative signs.

From the log-lin plot, extract a correlation length. It will depend (and in fact monotonically increase with) $D$. Has it converged when you reach e.g. $D=300$? How does this compare to the convergence for the same number of states of local or quasi-local observables such as magnetization or energy?

In fact, the calculation of correlation lengths is much harder to converge than that of the local quantities. This is due to the fact that a more profound algorithmic analysis reveals DMRG to be an algorithm geared especially well to the optimal representation of local quantities, not so much non-local ones as long-ranged correlators.

#### Using parameter files

The parameter file [`spin_one`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one) looks much like the one for the previous example, but replacing the lattice and the model as follows:

    LATTICE_LIBRARY="my_lattices.xml"
    LATTICE="open chain lattice with special edges 32"
    MODEL="spin"
    local_S0=0.5
    local_S1=1
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    Sz_total=0
    SWEEPS=6
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_AVERAGE[Magnetization]=Sz
    MEASURE_AVERAGE[Exchange]=exchange
    MEASURE_LOCAL[Local magnetization]=Sz
    MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz
    MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"
    { MAXSTATES=20 }
    { MAXSTATES=40 }
    { MAXSTATES=60 }

#### Using Python

The main difference of the script [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one.py) with respect to the previous one is the definition of lattice and model.

    parms = []
    L = 32
    for D in [20,40,60]:
        parms.append( { 
            'LATTICE_LIBRARY'                       : 'my_lattices.xml',
            'LATTICE'                               : 'open chain lattice with special edges '+str(L),
            'MODEL'                                 : 'spin',
            'local_S0'                              : 0.5,
            'local_S1'                              : 1,
            'CONSERVED_QUANTUMNUMBERS'              : 'N,Sz',
            'Sz_total'                              : 0,
            'J'                                     : 1,
            'SWEEPS'                                : 4,
            'NUMBER_EIGENVALUES'                    : 1,
            'MAXSTATES'                             : D,
            'MEASURE_AVERAGE[Magnetization]'        : 'Sz',
            'MEASURE_AVERAGE[Exchange]'             : 'exchange',
            'MEASURE_LOCAL[Local magnetization]'    : 'Sz',
            'MEASURE_CORRELATIONS[Diagonal spin correlations]'      : 'Sz',
            'MEASURE_CORRELATIONS[Offdiagonal spin correlations]'   : 'Splus:Sminus'
        } )

After running the simulation, correlations can be extracted and plotted in the same way as before.

### Sometimes There Is A Way Out

In the special case of the spin-1 chain, we have a loophole for the calculation of the correlation length, which is related to the weird observation that the first excitation was not a bulk excitation. It can be shown that a good toy model for a spin-1 chain is given as follows: at each site of a spin-1, you put two spin-1/2, and construct the spin-1 states from the triplet states of the two spin-1/2 at each site. The ground state is then approximated quite well by a state where you link two spin-1/2 on *neighbouring* sites by a singlet state.

In this construction, for open boundary conditions (but not periodic ones), on the first and on the last site there will be two lonely spins-1/2 without partner. These two spins-1/2 can form 4 states among themselves, which in the toy model are degenerate: the ground state is four-fold degenerate. In the real spin-1 chain, this four-fold degeneracy (from one state of total spin 0 and three of total spin 1) is only achieved in the thermodynamic limit when the two spins are totally removed from each other. This is why there was no gap between magnetization sectors 0 and 1. The first bulk excitation needs magnetization 2.

What we can do to cure this, is to attach one spin-1/2 before the first and after the last site, taking the same bond Hamiltonian, that link up to the two lonely spins by a singlet state. You may check that now the gap is between magnetization sectors 0 and 1!

In order to calculate the correlation length, one can also play the following trick: attach only one spin-1/2 at one end. This means that the ground state will now be doubly degenerate, in magnetization sectors +1/2 or -1/2, and be characterized by the boundary site where there is NO spin-1/2 attached carrying finite magnetization, that decays into the bulk, with the correlation length.

For a chain of length $L=192$ and $D=200$, calculate the ground state magnetization. Plot it (eliminating the sign oscillation) versus site in a log-lin plot and extract the correlation length. What do you get?
