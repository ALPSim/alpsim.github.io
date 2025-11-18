---
title: Quench of Hardcore Boson Model
description: "Jupyter md file for quenched hardcore boson model"
toc: true
math: true
weight: 51
cascade:
    type: docs
---

In this tutorial we investigate the behavior of the hardcore boson model
$$H=-t\sum_{i=1}^{L-1}(b_i^{\dagger}b_{i+1}+b_ib_{i+1}^{\dagger})+V\sum_{i=1}^{L-1}n_in_{i+1}$$
as the parameter $V$ is changed in time. 

It is well known that for large $V/t$ the ground state of the hardcore boson model at half filling is a charge-density wave (CDW) insulator, while for small $V/t$ the ground state is a superfluid (SF). It is interesting to consider what happens to the system if we begin in one phase and then dynamically change, or “quench”, one of the Hamiltonian parameters $t$ or $V$ such that we are in the other phase. As a simple first foray into the rich physics of quenches, we will consider quenching from one phase to the other and then back to the original phase. A particularly stringent criterion for adiabaticity of such a quench is how close the final state is to the initial state, i.e.,
$$L(t;\gamma)\equiv |\langle \Psi(t)|\Psi(0)\rangle|^2$$
, which we call the Loschmidt Echo. Note that the $t$ in this expression is the time and not the hopping parameter 
$t$. The parameter $\gamma$ is meant to convey that this quantity in general depends on the manner in which the system is quenched.

The general structure of a quench in the ALPS TEBD routines is given by the parameterization
$$g(t)=g(t_i)+((t-t_i)/\tau)^p(g(t_f)-g(t_i))$$
, where $\tau=t_f-t_i$ and $g$ is some Hamiltonian parameter. In the present case we will take $g$ to be the interaction parameter $V$. We will begin our system in the CDW regime with $V/t=10$, quench to the SF regime where 
$V/t=0$, and then quench back to the CDW regime with $V/t=10$. In the three parts of this tutorial we will investigate: a) the effects of the timescale $\tau$ on the Loschmidt echo during a linear quench, b) the effects of “holding” the system in the SF phase for a time $\tau_{\text{hold}}$ before returning to the CDW phase, and c) the effects of changing the power $p$ of the quench function.

### Linear Quench

In this section we will investigate the effects of the quench rate $\tau$ on the adiabaticity of a linear quench from the CDW to the SF phase and back.

#### Simulation

We imports the required modules and then prepares the input files as a list of Python dictionaries:


```python
import pyalps
import matplotlib as plt
import pyalps.plot
```


```python
parms=[]
count=0
for A in [5.0, 10.0, 15.0, 25.0, 50.0]:
        count+=1
        parms.append({ 
                  'L'                         : 10,
                  'MODEL'                     : 'hardcore boson',
                  'CONSERVED_QUANTUMNUMBERS'  : 'N_total',
                  'N_total' : 5,
                  't'                         : 1.0,
                  'V'                         : 10.0,
                  'ITP_CHIS' : [20, 30, 35],
                  'ITP_DTS' : [0.05, 0.05,0.025],
                  'ITP_CONVS' : [1E-8, 1E-8, 1E-9],
                  'INITIAL_STATE' : 'ground',
                  'CHI_LIMIT' : 40, 
                  'TRUNC_LIMIT' : 1E-12,
                  'NUM_THREADS' : 1,
                  'TAUS' : [A,  A],
                  'POWS' : [ 1.0, 1.0],
                  'GS' : ['V',  'V'],
                  'GIS' : [10.0,  0.0],
                  'GFS' : [0.0,  10.0],
                  'NUMSTEPS' : [500,  500],
                  'STEPSFORSTORE' : [5, 3],
                  'SIMID' : count
                })
```

Let’s go through the TEBD-specific parameters in more detail. The parameter INITIAL_STATE is set to ground, which means that we begin from the ground state of our Hamiltonian with user-specified parameters. The parameters $t$ and $V$ specify that the initial Hamiltonian parameters $t=1$ and $V=10$ are used to find the ground state. In order to find the ground state, TEBD performs evolution in imaginary time. We refer to this step as ITP, and so all parameters containing ITP deal with the ground state properties. The vectors ITP_CHIS, ITP_DTS, and ITP_CONVS are the entanglement cutoff parameters, time steps, and convergence criteria for successive applications of imaginary time propagation. These constitute the main convergence parameters for TEBD, and convergence should always be carefully checked in each parameter. For now, don’t worry too much about their actual values, we’ll see how errors are controlled in the next set of tutorials.

Now we turn to the real-time propagation parameters. We wish to perform a series of two quenches. First we want to quench the parameter $V$ linearly in time from its initial value 10 to 0. Comparing with the general form of a quench 
$$g(t)=g(t_i)+((t-t_i)/tau)^p(g(t_f)-g(t_i))$$,
we see that this corresponds to 
$g=V$, $g(t_i)=10$, $g(t_f)=0$, $p=1$, and $\tau$ is the free parameter whose effects are to be investigated. Looking at the parameter list, we see that the first elements of the vectors GS, GIS, GFS, and POWS correspond to $g$, $g(t_i)$, $g(t_f)$, and $p$, respectively. The first element of the vector TAUS is looped over using the variable A, which means that we will perform a series of simulations with 
$\tau=5, 10, 15, 25$, and 50. The second quench is essentially the reverse of the first, with $g=V$, $g(t_i)=0$, $g(t_f)=10$, $p=1$, and $\tau$ the same as the first. Comparing with the parameters list, we see that this corresponds to the second elements of the vectors GS, GIS, etc. as above.

Time evolution is simulated by breaking the full propagator approximately into a series of operations which act only on two neighboring sites at a time. The error in using this approximate propagator is second order in the “infinitesimal” timestep dt. TEBD gives a protocol for updating the canonical form of our state after such a two-site operation has been applied. The error in this procedure is controlled by CHI_LIMIT, which is directly related to the amount of spatial entanglement, and TRUNC_LIMIT, which is akin to the TRUNCATION_ERROR in the DMRG routines. The parameter vector NUMSTEPS specifies how many timesteps are taken in performing each quench, which together with $\tau$ implicitly defines the timestep dt. The overall error is a nontrivial function of CHI_LIMIT, TRUNC_LIMIT, and NUMSTEPS which will be investigated in the next set of tutorials, so we won’t worry about the choice of these much for now. Finally, STEPSFORSTORE determines how many time steps are taken before observables are computed and stored and SIMID is an integer differentiating the simulations with different $\tau$.

We now move on to the actual computation. The following lines prepare the input files for the TEBD routines and run the simulations for the range of $\tau$ specified in the parameters.


```python
baseName='tutorial_1a'
nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
res=pyalps.runTEBD(nmlnameList)
```

We now load the Loschmidt Echo and interaction parameter $V$ as functions of time via:


```python
LEdata=pyalps.load.loadTimeEvolution(pyalps.getResultFiles(prefix='tutorial_1a'), measurements=['Loschmidt Echo', 'V'])
```

Finally, we plot the collected data using:


```python
LE=pyalps.collectXY(LEdata, x='Time', y='Loschmidt Echo',foreach=['SIMID'])
for q in LE:
    q.props['label']=r'$\tau=$'+str(q.props['TAUS'][0])

plt.pyplot.figure()
pyalps.plot.plot(LE)
plt.pyplot.xlabel('Time $t$')
plt.pyplot.ylabel(r'Loschmidt Echo $|< \psi(0)|\psi(t) > |^2$')
plt.pyplot.title('Loschmidt Echo vs. Time')
plt.pyplot.legend(loc='lower right')

Ufig=pyalps.collectXY(LEdata, x='Time', y='V',foreach=['SIMID'])
for q in Ufig:
    q.props['label']=r'$\tau=$'+str(q.props['TAUS'][0])

plt.pyplot.figure()
pyalps.plot.plot(Ufig)
plt.pyplot.xlabel('Time $t$')
plt.pyplot.ylabel('V')
plt.pyplot.title('Interaction parameter $V$ vs. Time')
plt.pyplot.legend(loc='lower right')
plt.pyplot.show()

```

The resulting figures are shown below:
![Linear Quench](/figs/tebd/linearquench.png)   
![Linear Quench V vs. t](/figs/tebd/linearquenchvt.png)  

   
#### Questions

- How does the behavior of the overlap change as the quench rate decreases?
- Roughly how slowly do you have to perform the quench in order for it to be adiabatic?
- Is it easier or harder for a larger system to be adiabatic? Why?
- Are these properties changed depending on whether the intermediate phase is gapped or not? One can test this by changing from the hardcore boson model to the (softcore) boson Hubbard model, and then quenching from the Mott-Insulating (MI) phase at large $U/t$ and unit filling to the CDW phase with large $V$. As you quench from the Mott insulating to the CDW phase and back, how difficult is it to be adiabatic?

### Linear Quench with hold

In this section we will investigate the effects of “holding” the system in the SF phase for a time $\tau_{\mathrm{hold}}$ before quenching back to the CDW phase.

#### Simulation

We first import the required modules and then prepare the input files as a list of Python dictionaries:


```python
import pyalps
import matplotlib as plt
import pyalps.plot


parms=[]
count=0
for A in [5.0, 12.0, 15.0, 25.0, 50.0]:
        count+=1
        parms.append({ 
                  'L'                         : 10,
                  'MODEL'                     : 'hardcore boson',
                  'CONSERVED_QUANTUMNUMBERS'  : 'N_total',
                  'N_total' : 5,
                  't'                         : 1.0,
                  'V'                         : 10.0,
                  'ITP_CHIS' : [20, 30, 35], 
                  'ITP_DTS' : [0.05, 0.05,0.025],
                  'ITP_CONVS' : [1E-8, 1E-8, 1E-9],
                  'INITIAL_STATE' : 'ground',
                  'CHI_LIMIT' : 80,
                  'TRUNC_LIMIT' : 1E-12,
                  'NUM_THREADS' : 1,
                  'TAUS' : [10.0, A, 10.0],
                  'POWS' : [1.0, 0.0,1.0],
                  'GS' : ['V', 'V', 'V'],
                  'GIS' : [10.0,0.0, 0.0],
                  'GFS' : [0.0, 0.0, 10.0],
                  'NUMSTEPS' : [500, int(A/0.05), 500],
                  'STEPSFORSTORE' : [5,5, 3],
                  'SIMID' : count
                })
```

Note that in this case we have three quenches as GS, GIS, etc. are all vectors of length three. The second quench keeps the Hamiltonian parameters fixed at $t=1$, $V=0$ for a time $\tau_{\mathrm{hold}}$ before quenching back. We write the input files, run the simulations, get outputs, and plot as above:


```python
baseName='tutorial_1b'
nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
res=pyalps.runTEBD(nmlnameList)

LEdata=pyalps.load.loadTimeEvolution(pyalps.getResultFiles(prefix='tutorial_1b'), measurements=['Loschmidt Echo', 'V'])

LE=pyalps.collectXY(LEdata, x='Time', y='Loschmidt Echo',foreach=['SIMID'])
for q in LE:
    q.props['label']=r'$\tau_{\mathrm{hold}}=$'+str(q.props['TAUS'][1])
plt.pyplot.figure()
pyalps.plot.plot(LE)
plt.pyplot.xlabel('Time $t$')
plt.pyplot.ylabel(r'Loschmidt Echo $|< \psi(0)|\psi(t) > |^2$')
plt.pyplot.title('Loschmidt Echo vs. Time')
plt.pyplot.legend(loc='lower right')

Ufig=pyalps.collectXY(LEdata, x='Time', y='V',foreach=['SIMID'])
for q in Ufig:
    q.props['label']=r'$\tau_{\mathrm{hold}}=$'+str(q.props['TAUS'][1])
plt.pyplot.figure()
pyalps.plot.plot(Ufig)
plt.pyplot.xlabel('Time $t$')
plt.pyplot.ylabel('V')
plt.pyplot.title('Interaction parameter $V$ vs. Time')
plt.pyplot.legend()
plt.pyplot.show()
```

The resulting figures are shown below:
![Linear Quench Hold](/figs/tebd/linearquenchhold.png)   
![Linear Quench Hold V vs. t](/figs/tebd/linearquenchholdvt.png) 


#### Questions

- How does the behavior of the overlap change as the hold time increases?
- Is this behavior monotonic in the hold time? Why or why not?

### Nonlinear Quenches 

In this section we will investigate the effects of varying the power of the quench away from being linear.

#### Simulation

We first import the required modules and prepare the input files as a list of Python dictionaries:


```python
import pyalps
import matplotlib as plt
import pyalps.plot

parms=[]
count=0
for A in [1.0, 1.5, 2.0, 2.5, 3.0]:
        count+=1
        parms.append({ 
                  'L'                         : 10,
                  'MODEL'                     : 'hardcore boson',
                  'CONSERVED_QUANTUMNUMBERS'  : 'N_total',
                  'N_total' : 5,
                  't'                         : 1.0,
                  'V'                         : 10.0,
                  'ITP_CHIS' : [20, 30, 35],
                  'ITP_DTS' : [0.05, 0.05,0.025],
                  'ITP_CONVS' : [1E-8, 1E-8, 1E-9],
                  'INITIAL_STATE' : 'ground',
                  'CHI_LIMIT' : 40,
                  'TRUNC_LIMIT' : 1E-12,
                  'NUM_THREADS' : 1,
                  'TAUS' : [10.0,  10.0],
                  'POWS' : [1.0, A],
                  'GS' : ['V',  'V'],
                  'GIS' : [10.0,  0.0],
                  'GFS' : [0.0,  10.0],
                  'NUMSTEPS' : [1000,  1000],
                  'STEPSFORSTORE' : [10, 5],
                  'SIMID' : count
                })

```

We then write the input files, run the simulations, get outputs, and plot as above:


```python
baseName='tutorial_1c'
#write output files
nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
#run the application
res=pyalps.runTEBD(nmlnameList)

#Load the loschmidt echo and V
LEdata=pyalps.load.loadTimeEvolution(pyalps.getResultFiles(prefix='tutorial_1c'), measurements=['V', 'Loschmidt Echo'])

LE=pyalps.collectXY(LEdata, x='Time', y='Loschmidt Echo',foreach=['SIMID'])
for q in LE:
    q.props['label']=r'$p=$'+str(q.props['POWS'][1])
plt.pyplot.figure()
pyalps.plot.plot(LE)
plt.pyplot.xlabel('Time $t$')
plt.pyplot.ylabel(r'Loschmidt Echo $|< \psi(0)|\psi(t) > |^2$')
plt.pyplot.title('Loschmidt Echo vs. Time ')
plt.pyplot.legend(loc='lower left')


Ufig=pyalps.collectXY(LEdata, x='Time', y='V',foreach=['SIMID'])
for q in Ufig:
    q.props['label']=r'$p=$'+str(q.props['POWS'][1])
plt.pyplot.figure()
pyalps.plot.plot(Ufig)
plt.pyplot.xlabel('Time $t$')
plt.pyplot.ylabel('V')
plt.pyplot.title('Interaction parameter $V$ vs. Time')
plt.pyplot.legend(loc='lower left')
plt.pyplot.show()

```


The resulting figures are shown below:
![Non-linear Quench](/figs/tebd/nonlinearquench.png)   
![Non-linear Quench V vs. t](/figs/tebd/nonlinearquenchvt.png) 


#### Questions

- How does the behavior of the overlap change as the power changes?
- Again change from the hardcore boson model to the boson Hubbard model and investigate the dynamics of the MI-CDW transition, this time with a nonlinear quench. Is the behavior different from that of a linear quench?
- The present example uses an asymmetric quench which is linear one one side and nonlinear on the other. How is the behavior changed if you make both quenches nonlinear?

