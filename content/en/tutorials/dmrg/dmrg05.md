
---
title: DMRG-05 Local Observables
math: true
toc: true
---

We consider observables that are linked to one specific site to be local observables. In the case of spin chains, the meaningful local observable is the local magnetization $\langle S^z_i \rangle$ . Its spatial profile tells us *where* the magnetization sits, which lets each magnetization sector be associated with a particular energy mode: a boundary mode costing almost nothing, or a bulk magnon costing the Haldane gap. We use this below to compare two boundary conditions applied to the same spin-1 chain.

## Excitations in the Spin-1 Chain

### Spin-1 boundary: the uniform chain

```
      J       J       J       J
  o-------o-------o-------o-------o
  1       2       3       4       5
  S=1     S=1     S=1     S=1     S=1
```

We begin with the uniform chain, in which every site — including the two ends — carries spin 1. Take a chain of $L=64$ spin-1 sites with $D=100$ states, and calculate the local magnetization $\langle S^z_i \rangle$. Plot it versus the site $i$ for the ground states in the magnetization sectors 0, 1, and 2.

What you should obtain is an essentially flat curve for sector 0, a magnetization which is essentially concentrated at the chain ends for sector 1, and a magnetization which is both at the chain ends and in the bulk of the chain for sector 2. This means that the first excitation of the open chain is a boundary excitation, which would not exist on a closed system, and the second excitation of the open chain is a boundary plus a bulk excitation, which is the one we are interested in. The energy of the first bulk excitation therefore has to be extracted from comparing sectors 1 and 2; the reason is explained in [Which states the sectors contain](#which-states-the-sectors-contain) below.

The moral of the story is that by looking at this local observable, we can distinguish boundary from bulk excitations in the spin-1 chain.

### Spin-1/2 boundary: absorbing the edge states

```
      J       J       J       J       J       J
  o-------o-------o-------o-------o-------o-------o
  0       1       2       3       4       5       6
  S=1/2   S=1     S=1     S=1     S=1     S=1     S=1/2
```

Now change only the termination. Keep the same $L=64$ spin-1 sites and *attach* an extra spin-1/2 at each end, coupled to the chain by the same $J$: the interior is untouched and the lattice simply grows by two sites.

The choice is not arbitrary. The degeneracy found above is a property of the *ends*, not of the bulk, so it can be removed without touching the phase: the attached spin-1/2 gives the dangling emergent spin-1/2 a partner to form a singlet with, screening it much as a Kondo impurity is screened. Two half-integer spins combine into an integer representation, which can be gapped symmetrically, so the fourfold manifold collapses to a single ground state. A spin-1 cap would not do this — it would simply lengthen the chain and reproduce the same free edge state one site further in.

Repeat the calculation on this lattice, again for sectors 0, 1 and 2. The excitations now behave quite differently:

- **Sector 0** is a unique singlet, and $\langle S^z_i \rangle$ vanishes on every site — there is no edge degree of freedom left to orient.
- **Sector 1** no longer costs nothing. With the boundary states absorbed, the cheapest way to add one unit of $S^z$ is a bulk magnon, and the magnetization appears spread through the interior rather than pinned at the ends.
- **Sector 2** is two magnons, and the profile develops the corresponding structure in the bulk.

Nothing about the bulk has changed: the Haldane gap, the correlation length and the string order are properties of the interior, and cutting the capped chain anywhere in the middle would expose free emergent spin-1/2s at the new ends again. What changes is only *which sector first requires a bulk excitation*. With spin-1 ends the gap must be read between sectors 1 and 2; with spin-1/2 ends the boundary states are gone and the same gap appears between sectors 0 and 1.

### Which states the sectors contain

The reason sectors 0 and 1 are degenerate is that they hold *the same kind of state*. An open spin-1 chain in the Haldane phase carries an emergent spin-1/2 at each end: in the valence-bond picture every spin-1 is two spin-1/2s paired with its neighbours, and at an open end one half is left without a partner. Two such spin-1/2s combine into four nearly degenerate states,

$$\tfrac{1}{2} \otimes \tfrac{1}{2} = 0 \oplus 1,$$

one singlet and one triplet, split only by an effective coupling transmitted through the gapped bulk, which decays as $e^{-L/\xi}$ with $\xi \approx 6$ sites. At $L=64$ that splitting is already below $10^{-5}J$.

Reading the magnetization sectors against that multiplet:

| sector | state | $\langle S^z_i \rangle$ at the two ends |
|---|---|---|
| $S^z_{tot}=0$ | singlet, or the $S^z=0$ triplet member | $0$ / $0$, or $+$ / $-$ |
| $S^z_{tot}=1$ | $S^z=+1$ triplet member — both edge spins up | $+$ / $+$ |
| $S^z_{tot}=2$ | edge triplet **plus** one bulk magnon | $+$ / $+$, with weight added in the bulk |

Two edge spin-1/2s can supply at most $S^z=1$ between them. Sector 2 is therefore the first sector that *cannot* be built from the boundary alone and is forced to contain a magnon, which is exactly why the bulk gap is the difference between sectors 1 and 2: the edge contribution is identical on both sides and cancels,

$$E(S^z_{tot}=2) - E(S^z_{tot}=1) = \big[\text{edge} + \text{magnon}\big] - \big[\text{edge}\big] = \Delta .$$

### Using parameter files

The following parameter file <a href="../codes/dmrg-05-local-observables/spin_one" download>`spin_one`</a> will setup three individual runs, one for each spin sector (same as before, we shall use a smaller system and number of states for illustration):

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

Using the usual sequence of commands to convert and run it:

    parameter2xml spin_one
    dmrg --write-xml spin_one.in.xml

### Using Python

The script <a href="../codes/dmrg-05-local-observables/spin_one.py" download>`spin_one.py`</a> runs one simulation for each of the three spin sectors:

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

After loading the data files, we can extract the results for the local magnetization:

    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one'))

    curves = []
    for run in data:
        for s in run:
            if s.props['observable'] == 'Local magnetization':
                sz = s.props['Sz_total']
                s.props['label'] = '$S_z = ' + str(sz) + '$'
                s.y = s.y.flatten()
                curves.append(s)

and plot them:

    plt.figure()
    pyalps.plot.plot(curves)
    plt.legend()
    plt.title('Magnetization of antiferromagnetic Heisenberg chain (S=1)')
    plt.ylabel('local magnetization')
    plt.xlabel('site')
    plt.show()

## Magnetization in the Spin-1/2 Chain

Repeat a similar calculation for the spin-1/2 chain in the lowest magnetization sectors.

### Using parameter files

The following parameter file <a href="../codes/dmrg-05-local-observables/spin_one_half" download>`spin_one_half`</a> will accomplish this task:

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

    parameter2xml spin_one_half
    dmrg --write-xml spin_one_half.in.xml

### Using Python

Apart from the obvious parameter changes, the script <a href="../codes/dmrg-05-local-observables/spin_one_half.py" download>`spin_one_half.py`</a> is the same as the `spin_one` script explained above.

## Summary

The local magnetization profile cleanly separates boundary excitations from bulk excitations in the open spin-1 chain, which is why the physically relevant (bulk) gap studied in [DMRG-04](../dmrg04) must be read off between magnetization sectors 1 and 2 rather than 0 and 1.

## Questions

- Repeating the local-magnetization calculation for the spin-1/2 chain in its lowest magnetization sectors, what do you observe, compared to the spin-1 case above?
