import pyalps
import pyalps.plot
from pyalps.dict_intersect import dict_intersect
import numpy as np
import matplotlib.pyplot as plt
import copy
import math

parms_ = {
    'LATTICE'              : "nnn chain lattice",
    'MODEL'                : "spin",
    'local_S'              : 0.5,
    'J'                    : 1,
    'J1'                   : 0.25,
    'NUMBER_EIGENVALUES'   : 5,
    'CONSERVED_QUANTUMNUMBERS' : 'Sz',
    'Sz_total' : 0
}
prefix = 'nnn-heisenberg'
parms = []
for L in [10,12]:
    parms_.update({'L':L})
    parms.append(copy.deepcopy(parms_))

input_file = pyalps.writeInputFiles(prefix,parms)
res = pyalps.runApplication('sparsediag', input_file)
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))

# extract the two lowest energies for each L, exactly as in ED-04's heisenberg.py
E0 = {}
E1 = {}
for Lsets in data:
    L = pyalps.flatten(Lsets)[0].props['L']
    allE = []
    for q in pyalps.flatten(Lsets):
        allE += list(q.y)
    allE = np.sort(allE)
    E0[L] = allE[0]
    E1[L] = allE[1]

# rescale so that the first excited state sits at the known primary-field
# dimension 1/2, then collect the spectrum versus momentum
for q in pyalps.flatten(data):
    L = q.props['L']
    q.y = (q.y-E0[L])/(E1[L]-E0[L]) * (1./2.)
spectrum = pyalps.collectXY(data, 'TOTAL_MOMENTUM', 'Energy', foreach=['L'])

# overlay the expected CFT tower: same c=1 operator content as the plain
# Heisenberg chain (0, 1/2, 1, 3/2, ...), but now without the marginal
# operator that caused the slow logarithmic drift seen in ED-04
for SD in [0.5, 1, 1.5, 2]:
    d = pyalps.DataSet()
    d.x = np.array([0,4])
    d.y = SD+0*d.x
    spectrum += [d]

pyalps.plot.plot(spectrum)
plt.legend(prop={'size':8})
plt.xlabel("$k$")
plt.ylabel("$E_0$")
plt.xlim(-0.02, math.pi+0.02)
plt.show()
