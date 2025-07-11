
---
title: DMRG-03 Local Observables
math: true
toc: true
---

We consider observables that are linked to one specific site to be local observables. In the case of spin chains, the meaningful local observable is the local magnetization $\langle S^z_i \rangle$ .

## Excitations in the Spin-1 Chain

Take a chain of length $L=96$ and $D=200$. Calculate the local magnetization $\langle S^z_i \rangle$  and plot it versus the site $i$ for the ground states in the magnetisation sectors 0, 1, and 2.

What you should obtain is an essentially flat curve for sector 0, a magnetisation which is essentially concentrated at the chain ends for sector 1, and a magnetisation which is both at the chain ends and in the bulk of the chain for sector 2. This means that the first excitation of the open chain is a boundary excitation, which would not exist on a closed system, and the second excitation of the open chain is a boundary plus a bulk excitation, which is the one we are interested in. For an as of now unknown reason, the energy of the first bulk excitation therefore has to be extracted from comparing sectors 1 and 2.

The moral of the story is that by looking at this local observable, we can distinguish boundary from bulk excitations in the spin-1 chain.

### Using parameter files

The following parameter file [`spin_one`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one) will setup three individual runs, one for each spin sector (same as before, we shall use a smaller system and number of states for illustration):

    LATTICE_LIBRARY="my_lattices.xml"
    LATTICE="open chain lattice with special edges 32"
    MODEL="spin"
    local_S0=0.5
    local_S1=1
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    J=1
    NUMBER_EIGENVALUES=1
    SWEEPS=4
    MEASURE_LOCAL[Local magnetization]=Sz
    MAXSTATES=40
    { Sz_total=0 }
    { Sz_total=1 }
    { Sz_total=2 }

### Using Python

The script [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one.py) runs one simulation for each of the three spin sectors.

    import pyalps
    import numpy as np
    import matplotlib.pyplot as plt
    import pyalps.plot
    parms = []
    for sz in [0,1,2]:
        parms.append( { 
            'LATTICE_LIBRARY'           : 'my_lattices.xml',
            'LATTICE'                   : 'open chain lattice with special edges 32',
            'MODEL'                     : "spin",
            'local_S0'                  : '0.5',
            'local_S1'                  : '1',
            'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
            'Sz_total'                  : sz,
            'J'                         : 1,
            'SWEEPS'                    : 4,
            'NUMBER_EIGENVALUES'        : 1,
            'MAXSTATES'                 : 40,
            'MEASURE_LOCAL[Local magnetization]'   : 'Sz'
    } )
    
    input_file = pyalps.writeInputFiles('parm_spin_one',parms)
    res = pyalps.runApplication('dmrg',input_file,writexml=True)

After loading the data files, we can extract the results for the local magnetization

    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one'))

    curves = []
    for run in data:
        for s in run:
            if s.props['observable'] == 'Local magnetization':
                sz = s.props['Sz_total']
                s.props['label'] = '$S_z = ' + str(sz) + '$'
                s.y = s.y.flatten()
                curves.append(s)

and plot them.

    plt.figure()
    pyalps.plot.plot(curves)
    plt.legend()
    plt.title('Magnetization of antiferromagnetic Heisenberg chain (S=1)')
    plt.ylabel('local magnetization')
    plt.xlabel('site')
    plt.show()

## Magnetisation in the Spin-1/2 Chain

Repeat a similar calculation for the spin-1/2 chain in the lowest magnetisation sectors. What do you observe here?

### Using parameter files

The following parameter file will accomplish this, downloadable [here](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one_half):

    LATTICE="open chain lattice"
    MODEL="spin"
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    SWEEPS=4
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_LOCAL[Local magnetization]=Sz
    L=32
    MAXSTATES=40
    { Sz_total=0 }
    { Sz_total=1 }
    { Sz_total=2 }

### Using Python

Apart from the obvious parameter changes, the script [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one_half.py) is the same as the `spin_one` script explained above.
