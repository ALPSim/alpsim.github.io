
---
title: DMRG-03 Local Observables
math: true
toc: true
---

Consideramos observables locales a aquellos que están ligados a un sitio específico. En el caso de las cadenas de espín, el observable local significativo es la magnetización local $\langle S^z_i \rangle$ .

## Excitaciones en la Cadena de Espín-1

Tome una cadena de longitud $L=96$ y $D=200$. Calcule la magnetización local $\langle S^z_i \rangle$  y grafíquela en función del sitio $i$ para los estados fundamentales en los sectores de magnetización 0, 1 y 2.

Lo que debería obtener es una curva esencialmente plana para el sector 0, una magnetización que se concentra esencialmente en los extremos de la cadena para el sector 1, y una magnetización que está tanto en los extremos de la cadena como en el volumen (bulk) de la cadena para el sector 2. Esto significa que la primera excitación de la cadena abierta es una excitación de frontera, que no existiría en un sistema cerrado, y la segunda excitación de la cadena abierta es una excitación de frontera más una de volumen, que es la que nos interesa. Por una razón hasta ahora desconocida, la energía de la primera excitación de volumen debe extraerse, por lo tanto, comparando los sectores 1 y 2.

La moraleja de la historia es que, observando este observable local, podemos distinguir las excitaciones de frontera de las excitaciones de volumen en la cadena de espín-1.

### Usando archivos de parámetros

El siguiente archivo de parámetros [`spin_one`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one) configurará tres ejecuciones individuales, una para cada sector de espín (igual que antes, usaremos un sistema y un número de estados menores con fines ilustrativos):

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

### Usando Python

El script [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one.py) ejecuta una simulación para cada uno de los tres sectores de espín.

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

Después de cargar los archivos de datos, podemos extraer los resultados de la magnetización local

    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one'))

    curves = []
    for run in data:
        for s in run:
            if s.props['observable'] == 'Local magnetization':
                sz = s.props['Sz_total']
                s.props['label'] = '$S_z = ' + str(sz) + '$'
                s.y = s.y.flatten()
                curves.append(s)

y los graficamos.

    plt.figure()
    pyalps.plot.plot(curves)
    plt.legend()
    plt.title('Magnetization of antiferromagnetic Heisenberg chain (S=1)')
    plt.ylabel('local magnetization')
    plt.xlabel('site')
    plt.show()

## Magnetización en la Cadena de Espín-1/2

Repita un cálculo similar para la cadena de espín-1/2 en los sectores de magnetización más bajos. ¿Qué observa aquí?

### Usando archivos de parámetros

El siguiente archivo de parámetros logrará esto, descargable [aquí](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one_half):

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

### Usando Python

Aparte de los evidentes cambios de parámetros, el script [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-03-local-observables/spin_one_half.py) es igual al script `spin_one` explicado anteriormente.
