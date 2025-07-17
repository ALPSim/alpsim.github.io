---
title: Energy Spectrums of Qbits
description: "Jupyter md file for qbit energy"
toc: true
math: true
weight: 61
cascade:
    type: docs
---

In this turotial we will explore how to set up arbitrary lattice configurations to house qbits and assign various interactions between qbits to simulate qbit operations. Our results on energy spectrums could be benchmarks of initial qbit setups for quantum computing theories/experiments. 

## Mixed 4-site Qbits

### Introduction

We first use the 4-site mixed graph in the lattice configuration file: `lattices.xml`
```
<GRAPH name="4-site mixed" vertices="4"> 
  <VERTEX id="1" type="0"/>
  <VERTEX id="2" type="1"/>
  <VERTEX id="3" type="0"/>
  <VERTEX id="4" type="1"/>
  <EDGE type="0" source="1" target="2"/>
  <EDGE type="0" source="2" target="3"/>
  <EDGE type="0" source="3" target="4"/>
  <EDGE type="0" source="4" target="1"/>
  <EDGE type="1" source="1" target="3"/>
  <EDGE type="1" source="2" target="4"/>
</GRAPH> 
```

The lattice configuration is illustrated in the following diagram:
![mixed-4-site configuration](../../../../figs/qbits/mixed4sitesconfig.png)

In this lattice configuration there are two types of vertices, labeled as "0" for sites 1 and 3 and "1" for sites 2 and 4. For each qbit site there is a transverse magnetic field with strength Gamma. There are also two types of bonds, labeled as "0" for bonds between sites (1,2), (2,3), (3,4), and (4,1), and "1" for bonds between sites (1,3) and (2,4). For bond type "0", we will assign an interaction J1 for bond type "0" and J2 for bond type "1". All these is done in the model configuration file: `models.xml`
```
<HAMILTONIAN name="qbit operation">
  <PARAMETER name="J1" default="1"/>
  <PARAMETER name="J2" default="0.5"/>
  <BASIS ref="spin"/>
  <SITETERM site="i">
    -Gamma*Sx(i)
  </SITETERM>
  <BONDTERM source="1" target="2">
    J1*Sz(1)*Sz(2)
  </BONDTERM>
  <BONDTERM source="2" target="3">
    J1*Sz(2)*Sz(3)
  </BONDTERM>
  <BONDTERM source="3" target="4">
    J1*Sz(3)*Sz(4)
  </BONDTERM>
  <BONDTERM source="4" target="1">
    J1*Sz(4)*Sz(1)
  </BONDTERM>
  <BONDTERM source="1" target="3">
    J2*Sz(1)*Sz(3)
  </BONDTERM>
  <BONDTERM source="2" target="4">
    J2*Sz(2)*Sz(4)
  </BONDTERM>
</HAMILTONIAN>
```
With the above setups, the Hamiltonian for the 4-site qbits is given by
$$
H=J_{1} \sum_{type 0} S^i_z S^j_z + J_{2} \sum_{type 1} S^i_z S^j_z - \Gamma \sum_i S^i_x.
$$

### Simulation

We first import some modules:


```python
import pyalps
import numpy as np
import matplotlib.pyplot as plt
```

We then set up parameters for the system and loop over the second coupling constants J2. 


```python
parms = []
# Loop over second coupling constant
for J2 in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6]:
    parms.append({
        'GRAPH'      : "4-site mixed",
        'MODEL'      : "qbit operation",
        'local_S'    : 0.5,
        'Gamma'      : 0.5,
        'J2'         : J2,
        'NUMBER_EIGENVALUES' : 5
    })
```

Now we set up the input files and run the simulations.


```python
prefix = 'qbitenergy'
input_file = pyalps.writeInputFiles(prefix,parms)
res = pyalps.runApplication('sparsediag', input_file)
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))
```

We then iterate through parameter J2 and plot the lowest energy level for each J2.


```python
x = []
E0 = []
for Lsets in data:
    J2 = pyalps.flatten(Lsets)[0].props['J2']
    x.append(J2)
    lowestE = pyalps.flatten(Lsets)[0].y[0]
    E0.append(lowestE)
    
# Set the scatter plot label
lbl="J1=1.0, Gamma=0.5"
plt.scatter(x,E0, label=lbl)
plt.legend()
plt.xlabel("J2")
plt.ylabel("E")
plt.title("4-site Mixed Graph")
plt.show()

```

The resulting energy spectrums for the lowest energies for various coupling constants J2 are shown in the following diagram:
![Lowest energies vs. J2](../../../../figs/qbits/sites4mixed.png)

