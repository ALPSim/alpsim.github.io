
---
title: Code-02 C++
math: true
toc: true
weight: 3
---

This tutorial shows how to write a Monte Carlo simulation in C++ using the ALPS alea library for the evaluation of observables. In a second step we will write the measurements into a standard HDF5 file format which allows us to use tools from the ALPS suite for further data analysis and plotting.

As a simple example, we will write a simulation of the classical 2D Ising model with local updates. The file `ising-skeleton.cpp` contains a skeleton code which already has all the infrastructure we will need: First it includes all needed headers, then it initializes a random number generator and three `alps::RealObservable` objects. Then it sets up a square lattice of Ising spins. It also provides a table of probabilities that can be used for Metropolis updates. The interface is the same as in the python script you implemented in the previous [tutorial](../../codedev/code01).

Your job is again to complete the methods `step()` and `measure()`: `step()` should choose a random spin from the lattice and flip it with the Metropolis probability $p\_{accept} = min(1,e^{-\beta \Delta E})$ where $\Delta E$ is the energy change the spin flip would cause. `measure()` determines the energy and magnetization of a spin configuration and adds this sample to the observable objects.

After replacing all ellipses with code, you can compile the simulation with this `Makefile`: Save the `Makefile` to the same directory as the `.cpp` file, edit the second line to point to your ALPS installation (if you haven't already set the environment variable ALPS_ROOT) and type `make`. This will produce an executable `ising`. Run it and you will see a scan over different values of $\beta = 1/k_B T$.

You can reuse your Binder cumulant python script from the previous tutorial in exactly the same way:

    data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='ising.L*'),['m^2', 'm^4'])
    m2=pyalps.collectXY(data,x='BETA',y='m^2',foreach=['L'])
    m4=pyalps.collectXY(data,x='BETA',y='m^4',foreach=['L'])

    u=[]
    for i in range(len(m2)):
        d = pyalps.DataSet()
        d.propsylabel='U4'
        d.props = m2[i].props
        d.x= m2[i].x
        d.y = m4[i].y/m2[i].y/m2[i].y
        u.append(d)

and plot the Binder cumulant using the commands:

    plt.figure()
    pyalps.pyplot.plot(u)
    plt.xlabel('Inverse Temperature $\beta$')
    plt.ylabel('Binder Cumulant U4 $g$')
    plt.title('2D Ising model')
    plt.show()
