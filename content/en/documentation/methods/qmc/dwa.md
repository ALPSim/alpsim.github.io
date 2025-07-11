
---
title: Directed Worm Algorithm 
math: true
weight: 6
---

**Attention:** this implementation is an experimental code and should be used only for the Bose Hubbard model without interactions between neighbors. Otherwise the code may crash or yield incorrect results.

## Theory

### Quantum statistical mechanics at finite temperature

At finite temperature $T$, the physics is essentially captured by the partition function
$$
Z = \mathrm{Tr} \exp \left(-\beta \hat{H} \right)
$$
and physical quantities such as the local density
$$
\langle n_i \rangle = \frac{1}{Z} \mathrm{Tr} \hat{n}_i \exp \left(-\beta \hat{H} \right),
$$

$$
= \frac{1}{Z} \sum_{\mathcal{C}} n_i (\mathcal{C}) Z(\mathcal{C})
$$
for some configuration $\mathcal{C}$ in the complete configuration space, with inverse temperature $\beta = 1/T$ . Here, the units will be cleverly normalized later on.

### Feynmann perturbation in the path-integral representation

Decompose  $\hat{H} = \hat{H}_0 - \hat{V}$ , where $\hat{H}_0$  is purely diagonal in the basis of choice, and $\hat{V}$ being off-diagonal.

Feynmann perturbation in the path-integral representation defines the configuration weight:

$$
Z(\mathcal{C}) = e^{-\beta\epsilon_1} 
\left( e^{-\tau_1 \epsilon_1} V_{i_1i_2}  e^{\tau_1 \epsilon_2} \right)
\cdots
\left( e^{-\tau_m \epsilon_m} V_{i_mi_1}  e^{\tau_m \epsilon_1} \right)
$$

for configuration

$$
\mathcal{C} = \[ m ; i_1 \cdots i_m; \tau_1 \cdots \tau_m,  m \in \mathbf{N} ; 0 \lt \tau_1 \lt \cdots \lt \tau_m \lt \beta \]
$$

where

$$
\epsilon_i = \langle i| \hat{H}_0 |i\rangle
$$

and 
$$
V_{ij} = \langle i| \hat{V} |j\rangle. 
$$

The derivation can be found in chapter 2.1-2.2 of my thesis.

### Quantum Monte Carlo (Directed Worm Algorithm)

The Quantum Monte Carlo simulation is in fact a Markov chain random walk in the (worldlines) configuration space, importance sampled by the configuration weight $Z(\mathcal{C})$ which is just a positive number assigned to some particular configuration $\mathcal{C}$ for instance shown here. How $Z(\mathcal{C})$ is being assigned depends on the model Hamiltonian as well as the ergodic algorithm that satisfies detailed balance.

For the directed worm algorithm, the configuration is updated with the worm transversing to and from the extended configuration space to ensure ergodicty. In addition, $n_i(\mathcal{C})$ is the number of particles (or state) at site $i$ with time $0$.

Each configuration update is known as a Monte Carlo sweep.

The complete step-by-step description of the directed worm algorithm can be found in chapter 2.3 of my thesis, and the code implementation in the following.

## The `dwa` code: options

### Monte Carlo options

| **Option** | **Default** | **Remark** |
| :--------- | :---------- | :--------- |
| THERMALIZATION | 0 | number of Monte Carlo configuration updates (sweeps) needed for thermalization and no measurements are performed in the thermalization stage  |
| SWEEPS  | 1000000 | total number of Monte Carlo configuration updates (sweeps) after thermalization |
| SKIP | 1 | number of Monte Carlo configuration updates (sweeps) per measurement $t$  
 |

### ALPS lattice library options

| **Option** | **Default** | **Remark** |
| :--------- | :---------- | :--------- |
|  LATTICE | |  which lattice do you want? |
| L | | length of lattice |

A first quick guide to the ALPS Lattice library can be found here.

### Boson Hubbard model options

**Attention:** this implementation is an experimental code and should be used only for the Bose Hubbard model without interactions between neighbors. Otherwise the code may crash or yield incorrect results.
  
| **Option** | **Default** | **Remark** |
| :--------- | :---------- | :--------- |
| MODEL | |  set as "boson Hubbard" |
| Nmax | | maximum number of bosons allowed per site |
| t | 1. |  hopping strength $t$ |
| U | 0. | onsite interaction strength $U$ |
| mu | 0. | chemical potential $\mu$ |

Note: The following definitions for mu are allowed:
- $\mu=0.5$

- $\mu=0.5-0.001((x-(L-1)/2.)(x-(L-1)/2.)+(y-(L-1)/2.)(y-(L-1)/2.)+(z-(L-1)/2.)(z-(L-1)/2.))$    

### Other options

| **Option** | **Default** | **Remark** |
| :--------- | :---------- | :--------- |
| T | 0. | temperature $T$ |
| tof_phase | 0. | time-of-flight phase $\gamma$ |
| MEASURE | true | shall we measure the common observables? |
| MEASURE[Simulation Speed] | true | shall we measure the simulation performance? |

### More measurement options

| **Option** | **Default** | **Boolean control** |
| :--------- | :---------- | :------------------ |
| MEASURE[Total Particle Number^2] | false | measure_number2\_ |
| MEASURE[Energy^2] | false | measure_energy2\_ |
| MEASURE[Density^2]  | false | measure_density2\_ |
| MEASURE[Energy Density^2]  | false | measure_energy_density2\_ |
| MEASURE[Local Kink: Number] | false | measure_local_num_kinks\_ |
| MEASURE[Winding Number] | false | measure_winding_number\_ |
| MEASURE[Local Density]  | false | measure_local_density\_  |
| MEASURE[Local Density^2] | false | measure_local_density2\_ |
| MEASURE[Green Function] | false | measure_green_function\_ |

## The dwa code: starting the simulation

### in command line

An example is found here.

### in python

An example is found here.

## The dwa code: output

### List of measurement observables

When the measurement mode is turned on, the following is a list of common observables available to the user.

| **Observable** |       | **Boolean control** | **Binning analysis** | **Remark** |
| :------------- | :---- | :------------------ | :------------------- | :--------- |
|  Total Particle Number |   $\langle N \rangle$ |  |      detailed | measure always  |
| Energy | $\langle E \rangle$ | | detailed | measure always  |
| Energy:Vertex | $\langle E_v \rangle$ | | detailed | measure always  |
| Energy:Onsite | $\langle E_o \rangle$ | | detailed | measure always  |
| Density | $\langle n \rangle$ | | detailed | measure if lattice is homogeneous  |    
| Energy Density | $\langle \epsilon \rangle$ | detailed | measure if lattice is homogeneous  |
| Energy Density:Vertex | $\langle E_v \rangle$ | detailed | measure if lattice is homogeneous  |
| Energy Density:Onsite | $\langle E_o \rangle$ | detailed | measure if lattice is homogeneous  |
| Total Particle Number^2 | $\langle N^2 \rangle$ | measure_number2\_ | detailed | |
| Energy^2 | $\langle E^2 \rangle$ | measure_energy2\_ | detailed | |
| Density^2 | $\langle N^2 \rangle$ | measure_density2\_ | detailed | measure if lattice is homogeneous  |
|  Energy Density^2 | $\langle E^2 \rangle$ | measure_energy_density2\_ | detailed | measure if lattice is homogeneous  |
| Winding Number^2 | $\langle W\_{\alpha}^2 \rangle$ | measure_winding_number\_ | detailed | measure if lattice is periodic:  $\alpha=x,y,z$ |
| Stiffness (superfluid density) | $\langle \rho_s \rangle$ | measure_winding_number\_ | detailed | measure if lattice is periodic:  $\alpha=x,y,z$ |
| Local Kink:Number | $\langle n_i^r \rangle$ | measure_local_num_kinks\_ | simple | |
| Local Density | $\langle n_i \rangle$ | measure_local_density\_ | simple | |
| Local Density^2 | $\langle n_i^2 \rangle$ | measure_local_density2\_ | simple | |
| Green Function:0 | $g_f \left(\alpha=0\right)$ | | detailed | measure always |
| Green Function:1 | $\sum\_{i=x,y,z} g_f \left(\alpha_i =1\right)$ | | detailed | measure always |
| Green Function | $g_f \left(\alpha ; \gamma = 0 \right)$ | measure_green_function\_ | simple | |
| Green Function:TOF | $g_f \left(\alpha \right)$ | measure_green_function\_ | simple | measure if tof_phase != 0 |
| Momentum Distribution:0 |  $\langle n_k \left( 0 ; \gamma = 0 \right) \rangle$ | | detailed | measure if tof_phase == 0 |
|  Momentum Distribution:TOF:0 |  $\langle n_k \left( 0 \right) \rangle$ | | detailed | measure if tof_phase != 0 |

### Evaluating the simulation in Python

An example is found here.

### Extracting and visualizing the worldlines configuration in Python

Illustrating from this example, we want to, for instance, extract the worldlines configuration of task 30 after the first run.

    import pyalps.dwa;
    wl = pyalps.dwa.extract_worldlines('parm1b.task30.out.run1.h5');

We can easily visualise, for instance, the cross-sectional worldlines configuration of this 8x8 lattice at y=4:

    pyalps.dwa.show_worldlines(wl, reshape = [8,8], at = '[:,4]'); 
    
One can easily extract the instantaneous state of the worldlines configuration at time 0 via:

    import numpy
    states = numpy.array(wl.states());

It is also possible to easily sketch your own (extended) worldlines configuration using Python, but that will not be discussed here. In practice, you can even produce your own movie that illustrates how the worm propagates from one worldlines configuration to another.

## Application of dwa: bosons in an optical lattice

The following are documentations regarding bosons in an optical lattice, and how one can easily implement dwa in the research.

- [Mapping to the boson Hubbard model](../bhol)
- Momentum distribution and time-of-flight images

## Contributors

- Ping Nang Ma
- Matthias Troyer
                                                                                                                                                                                                                    
 
