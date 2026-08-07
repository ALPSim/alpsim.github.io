import pyalps
import pyalps.plot
from pyalps.dict_intersect import dict_intersect
import numpy as np
import matplotlib.pyplot as plt
import copy
import math

prefix = 'alps-nnn-heisenberg'
parms = []
for L in [6,8]:
    for Szt in [0,1]:
        for J1 in np.linspace(0,0.5,6):
            parms.append({
                'LATTICE'              : "nnn chain lattice",
                'MODEL'                : "spin",
                'local_S'              : 0.5,
                'J'                    : 1,
                'NUMBER_EIGENVALUES'   : 2,
                'CONSERVED_QUANTUMNUMBERS' : 'Sz',
                'Sz_total'             : Szt,
                'J1'                   : J1,
                'L'                    : L
            })

input_file = pyalps.writeInputFiles(prefix,parms)
res = pyalps.runApplication('sparsediag', input_file)
# res = pyalps.runApplication('sparsediag', input_file, MPI=4)
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix=prefix))

# join all energies for a given set of J1, L, Sz_total and sort them
grouped = pyalps.groupSets(pyalps.flatten(data), ['J1', 'L', 'Sz_total'])
nd = []
for group in grouped:
    ally = []
    allx = []
    for q in group:
        ally += list(q.y)
        allx += list(q.x)
    r = pyalps.DataSet()
    sel = np.argsort(ally)
    r.y = np.array(ally)[sel]
    r.x = np.array(allx)[sel]
    r.props = dict_intersect([q.props for q in group])
    nd.append( r )
data = nd

# remove states that occur in the Sz=1 sector from the Sz=0 sector
grouped = pyalps.groupSets(pyalps.flatten(data), ['J1', 'L'])
nd = []
for group in grouped:
    if group[0].props['Sz_total'] == 0:
        s0 = group[0]
        s1 = group[1]
    else:
        s0 = group[1]
        s1 = group[0]
    s0 = pyalps.subtract_spectrum(s0, s1)
    nd.append(s0)
    nd.append(s1)
data = nd

# collect just the ground and first excited state energy in each sector
sector_E = []
grouped = pyalps.groupSets(pyalps.flatten(data), ['Sz_total', 'J1', 'L'])
for group in grouped:
    allE = []
    for q in group:
        allE += list(q.y)
    allE = np.sort(allE)

    d = pyalps.DataSet()
    d.props = dict_intersect([q.props for q in group])
    d.x = np.array([0])
    d.y = np.array([allE[0]])
    d.props['which'] = 'gs'
    sector_E.append(d)

    d2 = copy.deepcopy(d)
    d2.y = np.array([allE[1]])
    d2.props['which'] = 'fe'
    sector_E.append(d2)

sector_energies = pyalps.collectXY(sector_E, 'J1', 'Energy', ['Sz_total', 'which', 'L'])
plt.figure()
pyalps.plot.plot(sector_energies)
plt.xlabel('$J_1/J$')
plt.ylabel('$E_0$')
plt.legend(prop={'size':8})

# calculate the singlet and triplet gap
grouped = pyalps.groupSets( pyalps.groupSets(pyalps.flatten(data), ['J1', 'L']), ['Sz_total'])

gaps = []
for J1g in grouped:
    totalmin = 1000
    for q in pyalps.flatten(J1g):
        totalmin = min(totalmin, np.min(q.y))

    for Szg in J1g:
        allE = []
        for q in Szg:
            allE += list(q.y)
        allE = np.sort(allE)
        d = pyalps.DataSet()
        d.props = pyalps.dict_intersect([q.props for q in Szg])
        d.props['observable'] = 'gap'
        if d.props['Sz_total'] == 0:
            d.y = np.array([allE[1]-totalmin])
        else:
            d.y = np.array([allE[0]-totalmin])
        d.x = np.array([0])
        d.props['line'] = '.-'
        gaps.append(d)

gaps = pyalps.collectXY(gaps, 'J1', 'gap', ['Sz_total', 'L'])

plt.figure()
pyalps.plot.plot(gaps)
plt.xlabel('$J_1/J$')
plt.ylabel('$\Delta$')
plt.legend(prop={'size':8})

plt.show()
