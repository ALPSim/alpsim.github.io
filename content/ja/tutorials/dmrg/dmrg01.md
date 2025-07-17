
---
title: DMRG-01 DMRG
math: true
toc: true
---

## Models: Heisenberg Spin Chains

For applications of DMRG, we consider two models, namely the spin-1/2 and the spin-1 antiferromagnetic Heisenberg chains of length L given by the following Hamiltonian,

$$
H = J\sum\_{i=1}^{L-1} \[\frac{1}{2} (S^+\_i S^-\_{i+1} + S^-\_i S^+\_{i+1}) + S^z_i S^z\_{i+1}\] .
$$

The reason why we are choosing these two models, which you may already know from other tutorials, is that despite their superficial similarity they exhibit completely different physical behaviour and pose very different challenges to the DMRG algorithm. Let us briefly review their physical properties.

### Spin-1/2 Chain

The ground state of the spin-1/2 chain can be constructed exactly by the Bethe ansatz; we therefore know its ground state energy exactly. In the thermodynamic limit $L\rightarrow\infty$ the energy per site is given by

$$
E_0/J = 1/4 - \ln 2 = -0.4431471805599... 
$$

Ground state energies as such are of limited interest if not compared to other energies. But this one can serve as a beautiful benchmark of the DMRG method. Of more interest is whether the ground state is separated from the excited states by an energy difference that survives also in the thermodynamic limit, i.e. whether the *gap* is vanishing or not. For the spin-1/2 chain, the gap is 0.

At the same time, one may ask what the correlation between spins on different sites looks like. One knows for the infinitely long spin-1/2 chain that asymptotically (i.e. for $|i-j| \rightarrow \infty$)

$$
 \langle S^z_i S^z_j \rangle \sim (-1)^{|i-j|} \frac{\sqrt{\ln|i-j|}}{|i-j|}  .
$$

This means that the spin-1/2 chain is *critical*, i.e. the antiferromagnetic correlations between spins decay with their distance following a *power law*; in this case the exponent of the power law is obviously $-1$. There is also an additional square root of a logarithm correction which can be beautifully verified by DMRG calculations on very long chains, but given the very slow increase of the logarithm with its argument, we can ignore it in a first go.

### Spin-1 Chain

For decades, people thought that the spin-1 chain would behave similarly, of course with some quantitative differences due to the different spin lengths. It came as a big surprise in 1982 when Duncan Haldane pointed out that there should be a fundamental difference between isotropic antiferromagnetic Heisenberg chains depending on the length of the spin, namely between half-integer spins ($S=1/2,3/2,...$) and integer spins ($S=1$), with the difference being most pronounced for small spin lengths. Hence, the spin-1 chain became the focus of strong interest, and in fact DMRG had some of its most important early applications right for this system.

Unlike the spin-1/2 chain, the spin-1 chain has no properties that can be calculated exactly by analytical means. We have to rely completely on numerics when it comes to quantitative statements.

The ground state energy per site is given by

$$
 E_0/J = -1.401484039 ... .
 $$

Again, the question of the existence of a gap is more important, and here one of the big differences to the spin-1/2 chain becomes visible: in the thermodynamic limit, the gap in the spin-1 chain is finite and given by

$$
 \Delta/J = 0.41052 
 $$

to five-digit accuracy.

The question for the behaviour of the spin-spin correlations leads to yet another big difference to the spin-1/2 case. The correlations read asymptotically (i.e. for $|i-j| \rightarrow \infty$)

$$
 \langle S^z_i S^z_j \rangle \sim (-1)^{|i-j|} \frac{\exp (-|i-j|/\xi)}{\sqrt{|i-j|}}  .
 $$

The dominant contribution is now the exponential decay which happens on a length scale $\xi$, the *correlation length* which in this particular case is found numerically to be $\xi=6.02$. There is an analytic (power law) correction by a square root of the distance in the denominator, but this is often neglected in calculations of the correlation length, as it is a slow contribution compared to the fast exponential decay. It would matter, of course, if the correlation length were much larger.

The spin-1 chain is therefore a prime example for a *non-critical* quantum system with finite gap and exponentially decaying correlations. As it will turn out, for DMRG this type of system is much easier to simulate.

### Plan Of The Tutorial

What we want to achieve in the following tutorial, is to be able to calculate all the above quantities using ALPS DMRG while learning about the principal pitfalls in this numerical project.

### Vive la difference ...

The most important difference to other numerical methods is that DMRG prefers open boundary conditions, such that there are two chain ends at site 1 and $L$, not a closed loop as for example exact diagonalization and most analytical methods would prefer. This was already implicit in the notation of the Hamiltonian above and will lead to some of the more subtle aspects of DMRG calculations.

## Running The Code

### General Remarks

Before we start, let us briefly discuss the inner logic of the DMRG algorithm without discussing it in full detail. Given a one-dimensional quantum system with local state spaces of dimension $d$, where $d=2S+1$ for spins of magnitude $S$, the Hilbert space dimension increases exponentially as $d^L$ with system size $L$. Exact diagonalization achieves exact results in this exponentially large Hilbert space, at the price of small system sizes. Quantum Monte Carlo gives approximate results by stochastically sampling this large space, reaching much larger system sizes. The density-matrix renormalization group (DMRG) tries yet another approach, namely to identify very small subspaces of size $D$ of the exponentially large Hilbert space which are hoped to contain good, very good, even excellent approximations to the states of interest such as the ground state.

A first key control parameter is, therefore, $D$, called *matrix dimension* or *number of block states*. The parameter $D$ controls the number of states in the subspace. DMRG is monotonic in this parameter: the larger it is, the larger the subspace is and the better the approximation can be. There is also an exact limit: if $D\rightarrow d^L$, no states are discarded and the solution would be exact. This is, however, of no practical relevance; if such a large number of states could be achieved on the computer, exact diagonalization would be a superior alternative. 

The second key control parameter is of course the system size $L$.

The third control parameter(s) can only be understood by looking even closer at the DMRG algorithm. In order to find the best approximation to a state, DMRG proceeds in two steps:

1. In a first step (so-called *infinite-system* DMRG) the algorithm tries to find good subspaces by iteratively analyzing chains of length 2, 4, 6, until the desired system size $L$ is reached. The procedure consists of splitting the chain in every iteration and insert two new sites at the center; the name comes from the fact that this procedure can of course be carried on infinitely, to take $L$ to infinity; but don't expect very meaningful results as you approach infinity! A second remark is that this procedure favours chains of even length for DMRG treatment.
2. In a second step (so-called *finite-system* DMRG) DMRG deals with the fact that the subspace selection for shorter chains could not yet take into account all the quantum fluctuations and correlations that would be present in the chain of final length $L$. What the method does, is to go through a series of further iterations to improve the quality of the subspaces. One such iteration visiting all sites of a chain is referred to as a *sweep* in DMRG. The number of sweeps is the last important control parameter: if it is too small, the precision of the results for a given $D$ is not achieved; if it is too large, the calculational effort could be wasted, although it is of course always good to err on the safe side.

In a last remark, let us consider the *truncation error*, which is a good indicator of the accuracy achieved by a DMRG run. In a simplified perspective, at each point in the algorithm DMRG makes one step in the direction of exponential growth of state space and then asks how much accuracy can be retained if not allowing that step, by means of an analysis of a density matrix regarding the distribution of weights (eigenvalues) corresponding to its eigenstates. The approximations of DMRG are then reflected in the fact that some statistical weight has to be discarded, which is the so-called truncation error. In many DMRG applications, it can be as small as $10^{-12}$, showing that the approximations made by DMRG are extremely light, which is the reason for the enormous success of the method. For the purpose of the tutorial it is important to know that the error in local quantities (energies, magnetizations, ...) is roughly proportional to (but usually quite a bit larger than) the truncation error, provided that the number of sweeps is large enough.

### The ALPS DMRG Code and Its Control Parameters

Besides inputs such as the Hamiltonian and lattice geometry, the DMRG simulation requires a set of specific control parameters. Some of these are listed below. We refer the users to the DMRG reference page for further details.

#### DMRG-specific parameters

**NUMBER_EIGENVALUES**
Number of eigenstates and energies to calculate. Default is 1, should be set to 2 to calculate gaps.

**SWEEPS**
Number of DMRG sweeps for the finite-size algorithm. Each sweep involves a left-to-right half-sweep, and a right-to-left half-sweep.

**NUM_WARMUP_STATES**
Number of initial states to grow the DMRG blocks. If not specified, the algorithm will use a default value of 20 states.

**STATES**
Number of DMRG states kept on each half sweep. The user should specify either 2*SWEEPS different values of STATES or one MAXSTATES or NUMSTATES value.

**MAXSTATES**
Maximum number of DMRG states kept. The user may choose to specify either STATES values for each half-sweep, or a MAXSTATES or NUMSTATES that the program will use to grow the basis. The program will automatically determine how many states to use for each sweep, increasing the basis size in steps of STATES/(2*SWEEPS) until reaching MAXSTATES.

**NUMSTATES**
Constant number of DMRG states kept for all sweeps.

**TRUNCATION_ERROR** 
Users can choose to set the tolerance for the simulation, instead of the number of states. The program will automatically determine how many states to keep in order to satisfy this tolerance. Care must be taken, since this could lead to an uncontrollable growth in the basis size, and a crash as a consequence. It is therefore advisable to also specify the maximum number of states as a constraint, using either MAXSTATES or NUMSTATES, as explained above.

**LANCZOS_TOLERANCE** 
Tolerance for the diagonalization (Davidson/Lanczos) part of the code. the default value is 10^-7.

**CONSERVED_QUANTUMNUMBERS**
Quantum numbers conserved by the model of interest. They will be used in the code in order to reduce matrices into block forms. If no value is specified for a particular quantum number, the program will work in the grand canonical ensemble. For instance, for spin chains if you do not specify Sz_total, the program will use a Hilbert space with dim=2^N states. Running in the "canonical" (by setting Sz_total=0, for instance) will improve performance considerably by working in a subspace with the reduced dimension. For an example of how to do this, take a look at the parms file included with the dmrg code.

#### How to choose the right parameters

Default input values are not recommended. DMRG convergence is strongly affected by the number of states used in the warmup, the number of sweeps, and the maximum number of states kept for each iteration. It is a good practice to look at the convergence of the ground-state energy and truncation error as a function of the number of states. This will indicate an optimal number of states to be kept in order to maintain the errors below a certain tolerance.

In order to determine if enough sweeps have been performed, one could look at the spatial distribution of the correlations, or local quantities such as the spin magnetication, or the particle density. For instance, in a model that is symmetric under reflections, we should expect that these observables will also be symmetric. Another quantity that should be symmetric is the entanglement entropy. If this behavior is not reflected in the results, it is likely that this is due to not having enough sweeps in the calculation (another plausible scenario is phase separation).

If the Hamiltonian preserves quantum numbers, such as Sz or N, it is then possible to fix these values to run the simulation in a subspace of reduced dimension. This results in much faster runs, and reduced memory usage.

## Ground State Energies

The first question we usually ask is about the ground state $| \psi_0 \rangle$ and its energy $E_0$. Here we have to distinguish two cases.

First, we might be interested in the ground state energy for a given Hamiltonian on a chain of a given length $L$. Secondly, we might be interested in the energy per site (or per bond) in the thermodynamic limit.

### Fixed Length Ground State Energies

Consider chains of length $L=32,64,96,128$. Both for spin-1/2 and spin-1, set up ground state energy calculations for numbers of states $D=50,100,150,200,300$. For each length, tabulate the truncation error and the ground state energies as a function of $D$. Experiment carefully with the number of sweeps to assure that for a given length and number of states your result is actually converged.

1. For each system size and spin magnitude, try to establish the connection between the accuracy of the total energy and the truncation error by plotting total energy vs. truncation error.

2. Observe how the convergence in $D$ deteriorates with system size for spin-1/2 and spin-1. Apart from a global factor of order of the length, do you see a difference between the convergence behaviour in the two cases? *Hint:* What you should see is, that but for the global factor, the convergence for large system sizes is only weakly dependent of length for the spin-1 chain, but much more strongly dependent for the spin-1/2 chain. This is because the spin-1 chain physics is dominated by segments of length of the correlation length, whereas for the spin-1/2 chain there is no finite length scale because of criticality.

3. Try to extrapolate ground state energies for each chain length to the $D\rightarrow\infty$ limit.

#### The one dimensional S=1/2 Heisenberg chain

##### Single run

The first example consists of setting up a simulation for a spin-1/2 Heisenberg chain with 32 sites, and open boundary conditions, keeping 100 states.

###### Using parameter files

The parameter file [`spin_one_half`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-01-dmrg/spin_one_half) sets the most important parameters.

```python
LATTICE="open chain lattice"
MODEL="spin" 
CONSERVED_QUANTUMNUMBERS="N,Sz" 
Sz_total=0
J=1
SWEEPS=4
NUMBER_EIGENVALUES=1
L=32 
{MAXSTATES=100}
```

Using the following sequence of commands you can first convert the input parameters to XML and then run the application `dmrg`:

```python
parameter2xml spin_one_half
dmrg --write-xml spin_one_half.in.xml
```

The output file `spin_one_half.task1.out.xml` contains all the computed quantities and can be viewed with a standard internet browser.

DMRG will perform four sweeps, (four half-sweps from left to right and four half-sweeps from right to left) growing the basis in steps of MAXSTATES/(2\*SWEEPS) until reaching the MAXSTATES=100 value we have declared. This is a convenient default option, but the number of states can be customized, as we show in the spin S=1 example below.

###### Using Python

To set up and run the simulation in Python we use the script [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half.py). The first part of this script imports the required modules, prepares the input files as a list of Python dictionaries, writes the input files and runs the application.

```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
import pyalps.plot

parms = [ { 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'L'                         : 32,
        'MAXSTATES'                 : 100
       } ]

input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
res = pyalps.runApplication('dmrg',input_file,writexml=True)
```

To run this, in your computer terminal type
```python 
python spin_one_half.py
```
We now have the same output files as in the command line version.

Next, we load the properties of the ground state measured by the DMRG code

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))
```
and print them to the terminal.

```python
for s in data[0]:
    print s.props['observable'], ' : ', s.y[0]
```

Additionally, we can load detailed data for each iteration step.

```python
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                          what=['Iteration Energy','Iteration Truncation Error'])
```

The above allows us to look at how the DMRG algorithm converged to the final results.

We finally plot the convergence of various quantities as functions of iterations.
```python
plt.figure()
pyalps.plot.plot(iter[0][0])
plt.title('Iteration history of ground state energy (S=1/2)')
plt.ylim(-15,0)
plt.ylabel('$E_0$')
plt.xlabel('iteration')

plt.figure()
pyalps.plot.plot(iter[0][1])
plt.title('Iteration history of truncation error (S=1/2)')
plt.yscale('log')
plt.ylabel('error')
plt.xlabel('iteration')

plt.show()
```

##### Multiple runs

###### Using parameter files

We now proceed to illustrate how to setup several runs in a single parameter file [`spin_one_half_multiple`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half_multiple). We shall use the example proposed in the tutorial, and simulate a chain of length L=32, changing the number of DMRG states (we shall use a smaller number of states for illustration purposes):

```python
LATTICE="open chain lattice"
SWEEPS=4
CONSERVED_QUANTUMNUMBERS="Sz"
MODEL="spin", Sz_total=0
J=1
NUMBER_EIGENVALUES=1
L=32
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

As we can see, the main difference with the previous example exists in the parameters encoded in the brackets. As before, we run:

```python
parameter2xml spin_one_half_multiple
dmrg --write-xml spin_one_half_multiple.in.xml
```

In this case, we will find three output files `spin_one_half_multiple.task#.out.xml` containing the results.

###### Using Python

The script [`spin_one_half_multiple.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half_multiple.py) sets up three Python dictionaries of parameters with differing MAXSTATES

```python
parms= []
for m in [20,40,60]:
    parms.append({ 
        'LATTICE'                   : "open chain lattice", 
        'MODEL'                     : "spin",
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'L'                         : 32,
        'MAXSTATES'                 : m
       })

```

After writing parameter files, running the dmrg application, and loading the results in the same way as for the single run above, we can print the measurements from all runs.

```python
for run in data:
    for s in run:
        print s.props['observable'], ' : ', s.y[0]
```

#### The one dimensional S=1 Heisenberg chain

The S=1 Heisenberg chain requires some special treatment due to the open boundary conditions. As explained above, we need to include two sites at both ends of the chain with a spin S=1/2 on each of them. This requires defining a new lattice file for the simulation. As it turns out, there is not a straightforward way to do this, so we will have to do it manually. To simplify the process, we have included a simple Python script [`build_lattice.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/build_lattice.py) that will generate the lattice for us. The only input is the number of sites in the lattice. For instance, by typing

```python
python build_lattice.py 6
```

we shall obtain the output

```python
<LATTICES>
<GRAPH name = "open chain lattice with special edges" dimension="1" vertices="6" edges="5">
<VERTEX id="1" type="0"><COORDINATE>0</COORDINATE></VERTEX>
<VERTEX id="2" type="1"><COORDINATE>2</COORDINATE></VERTEX>
<VERTEX id="3" type="1"><COORDINATE>3</COORDINATE></VERTEX>
<VERTEX id="4" type="1"><COORDINATE>4</COORDINATE></VERTEX>
<VERTEX id="5" type="1"><COORDINATE>5</COORDINATE></VERTEX>
<VERTEX id="6" type="0"><COORDINATE>6</COORDINATE></VERTEX>
<EDGE source="1" target="2" id="1" type="0" vector="1"/>
<EDGE source="2" target="3" id="2" type="0" vector="1"/>
<EDGE source="3" target="4" id="3" type="0" vector="1"/>
<EDGE source="4" target="5" id="4" type="0" vector="1"/>
<EDGE source="5" target="6" id="5" type="0" vector="1"/>
</GRAPH>
</LATTICES>
```

As we can see, the lattice is defined as a one-dimensional graph that contains six vertices, and edges connecting nearest neighbors. The first and last vertices are of type "0", while the others are of type "1". We shall use this definition to implement the model on top of this lattice, which should contain information about the degrees of freedom living on these vertices.

The way to do this is by specifying the parameters:

```python
local_S0=0.5
local_S1=1
```

To run a lattice with 32 sites we shall then type

```python
python build_lattice.py 32 > my_lattice.xml
```

##### Using parameter files

Let us see how the final parameter file [`spin_one`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one) should look like:

```python
LATTICE_LIBRARY="my_lattice.xml"
LATTICE="open chain lattice with special edges"
MODEL="spin"
local_S0=0.5
local_S1=1
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=0
J=1
SWEEPS=4
NUMBER_EIGENVALUES=1
{MAXSTATES=100}
```

Clearly, it is cumbersome to repeat this process for each system size. One way to simplify it even further is to write a script to do it for us automatically. A simpler one is to define all the lattices we need in a lattice library. We have included a [`my_lattices.xml`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/my_lattices.xml) file with lattices of sizes $L=32,64,96,128,192$. All we have to do is modifing the previous parameter file by replacing the lattice definition as follows:

```python
LATTICE_LIBRARY="my_lattices.xml"
LATTICE="open chain lattice with special edges 32"
```
where we have included the lattice size in the name.

##### Using Python

The script [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one.py) defines the parameters in a Python dictionary.

```python
parms = [ { 
        'LATTICE_LIBRARY'           : 'my_lattice.xml',
        'LATTICE'                   : 'open chain lattice with special edges',
        'MODEL'                     : 'spin',
        'local_S0'                  : '0.5',
        'local_S1'                  : '1',
        'CONSERVED_QUANTUMNUMBERS'  : 'N,Sz',
        'Sz_total'                  : 0,
        'J'                         : 1,
        'SWEEPS'                    : 4,
        'NUMBER_EIGENVALUES'        : 1,
        'MAXSTATES'                 : 100
       } ]
```

Apart from parameter and file name changes, it is the same as the `spin_one_half.py` script explained above.

##### Multiple runs

###### Using parameter files

Same as for the spin S=1/2 case, we can now setup multiple runs in a single parameter file named [`spin_one_multiple`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_multiple) as follows:

```python
LATTICE_LIBRARY="my_lattices.xml"
LATTICE="open chain lattice with special edges 32"
MODEL="spin"
local_S0=0.5
local_S1=1
CONSERVED_QUANTUMNUMBERS="Sz"
Sz_total=0
J=1 
NUMBER_EIGENVALUES=1 
SWEEPS=4
{ MAXSTATES=20 } 
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

###### Using Python

The same runs can be set up with the script [`spin_one_multiple.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_multiple.py), which can be obtained from the corresponding spin-1/2 script by replacing the parameters.

### Ground State Energies Per Site (Bond)

If we look closely at the Hamiltonian, the energy of a chain of length $L$ does not sit on the $L$ sites, but on the $L-1$ bonds. A first (naive) attempt therefore consists of taking the results of the last simulations and calculating

$$
e_0/J = \frac{E_0(L)}{L-1}.
$$

Do you get values really close to the ones listed in the introduction? What is wrong with the underlying assumption?

The correct way is to eliminate the effect of the open boundary conditions by considering the energy of one bond at the center of the chain. There are two ways of doing it.

1. Calculate the ground state energy of two chains of length $L$ and $L+2$, again for the lengths already mentioned above, and calculate $e_0/J = (E_0(L+2) - E_0 (L))/2$ as the energy per bond. What do the results look like now?

2. The less costly and usual way would be to use correlators (as discussed further below, so we postpone this exercise until then) between neighbouring sites and use
$$
e_0/J = \frac{1}{2} (\langle S^+\_i S^-\_{i+1}\rangle  + \langle S^-\_i S^+\_{i+1}\rangle ) + \langle S^z_i S^z\_{i+1} \rangle 
$$

for sites $i,i+1$ at the chain center.
