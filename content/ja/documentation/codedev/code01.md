
---
title: Code-01 Python
math: true
toc: true
weight: 2
---

## Getting started with ALPS using Python

In this tutorial we will show how a simulation can be written in a few lines of code using python-ALPS. We will look at the "hello world"-example in the world of physics simulations and perform a Monte Carlo simulation of the classical 2D Ising model with local updates. A skeleton code outlining the typical structure of a Monte Carlo simulation is provided in the file `ising-skeleton.py` and will be discussed step by step below:

First we import the required python modules

    import math
    import pyalps
    import pyalps.alea as alpsalea
    import pyalps.pytools as alpstools

We will start by implementing a Simulation class, which will contain the methods for initializing a simulation, running it and storing the measurements into a HDF5 file.

    class Simulation:
    # Seed random number generator: self.rng() will give a random float from the interval [0,1)
    rng = alpstools.rng(42)
   
   def __init__(self,beta,L):
       self.L = L
       self.beta = beta
       
       # Init exponential map
       self.exp_table = dict()
       for E in range(-4,5,2): 
         self.exp_table[E] = math.exp(2*beta*E)
       
       # Init random spin configuration
       self.spins = [ [2*self.randint(2)-1 for j in range(L)] for i in range(L) ]
       
       # Init observables
       self.energy = alpsalea.RealObservable('E')
       self.magnetization = alpsalea.RealObservable('m')
       self.abs_magnetization = alpsalea.RealObservable('|m|')

The `__init__` method defines how an object of this Simulation class will be instantiated. As arguments the lattice size $L$ and the inverse temperature \beta will be passed. Based on these parameters we deduce the possible Boltzmann weights and initialize a square lattice of Ising spins in a random configuration. Furthermore we also initialize the observables we are going to measure. Here we make use of the python-ALPS framework in order to let the ALPS alea library handle the evaluation of observables for us. Within the class we have also initialized and seeded a random number generator. As an engine we are using the Mersenne Twister MT19937, whose long period and statistical properties make it a good choice for Monte Carlo simulations.

    def save(self, filename):
       pyalps.save_parameters(filename, {'L':self.L, 'BETA':self.beta, 'SWEEPS':self.n, 'THERMALIZATION':self.ntherm})
       self.abs_magnetization.save(filename)
       self.energy.save(filename)
       self.magnetization.save(filename)
       
The save method stores the simulation parameters and results in a HDF5-file.

    def run(self,ntherm,n):
       # Thermalize for ntherm steps
       self.n = n
       self.ntherm = ntherm
       while ntherm > 0:
           self.step()
           ntherm = ntherm-1
       # Run n steps
       while n > 0:
           self.step()
           self.measure()
           n = n-1
       # Print observables
       print '|m|:\t', self.abs_magnetization.mean, '+-', self.abs_magnetization.error, ',\t tau =', self.abs_magnetization.tau
       print 'E:\t', self.energy.mean, '+-', self.energy.error, ',\t tau =', self.energy.tau
       print 'm:\t', self.magnetization.mean, '+-', self.magnetization.error, ',\t tau =', self.magnetization.tau

The `run` method manages the Monte Carlo updates defined in the step routine and the measurement of the observables in the measure function. While the system is thermalizing we do not perform any measurements. Once all steps are done we print mean, error and autocorrelation time of the observables.

    def step(self):
        for s in range(self.L*self.L):
            # Pick random site k=(i,j)
            ...
            # Measure local energy e = -s_k * sum_{l nn k} s_l
            ...        
            # Flip s_k with probability exp(2 beta e)
            ...

The Monte Carlo sweeps are done in the `step` method. In the Metropolis algorithm a spin is a randomly picked and flipped with probability $p\_{accept} = min(1,e^{-\beta \Delta E})$, $\Delta E$ being the energy difference of the initial and proposed configuration. This procedure is repeated $L^2$ times. The implementation of the Metropolis algorithm is left to you as an exercise. You can make use of the `randint` function defined below:

    def randint(self,max):
       return int(max*self.rng())

The measurements of our chosen observables are going to be implemented in the method `measure`:

    def measure(self):
        E = 0.    # energy
        M = 0.    # magnetization
        for i in range(self.L):
            for j in range(self.L):
                E -= ...
                M += ...
        # Add sample to observables
        self.energy << E/(self.L*self.L)
        self.magnetization << M/(self.L*self.L)
        self.abs_magnetization << abs(M)/(self.L*self.L)

The values of the energy and magnetization are determined for the given spin configuration and added to the ALPS observable. The implementation is again left to you as an exercise.

Once you have completed the implementation of the observable measurements and Metropolis update you can run the simulation using the `alpspython` python interpreter. In this example we will do a scan over different values of $\beta = 1/k_B T$. The "main" program is given below:

    L = 4    # Linear lattice size
    N = 5000    # of simulation steps
    print '# L:', L, 'N:', N
    # Scan beta range [0,1] in steps of 0.1
    for beta in [0.,.1,.2,.3,.4,.5,.6,.7,.8,.9,1.]:
        print '-----------'
        print 'beta =', beta
        sim = Simulation(beta,L)
        sim.run(N/2,N)
        sim.save('ising.'+str(beta)+'.h5')

A nice thing about python-ALPS is that if you evaluate composite observables, e.g. of the form $U = \langle A \rangle/\langle B\rangle$, a jackknife analysis will be performed and you will automatically obtain correctly evaluated values for the mean and error. As an example we are going to extend our Ising simulation and add measurements of $m^2$ and $m^4$, from which we determine the Binder cumulant $U_4=\langle m^4\rangle /\langle m^2\rangle^2$. Since the Binder cumulant is usually used to determine the critical temperature using finite size scaling, we are also going to simulate $L=6,8$ in addition.

Assuming that you have succesfully implemented these two additional observables and run the simulation we will first load the data and store for each system size $L$ the two observables $m^2$ and $m^4$ as a function of inverse temperature  $\beta$ :

    data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='ising.L*'),['m^2', 'm^4'])
    m2=pyalps.collectXY(data,x='BETA',y='m^2',foreach=['L'])
    m4=pyalps.collectXY(data,x='BETA',y='m^4',foreach=['L'])

Now we can calculate the Binder cumulant, which we will store in a list of datasets:

    u=[]
    for i in range(len(m2)):
        d = pyalps.DataSet()
        d.propsylabel='U4'
        d.props = m2[i].props
        d.x= m2[i].x
        d.y = m4[i].y/m2[i].y/m2[i].y
        u.append(d)

You can plot the Binder cumulant using the commands:

    import pyalps.plot as plt 
    plt.figure()
    plt.plot(u)
    plt.xlabel('Inverse Temperature $\beta$')
    plt.ylabel('Binder Cumulant U4 $g$')
    plt.title('2D Ising model')
    plt.legend()
    plt.show()

What do you observe? If you want to learn more about phase transitions and finite size scaling methods, check out the tutorial [MC-07 Phase transition in the Ising model](../../../tutorials/mcs/mc07).

