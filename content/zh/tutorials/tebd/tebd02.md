
---
title: TEBD-02 kink
math: true
toc: true
---

## Evolution of a domain Wall

In this tutorial we will study the time evolution of a S=1/2 spin chain prepared in a nonequilibrium state.  The particular state that we choose is that with all spins to the left of the chain center "down" and all of those to the right of the center "up," $| \downarrow \downarrow \dots \downarrow \uparrow \dots \uparrow \uparrow\rangle$.  This state can be chosen as the initial state by setting INITIAL_STATE to be 'kink'.  Some exact results are known regarding the evolution of this state under the 1D XX model, which allows for a detailed study of the errors present in TEBD.

### Exact Solution for the case of the XX model

The time evolution of the kink initial state under the XX model was solved exactly in Phys. Rev. E 59, 4912 (1999) by a Jordan-Wigner transformation to free fermions.  It was found that the expectation value of the magnetization at any site as a function of time can be represented as a sum of Bessel functions, and the magnetization in the limit of long times and large distances from the initial domain wall approaches a scaling form in the variable $n/t$ , where $n$ is the distance from the center and $t$ the time.  Explicitly, we have

$$
 M(n,t)=-\frac{1}{2}\sum\_{i=1-n}^{n-1}j_i^2\left(t\right)
 $$

$$
\lim\_{n\to \infty} \lim\_{t\to \infty} M(n,t)\to \phi\left(n/t\right)=-\frac{1}{\pi}\arcsin\left(n/t\right)
$$

where  $M(n,t)$ is the magnetization a distance $n$ from the center and  $j_i(t)$ is the Bessel function of order $i$ . In the first part of this tutorial we demonstrate these two results.

#### Preparing and running the simulation using Python

To set up and run the simulation in Python we use the script `tutorial2a.py`. The first parts of this script imports the required modules and prepares the input files as a list of Python dictionaries:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot
    import numpy as np
    import copy
    import math
    import scipy.special
    #prepare the input parameters
    parms = [{ 
            'L'                         : 50,
            'MODEL'                     : 'spin',
            'local_S'                   : 0.5,
            'CONSERVED_QUANTUMNUMBERS'  : 'Sz_total',
            'Jxy'                         : 1,
            'INITIAL_STATE' : 'kink',
            'CHI_LIMIT' : 40,
            'TRUNC_LIMIT' : 1E-12,
            'NUM_THREADS' : 1,
            'TAUS' : [20.0],
            'POWS' : [0.0],
            'GS' : ['H'],
            'GIS' : [0.0],
            'GFS' : [0.0],
            'NUMSTEPS' : [500],
            'STEPSFORSTORE' : [2]
        }]

The math and scipy.special modules are required to generate the special functions needed to compare with the exact solution.  Note that we have chosen POWS to be zero, which corresponds to no quenching at all.  Thus, the values of GS, GIS, and GFS are arbitrary, and TAUS and NUMSTEPS give us the total simulation time and the number of time steps, respectively. We write the input files, run the simulation, and get the output as usual:

    baseName='tutorial_2a'
    nmlname=pyalps.writeTEBDfiles(parms, baseName)
    res=pyalps.runTEBD(nmlname)
    #Get the results of the simulation
    Data=pyalps.load.loadTimeEvolution(pyalps.getResultFiles(prefix='tutorial_2a'), measurements=['Local Magnetization'])

We now must postprocess the raw output to compare with the exact solution. To do this we first define empty arrays to hold the postprocessed data

    #define a dataset numericalSolution to contain the numerical result
    numericalResult=[]
    #define a dataset exactSolution to contain the exact solution
    exactResult=[]
    #define a dataset scalingForm to contain the scaling form
    scalingForm=[]

we then calculate the exact result from the time data, and use the computed values of the magnetization at each site to compare with the exact solution.

    #Compute the exact result M(n,t)=<S_n^z>=-(1/2)*sum_{i=1-n}^{n-1} j_i(t)^2, where
    # j_i(t) is the Bessel function of order i and compare to the numerically obtained result
    for q in Data:
        syssize=q[0].props['L']
        #Assign a label 'Distance' denoting the distance from the center n (only do the first two sites
        #to avoid cluttering the plot)
        for n in range(1,3):
                #Create copies of the data for postprocessing
                numericalCopy=copy.deepcopy(q)
                exactCopy=copy.deepcopy(q)
                
                numericalCopy[0].props['Distance']=n
                numericalCopy[0].props['SIMID']='Numerical at n='+str(n)
                exactCopy[0].props['Distance']=n
                exactCopy[0].props['SIMID']='Exact at n='+str(n)

                #compute the exact result of the manetization n sites from the center
                loc=0.0
                for i in range(1-n,n):
                        loc-=0.5*scipy.special.jn(i,q[0].props['Time'])*scipy.special.jn(i,q[0].props['Time'])                        
                exactCopy[0].y=[loc]
                #add to the the exact dataset
                exactResult.extend(exactCopy)

                #get the numerical result of the magnetization n sites from the center
                numericalCopy[0].y=[q[0].y[syssize/2+n-1]]
                #add to the the numerical dataset
                numericalResult.extend(numericalCopy)

Next, we calculate the exact scaling function, and then compute magnetization as a function of the scaling variable $n/t$ to compare with the exact solution

    #compute the scaling form
    # \phi(n/t)=-(1/pi)*arcsin(n/t) that M(n,t) approaches as n->infinity and t->infinity
    # and compare it with the numerically computed values of M(n/t)
    for q in Data:
        syssize=q[0].props['L']
        #Assign a label 'Distance' denoting the distance from the center n (only do the first few sites
        #to avoid cluttering the plot)
        for n in range(0,5):
                #Create a copy of the data for postprocessing
                scalingCopy=copy.deepcopy(q)
                scalingCopy[0].props['Distance']=n

                #The first distance contains the exact scaling form \phi(n/t)=-(1/pi)*arcsin(n/t)
                if n==0:
                        scalingCopy[0].props['Time']=1.0/scalingCopy[0].props['Time']
                        scalingCopy[0].y=[-(1.0/3.1415926)*math.asin(min(scalingCopy[0].props['Time'],1.0))]
                    scalingCopy[0].props['SIMID']='Exact'

                #The other distances contain the numerical data as a function of the scaling variable M(n/t)
                else:
                        scalingCopy[0].props['Time']=n/scalingCopy[0].props['Time']
                        scalingCopy[0].y=[scalingCopy[0].y[syssize/2+n-1] ]
                    scalingCopy[0].props['SIMID']='Numerical at n='+str(n)
                #add to the scaling dataset
                scalingForm.extend(scalingCopy)

Finally, we plot the exact and numerical results for comparison.

    #Plot the numerical and exact magnetization for comparison
    exactMag=pyalps.collectXY(exactResult, x='Time', y='Local Magnetization',foreach=['SIMID'])
    for q in exactMag:
        q.props['label']=q.props['SIMID']
    numericalMag=pyalps.collectXY(numericalResult, x='Time', y='Local Magnetization',foreach=['SIMID'])
    for q in numericalMag:
        q.props['label']=q.props['SIMID']

    plt.figure()
    pyalps.plot.plot([exactMag, numericalMag])
    plt.xlabel('Time $t$')
    plt.ylabel('Magnetization')
    plt.legend(loc='lower right')
    plt.title('Magnetization vs. time')
    #Plot the scaling form with the numerical data for comparison
    Scal=pyalps.collectXY(scalingForm, x='Time', y='Local Magnetization', foreach=['SIMID'])
    for q in Scal:
        q.props['label']=q.props['SIMID']
    plt.figure()
    pyalps.plot.plot(Scal)
    plt.xlabel('Scaling variable $n/t$')
    plt.ylabel('Magnetization$(n,t)$')
    plt.legend()
    plt.xlim(0,1.5)
    plt.title('Magnetization scaling function; numerical and exact results')
    plt.show()

We see that the magnetization agrees very well to visual accuracy, and approaches the exact scaling form in the relevant limit.

### Error analysis of TEBD 1:Time step error

We now use the exact solution to compute the error in a TEBD simulation as a function of time. We first investigate the effects of changing the "infinitesimal" time step dt.

#### Preparing and running the simulation using Python

To set up and run the simulation in Python we use the script `tutorial2b.py`. The first parts of this script imports the required modules and prepares the input files as a list of Python dictionaries:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot
    import numpy as np
    import math
    import scipy.special
    #prepare the input parameters
    parms=[]
    count=0
    for nsteps in [100, 250, 500, 750, 1000]:
       count+=1
       parms.append({ 
                 'L'                         : 50,
                 'MODEL'                     : 'spin',
                 'local_S'                   : 0.5,
                 'CONSERVED_QUANTUMNUMBERS'  : 'Sz_total',
                 'Jxy'                         : 1,
                 'INITIAL_STATE' : 'kink',
                 'CHI_LIMIT' : 20,
                 'TRUNC_LIMIT' : 1E-12,
                 'NUM_THREADS' : 1,
                 'TAUS' : [20.0],
                 'POWS' : [0.0],
                 'GS' : ['H'],
                 'GIS' : [0.0],
                 'GFS' : [0.0],
                 'NUMSTEPS' : [nsteps],
                 'STEPSFORSTORE' : [int(math.floor(nsteps/100))],
                 'SIMID': count
               })

By changing the parameter NUMSTEPS we implicitly change the time step, since the total evolution time TAU is fixed. We now write the input files, run the simulations, and collect data:

    baseName='tutorial_2b_'
    nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
    res=pyalps.runTEBD(nmlnameList)
    #Get magnetization data
    Magdata=pyalps.load.loadTimeEvolution( pyalps.getResultFiles(prefix='tutorial_2b'), measurements=['Local Magnetization'])

We now calculate the exact result from the time data, and then calculate the difference between the numerical and the exact result for the magnetization

    #Postprocessing-get the exact result for comparison
    for q in Magdata:
        syssize=q[0].props['L']
        #Get the exact result of M(1,t)=-(1/2)*(j_0(t)^2), where j_0(t) is the 0^{th} order
        # bessel function and M(1,t) is the magnetization one site to the right of the chain center
        loc=-0.5*scipy.special.jn(0,q[0].props['Time'])*scipy.special.jn(0,q[0].props['Time'])
        #Get the difference between the computed and exact results
        q[0].y=[abs(q[0].y[syssize/2+1-1]-loc)]

Finally, we plot this magnetization error:

    #Plot the Error in the magnetization one site to the right of the chain center
    Mag=pyalps.collectXY(Magdata, x='Time', y='Local Magnetization', foreach=['SIMID'])
    for q in Mag:
        dt=round(q.props['TAUS']/q.props['NUMSTEPS'],3)
        q.props['label']='dt='+str(dt)
    plt.figure()
    pyalps.plot.plot(Mag)
    plt.xlabel('Time $t$')
    plt.yscale('log')
    plt.ylabel('Magnetization Error')
    plt.title('Error in the magnetization vs. time')
    plt.legend(loc='lower left')
    plt.show()

We see that, for short times, the errors are roughly proportional to dt^2, reflecting the contribution to the error from the trotter breakup of our exponential. At long times, however, the simulations with the smallest dt have errors which become larger than those with larger dt, and eventually the errors blow up! We will have more to say about this behavior in the next section.

### Error analysis of TEBD 2:Entanglement cutoff error

We now investigate the effects of changing the entanglement cutoff parameter  $\chi$  on the errors in the magnetization.

#### Preparing and running the simulation using Python

To set up and run the simulation in Python we use the script tutorial2c.py. The first parts of this script imports the required modules and prepares the input files as a list of Python dictionaries:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot
    import math
    import scipy.special
    #prepare the input parameters
    parms=[]
    count=0
    for chi in [10, 20, 30, 40]:
        count+=1
        parms.append({ 
                 'L'                         : 50,
                 'MODEL'                     : 'spin',
                 'local_S'                   : 0.5,
                 'CONSERVED_QUANTUMNUMBERS'  : 'Sz_total',
                 'Jxy'                         : 1,
                 'INITIAL_STATE' : 'kink',
                 'CHI_LIMIT' : chi,
                 'TRUNC_LIMIT' : 1E-12,
                 'NUM_THREADS' : 1,
                 'TAUS' : [20.0],
                 'POWS' : [0.0],
                 'GS' : ['H'],
                 'GIS' : [0.0],
                 'GFS' : [0.0],
                 'NUMSTEPS' : [500],
                 'STEPSFORSTORE' : [5],
                 'SIMID': count
               })

We now write the input files, run the simulations, collect data, and compute the errors as above

    baseName='tutorial_2c_'
    nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
    res=pyalps.runTEBD(nmlnameList)

    #Get magnetization data
    Magdata=pyalps.load.loadTimeEvolution( pyalps.getResultFiles(prefix='tutorial_2c'), measurements=['Local Magnetization'])

    #Postprocessing-get the exact result for comparison
    for q in Magdata:
        syssize=q[0].props['L']
        #Get the exact result of M(1,t)=-(1/2)*(j_0(t)^2), where j_0(t) is the 0^{th} order
        # bessel function and M(1,t) is the magnetization one site to the right of the chain center
        loc=-0.5*scipy.special.jn(0,q[0].props['Time'])*scipy.special.jn(0,q[0].props['Time'])
        #Get the difference between the computed and exact results
        q[0].y=[abs(q[0].y[syssize/2+1-1]-loc)]

Finally, we plot the magnetization error

    #Plot the Error in the magnetization one site to the right of the chain center
    Mag=pyalps.collectXY(Magdata, x='Time', y='Local Magnetization', foreach=['SIMID'])
    for q in Mag:
        q.props['label']='$\chi$='+str(q.props['CHI_LIMIT'])
    plt.figure()
    pyalps.plot.plot(Mag)
    plt.xlabel('Time $t$')
    plt.yscale('log')
    plt.ylabel('Magnetization Error')
    plt.title('Error in the magnetization vs. time')
    plt.legend(loc='lower left')
    plt.show()

We see that, for short times, the errors are roughly proportional to dt^2, again reflecting the contribution to the error from the trotter breakup of our exponential. As time increases, however, a cascade of diverging errors ensues. First the simulation with  $\chi=10$  diverges around  $t=5$, then the simulation with  $\chi=20$  diverges around  $t=9$ and so on. This breakdown is due to the fact that the protocol for finding the matrix product state which best approximates the time-evolved state is approximate when the state becomes highly entangled. This approximation involves a renormalization of the wavefunction, and so the errors accumulate roughly exponentially in time.

This exponential growth of errors also accounts for the failure of the simulations with smaller dt. As dt becomes smaller we must apply the approximate propagation scheme more to reach the same fixed final time, and this means more accumulation of the exponentially growing truncation error. Thus, we must strike a delicate balance between the error incurred by increasing the time step and the error incurred by taking more time steps. All results should be carefully checked for convergence in both dt and  $\chi$ .


### Solution in the case of the XXZ model

We saw from the exact solution that the magnetization profile had a well defined front which expanded ballistically with velocity  $v=1$ . The XX model has many special properties and so it is natural to ask if this same magnetization behavior holds under more general conditions. In this part of the tutorial we investigate the effects of adding a  $J_z S_i^z S\_{i+1}^z$  term to the Hamiltonian, corresponding to the XXZ model. In the limit as this term dominates the spins become frozen in a parallel configuration, and so the initial state becomes an exact eigenstate of the Hamiltonian. The XX terms in the Hamiltonian try to flip the spins, and are responsible for the propagating magnetization wavefront we saw in the pure XX model. As a quantitative measure of the ability of the system to transport spin, we consider the integrated flow of magnetization through the center defined in Phys. Rev. E 71 036102(2005) as

$$
 \Delta M(t)=\sum\_{n>L/2}^{L} (\langle S_n^z(t)\rangle+1/2) 
$$

#### Preparing and running the simulation using Python

To set up and run the simulation in Python we use the script `tutorial2d.py`. The first parts of this script imports the required modules and prepares the input files as a list of Python dictionaries:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot
    import math
    import scipy.special
    
    #prepare the input parameters
    parms=[]
    count=0
    for z in [0.0, 0.3, 0.9, 1.0, 1.1, 1.5]:
        count+=1
        parms.append({ 
              'L'                         : 50,
              'MODEL'                     : 'spin',
              'local_S'                   : 0.5,
              'CONSERVED_QUANTUMNUMBERS'  : 'Sz_total',
              'Jxy'                         : 1,
              'Jz'                         : z,
          'INITIAL_STATE' : 'kink',
          'CHI_LIMIT' : 40,
          'TRUNC_LIMIT' : 1E-12,
          'NUM_THREADS' : 1,
          'TAUS' : [20.0],
          'POWS' : [0.0],
          'GS' : ['H'],
          'GIS' : [0.0],
          'GFS' : [0.0],
          'NUMSTEPS' : [500],
          'STEPSFORSTORE' : [5],
          'SIMID': count
            })

Note that we are simulating a range of Jz-couplings. We then write the input files, run the simulation, and get the output as usual:

    baseName='tutorial_2d'
    nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
    res=pyalps.runTEBD(nmlnameList)
    #Get magnetization data
    Magdata=pyalps.load.loadTimeEvolution( pyalps.getResultFiles(prefix='tutorial_2d'), measurements=['Local Magnetization'])

From the computed magnetization data we calculate the integrated magnetization as defined above:

    #Compute the integrated magnetization across the center
    for q in Magdata:
        syssize=q[0].props['L']
        #Compute the integrated flow of magnetization through the center \Delta M=\sum_{n>L/2}^{L} (<S_n^z(t)>+1/2)
        #\Delta M= L/4
        loc=0.5*(syssize/2)
        #\Delta M-=<S_n^z(t)> from n=L/2 to L
        q[0].y=[0.5*(syssize/2)+sum(q[0].y[syssize/2:syssize])]

Finally, we plot the integrated magnetization for the range of Jz couplings simulated.

    #Plot the integrated magnetization
    Mag=pyalps.collectXY(Magdata, x='Time', y='Local Magnetization', foreach=['Jz'])
    plt.figure()
    pyalps.plot.plot(Mag)
    plt.xlabel('Time $t$')
    plt.ylabel('Integrated Magnetization $\Delta M(t)$')
    plt.title('Integrated Magnetization vs. Time')
    plt.legend(loc='upper left')
    plt.show()

We see that for Jz$\lt 1$ the integrated magnetization increases roughly linearly in time, and so the magnetization transport is ballistic as in the XX case. For Jz around 1, we see a change in the qualitative behavior to one in which the integrated magnetization eventually saturates.

#### Questions

- The point Jz=1 where the behavior of the integrated magnetization undergoes a distinct qualitative change is the point at which the XXZ model transitions from a critical phase to the Antiferromagnetic phase. However, this phase transition is a priori a low-energy phenomenon, affecting the ground state. Can you deduce how this low energy change affects the dynamical properties of our high-energy initial state?
