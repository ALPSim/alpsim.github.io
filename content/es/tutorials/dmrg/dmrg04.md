
---
title: DMRG-04 Correlations
math: true
toc: true
---

## Funciones de Correlación

Las funciones de correlación más importantes en física de muchos cuerpos son los correladores de dos puntos, es decir, correladores que involucran dos sitios $i$ y $j$, como $\langle S^+_i S^-_j \rangle$. Los de corto alcance determinan energías (en los hamiltonianos típicamente de corto alcance de la física de correlaciones), los de largo alcance determinan longitudes de correlación.

### Otro Intento Con La Energía Por Enlace

Como ya se mencionó arriba, la energía del estado fundamental por enlace, tanto en la cadena de espín-1/2 como en la de espín-1, viene dada por

$$
e_0(i) = \frac{1}{2} (\langle S^+_i S^-_{i+1}\rangle  + \langle S^-_i S^+_{i+1}\rangle ) + \langle S^z_i S^z_{i+1} \rangle 
$$

Esto da la energía de cada enlace individualmente, pero estamos interesados en el límite termodinámico, donde todos los enlaces están en pie de igualdad y por lo tanto deberían tener la misma energía, a menos que exista alguna ruptura física de la invariancia traslacional.

Obviamente, los enlaces más cercanos al comportamiento del límite termodinámico son los del centro de la cadena. Así que el enfoque directo sería calcular $e_0(L/2)$ y extrapolarlo primero en $D$ para $L$ fija y luego en $L$.

Antes de hacer esto, sin embargo, grafique para algunos valores de $D$ y para $L$ no demasiado pequeña, $e_0(i)$ frente a $i$ (como verificación del programa, también puede considerar las tres contribuciones individualmente antes de sumarlas. ¿Qué relación debería existir entre ellas?).

¿Qué observa para espín-1? ¿Y para espín-1/2?

Para la cadena de espín-1/2, las energías de enlace oscilan fuertemente entre enlaces de número impar y par. Esto se debe a que los extremos abiertos se hacen sentir con mucha fuerza debido a la criticidad, y a que la cadena de espín-1/2 está al borde de la dimerización, es decir, una ruptura espontánea de la simetría traslacional del estado fundamental hasta una periodicidad de 2. Por lo tanto, es más significativo extrapolar la energía promedio de un enlace fuerte y uno débil; se gana inmediatamente mucha precisión. Este es otro ejemplo de que vale la pena observar de cerca la salida real de DMRG considerando distintos observables locales o (aquí) casi locales.

### Correlaciones Espín-Espín: Espín-1/2

Tome una cadena relativamente larga (digamos, $L=192$), y calcule $\langle S^z_i S^z_j \rangle$ para valores crecientes de $D$.

Ahora grafique $C_l = \langle S^z_{L/2-l/2} S^z_{L/2+l/2} \rangle$ donde redondea las posiciones de modo que su distancia sea l. El propósito de esto es centrar los correladores en torno al centro de la cadena para minimizar los efectos de frontera; también hay otras formas de hacerlo (como promediar sobre varios correladores con la misma distancia entre sitios, también más o menos centrados). Como esperamos una ley de potencia, use un gráfico log-log. Tome valores absolutos o multiplique por el factor antiferromagnético $(-1)^l$.

Lo que debería ver es una ley de potencia a distancias cortas, pero un decaimiento más rápido (de hecho, exponencial) para distancias mayores. Esto tiene dos razones: (i) el tamaño finito del sistema corta las correlaciones de ley de potencia; pero como tomamos aquí un tamaño de sistema grande, esto no debería importar demasiado. (ii) la estructura algorítmica de DMRG genera efectivamente correladores que son superposiciones de hasta $D^2$ decaimientos puramente exponenciales, y por lo tanto solo puede imitar leyes de potencia mediante tales superposiciones; a grandes distancias, el decaimiento exponencial más lento sobrevivirá a todos los demás, reemplazando la ley de potencia por una ley exponencial. Cuanto mayor elija $D$, más lejos empujará este cruce (crossover).

#### Usando archivos de parámetros

El siguiente archivo de parámetros [`spin_one_half`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one_half) configurará esta ejecución para nosotros (una vez más, con fines ilustrativos usaremos un sistema y un número de estados menores que los valores más realistas indicados arriba). En este ejemplo consideramos una cadena de longitud $L=32$ y configuramos varias ejecuciones con distintos números de estados $D$. Usamos 6 barridos. Asegúrese de que las correlaciones se vean simétricas.

    LATTICE="open chain lattice"
    MODEL="spin"
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    Sz_total=0
    SWEEPS=6
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_AVERAGE[Magnetization]=Sz
    MEASURE_AVERAGE[Exchange]=exchange
    MEASURE_LOCAL[Local magnetization]=Sz
    MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz
    MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"
    L=32
    { MAXSTATES=20 }
    { MAXSTATES=40 }
    { MAXSTATES=60 }

#### Usando Python

El script [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one_half.py) configura tres ejecuciones con distintos números de estados $D$ y carga los resultados.

    import pyalps
    import numpy as np
    import matplotlib.pyplot as plt
    import pyalps.plot
    parms = []
    for D in [20,40,60]:
        parms.append( { 
            'LATTICE'                               : 'open chain lattice', 
            'MODEL'                                 : 'spin',
            'CONSERVED_QUANTUMNUMBERS'              : 'N,Sz',
            'Sz_total'                              : 0,
            'J'                                     : 1,
            'SWEEPS'                                : 6,
            'NUMBER_EIGENVALUES'                    : 1,
            'L'                                     : 32,
            'MAXSTATES'                             : D,
            'MEASURE_AVERAGE[Magnetization]'        : 'Sz',
            'MEASURE_AVERAGE[Exchange]'             : 'exchange',
            'MEASURE_LOCAL[Local magnetization]'    : 'Sz',
            'MEASURE_CORRELATIONS[Diagonal spin correlations]'      : 'Sz',
            'MEASURE_CORRELATIONS[Offdiagonal spin correlations]'   : 'Splus:Sminus'
            } )
            
    input_file = pyalps.writeInputFiles('parm_spin_one_half',parms)
    res = pyalps.runApplication('dmrg',input_file,writexml=True)
    
    data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))

Ahora podemos extraer p. ej. las correlaciones Sz:Sz

    curves = []
    for run in data:
        for s in run:
            if s.props['observable'] == 'Diagonal spin correlations':
                d = pyalps.DataSet()
                d.props['observable'] = 'Sz correlations'
                d.props['label'] = 'D = '+str(s.props['MAXSTATES'])
                L = int(s.props['L'])
                d.x = np.arange(L)
           
                # sites with increasing distance l symmetric to the chain center
                site1 = np.array([int(-(l+1)/2.0) for l in range(0,L)]) + L/2
                site2 = np.array([int(  l   /2.0) for l in range(0,L)]) + L/2
                indices = L*site1 + site2
                d.y = abs(s.y[0][indices])
           
                curves.append(d)
y las graficamos frente a la distancia entre sitios.

    plt.figure()
    pyalps.plot.plot(curves)
    plt.xscale('log')
    plt.yscale('log')
    plt.legend()
    plt.title('Spin correlations in antiferromagnetic Heisenberg chain (S=1/2)')
    plt.ylabel('correlations $| \\langle S^z_{L/2-l/2} S^z_{L/2+l/2} \\rangle |$')
    plt.xlabel('distance $l$')
    plt.show()

### Correlaciones Espín-Espín: Espín-1

En la cadena de espín-1, esperamos un decaimiento exponencial (con una modificación analítica), por lo que la naturaleza exponencial de los correladores de DMRG debería ajustarse bien. De nuevo, elija una cadena larga (digamos, $L=192$), y calcule $\langle S^z_i S^z_j \rangle$ para valores crecientes de $D$.

Ahora grafique $C_l = \langle S^z_{L/2-l/2} S^z_{L/2+l/2} \rangle$ donde redondea las posiciones de modo que su distancia sea $l$, como antes. Como esperamos una ley exponencial, use un gráfico log-lin, de nuevo eliminando los signos negativos.

A partir del gráfico log-lin, extraiga una longitud de correlación. Dependerá (y de hecho aumentará monótonamente con) $D$. ¿Ha convergido cuando llega, por ejemplo, a $D=300$? ¿Cómo se compara esto con la convergencia, para el mismo número de estados, de cantidades locales o casi locales como la magnetización o la energía?

De hecho, el cálculo de longitudes de correlación es mucho más difícil de converger que el de las cantidades locales. Esto se debe a que un análisis algorítmico más profundo revela que DMRG es un algoritmo especialmente adecuado para la representación óptima de cantidades locales, no tanto de las no locales como los correladores de largo alcance.

#### Usando archivos de parámetros

El archivo de parámetros [`spin_one`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one) se parece mucho al del ejemplo anterior, pero reemplazando la red y el modelo de la siguiente manera:

    LATTICE_LIBRARY="my_lattices.xml"
    LATTICE="open chain lattice with special edges 32"
    MODEL="spin"
    local_S0=0.5
    local_S1=1
    CONSERVED_QUANTUMNUMBERS="N,Sz"
    Sz_total=0
    SWEEPS=6
    J=1
    NUMBER_EIGENVALUES=1
    MEASURE_AVERAGE[Magnetization]=Sz
    MEASURE_AVERAGE[Exchange]=exchange
    MEASURE_LOCAL[Local magnetization]=Sz
    MEASURE_CORRELATIONS[Diagonal spin correlations]=Sz
    MEASURE_CORRELATIONS[Offdiagonal spin correlations]="Splus:Sminus"
    { MAXSTATES=20 }
    { MAXSTATES=40 }
    { MAXSTATES=60 }

#### Usando Python

La principal diferencia del script [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-04-correlations/spin_one.py) respecto al anterior es la definición de la red y del modelo.

    parms = []
    L = 32
    for D in [20,40,60]:
        parms.append( { 
            'LATTICE_LIBRARY'                       : 'my_lattices.xml',
            'LATTICE'                               : 'open chain lattice with special edges '+str(L),
            'MODEL'                                 : 'spin',
            'local_S0'                              : 0.5,
            'local_S1'                              : 1,
            'CONSERVED_QUANTUMNUMBERS'              : 'N,Sz',
            'Sz_total'                              : 0,
            'J'                                     : 1,
            'SWEEPS'                                : 4,
            'NUMBER_EIGENVALUES'                    : 1,
            'MAXSTATES'                             : D,
            'MEASURE_AVERAGE[Magnetization]'        : 'Sz',
            'MEASURE_AVERAGE[Exchange]'             : 'exchange',
            'MEASURE_LOCAL[Local magnetization]'    : 'Sz',
            'MEASURE_CORRELATIONS[Diagonal spin correlations]'      : 'Sz',
            'MEASURE_CORRELATIONS[Offdiagonal spin correlations]'   : 'Splus:Sminus'
        } )

Después de ejecutar la simulación, las correlaciones pueden extraerse y graficarse de la misma manera que antes.

### A Veces Hay Una Salida

En el caso especial de la cadena de espín-1, tenemos una escapatoria para el cálculo de la longitud de correlación, relacionada con la extraña observación de que la primera excitación no era una excitación de volumen. Puede demostrarse que un buen modelo de juguete para una cadena de espín-1 es el siguiente: en cada sitio de un espín-1, se colocan dos espines-1/2, y se construyen los estados de espín-1 a partir de los estados triplete de los dos espines-1/2 en cada sitio. El estado fundamental se aproxima entonces bastante bien mediante un estado en el que se enlazan dos espines-1/2 en sitios *vecinos* mediante un estado singlete.

En esta construcción, para condiciones de frontera abiertas (pero no periódicas), en el primer y en el último sitio quedarán dos espines-1/2 solitarios sin pareja. Estos dos espines-1/2 pueden formar 4 estados entre sí, que en el modelo de juguete son degenerados: el estado fundamental es cuádruplemente degenerado. En la cadena de espín-1 real, esta degeneración cuádruple (de un estado de espín total 0 y tres de espín total 1) solo se alcanza en el límite termodinámico, cuando los dos espines están totalmente alejados el uno del otro. Esta es la razón por la que no había gap entre los sectores de magnetización 0 y 1. La primera excitación de volumen necesita magnetización 2.

Lo que podemos hacer para remediar esto es adjuntar un espín-1/2 antes del primer sitio y después del último, tomando el mismo hamiltoniano de enlace, que enlaza los dos espines solitarios mediante un estado singlete. Puede comprobar que ahora el gap está entre los sectores de magnetización 0 y 1.

Para calcular la longitud de correlación, también se puede jugar el siguiente truco: adjuntar solo un espín-1/2 en un extremo. Esto significa que el estado fundamental ahora será doblemente degenerado, en los sectores de magnetización +1/2 o -1/2, y se caracterizará por el sitio de frontera donde NO hay espín-1/2 adjunto, que lleva una magnetización finita que decae hacia el volumen, con la longitud de correlación.

Para una cadena de longitud $L=192$ y $D=200$, calcule la magnetización del estado fundamental. Grafíquela (eliminando la oscilación de signo) frente al sitio en un gráfico log-lin y extraiga la longitud de correlación. ¿Qué obtiene?
