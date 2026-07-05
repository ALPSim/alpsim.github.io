
---
title: Code-01 Python
math: true
toc: true
weight: 2
---

## Primeros pasos con ALPS usando Python

En este tutorial mostraremos cómo se puede escribir una simulación en pocas líneas de código usando python-ALPS. Veremos el ejemplo del "hola mundo" en el mundo de las simulaciones físicas y realizaremos una simulación Monte Carlo del modelo de Ising clásico en 2D con actualizaciones locales. En el archivo `ising-skeleton.py` se proporciona un código esqueleto que describe la estructura típica de una simulación Monte Carlo, y se analizará paso a paso a continuación:

Primero importamos los módulos de Python necesarios

    import math
    import pyalps
    import pyalps.alea as alpsalea
    import pyalps.pytools as alpstools

Comenzaremos implementando una clase Simulation, que contendrá los métodos para inicializar una simulación, ejecutarla y almacenar las mediciones en un archivo HDF5.

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

El método `__init__` define cómo se instanciará un objeto de esta clase Simulation. Como argumentos se pasarán el tamaño de la red $L$ y la temperatura inversa \beta. A partir de estos parámetros deducimos los posibles pesos de Boltzmann e inicializamos una red cuadrada de espines de Ising en una configuración aleatoria. Además, también inicializamos los observables que vamos a medir. Aquí hacemos uso del marco python-ALPS para dejar que la biblioteca alea de ALPS se encargue de la evaluación de los observables por nosotros. Dentro de la clase también hemos inicializado y sembrado (seed) un generador de números aleatorios. Como motor estamos usando el Mersenne Twister MT19937, cuyo largo período y propiedades estadísticas lo convierten en una buena elección para simulaciones Monte Carlo.

    def save(self, filename):
       pyalps.save_parameters(filename, {'L':self.L, 'BETA':self.beta, 'SWEEPS':self.n, 'THERMALIZATION':self.ntherm})
       self.abs_magnetization.save(filename)
       self.energy.save(filename)
       self.magnetization.save(filename)
       
El método save almacena los parámetros de la simulación y los resultados en un archivo HDF5.

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

El método `run` gestiona las actualizaciones Monte Carlo definidas en la rutina step y la medición de los observables en la función measure. Mientras el sistema se termaliza no realizamos ninguna medición. Una vez completados todos los pasos, imprimimos la media, el error y el tiempo de autocorrelación de los observables.

    def step(self):
        for s in range(self.L*self.L):
            # Pick random site k=(i,j)
            ...
            # Measure local energy e = -s_k * sum_{l nn k} s_l
            ...        
            # Flip s_k with probability exp(2 beta e)
            ...

Los barridos Monte Carlo se realizan en el método `step`. En el algoritmo de Metropolis se elige aleatoriamente un espín y se invierte con probabilidad $p_{accept} = min(1,e^{-\beta \Delta E})$, siendo $\Delta E$ la diferencia de energía entre la configuración inicial y la propuesta. Este procedimiento se repite $L^2$ veces. La implementación del algoritmo de Metropolis queda como ejercicio para el lector. Puedes hacer uso de la función `randint` definida a continuación:

    def randint(self,max):
       return int(max*self.rng())

Las mediciones de los observables elegidos se implementarán en el método `measure`:

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

Los valores de la energía y la magnetización se determinan para la configuración de espines dada y se añaden al observable de ALPS. La implementación queda nuevamente como ejercicio para el lector.

Una vez que hayas completado la implementación de las mediciones de observables y la actualización de Metropolis, puedes ejecutar la simulación usando el intérprete de Python `alpspython`. En este ejemplo realizaremos un barrido sobre distintos valores de $\beta = 1/k_B T$. El programa "principal" se muestra a continuación:

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

Algo interesante de python-ALPS es que, si evalúas observables compuestos, por ejemplo de la forma $U = \langle A \rangle/\langle B\rangle$, se realizará automáticamente un análisis jackknife y obtendrás valores de media y error correctamente evaluados. Como ejemplo, vamos a extender nuestra simulación de Ising y añadir mediciones de $m^2$ y $m^4$, a partir de las cuales determinamos el cumulante de Binder $U_4=\langle m^4\rangle /\langle m^2\rangle^2$. Dado que el cumulante de Binder se suele usar para determinar la temperatura crítica mediante escalamiento de tamaño finito (finite size scaling), también vamos a simular adicionalmente $L=6,8$.

Suponiendo que hayas implementado con éxito estos dos observables adicionales y ejecutado la simulación, primero cargaremos los datos y almacenaremos, para cada tamaño de sistema $L$, los dos observables $m^2$ y $m^4$ en función de la temperatura inversa $\beta$:

    data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='ising.L*'),['m^2', 'm^4'])
    m2=pyalps.collectXY(data,x='BETA',y='m^2',foreach=['L'])
    m4=pyalps.collectXY(data,x='BETA',y='m^4',foreach=['L'])

Ahora podemos calcular el cumulante de Binder, que almacenaremos en una lista de conjuntos de datos:

    u=[]
    for i in range(len(m2)):
        d = pyalps.DataSet()
        d.propsylabel='U4'
        d.props = m2[i].props
        d.x= m2[i].x
        d.y = m4[i].y/m2[i].y/m2[i].y
        u.append(d)

Puedes graficar el cumulante de Binder usando los comandos:

    import pyalps.plot as plt 
    plt.figure()
    plt.plot(u)
    plt.xlabel('Inverse Temperature $\beta$')
    plt.ylabel('Binder Cumulant U4 $g$')
    plt.title('2D Ising model')
    plt.legend()
    plt.show()

¿Qué observas? Si quieres aprender más sobre transiciones de fase y métodos de escalamiento de tamaño finito, consulta el tutorial [MC-07 Transición de fase en el modelo de Ising](../../../tutorials/mcs/mc07).

