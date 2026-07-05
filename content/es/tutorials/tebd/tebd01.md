
---
title: TEBD-01 bhquench
math: true
toc: true
---

## El modelo de bosones de núcleo duro

En este primer tutorial investigamos el comportamiento del modelo de bosones de núcleo duro

$$
 H=-t\sum_{i=1}^{L-1}(b_i^{\dagger}b_{i+1} +b_ib_{i+1}^{\dagger})+V\sum_{i=1}^{L-1}n_in_{i+1} 
 $$

a medida que el parámetro $V$ cambia en el tiempo. Es bien sabido que para $V/t$ grande, el estado fundamental del modelo de bosones de núcleo duro a medio llenado es un aislante de onda de densidad de carga (CDW), mientras que para $V/t$ pequeño el estado fundamental es un superfluido (SF). Es interesante considerar qué le sucede al sistema si comenzamos en una fase y luego cambiamos dinámicamente, o hacemos un "quench" de, uno de los parámetros del hamiltoniano $t$ o $V$ de modo que terminamos en la otra fase. Como una primera incursión simple en la rica física de los quenches, consideraremos hacer un quench de una fase a la otra y luego de vuelta a la fase original. Un criterio particularmente estricto para la adiabaticidad de un quench de este tipo es qué tan cerca está el estado final del estado inicial, es decir

$$
 L(t; \gamma)\equiv |\langle\psi\left(t\right)|\psi\left(0\right)\rangle|^2 
$$

al que llamamos el Eco de Loschmidt. Nótese que la $t$ en esta expresión es el tiempo y no el parámetro de salto $t$. El parámetro $\gamma$ pretende transmitir que esta cantidad en general depende de la manera en que se hace el quench del sistema.

La estructura general de un quench en las rutinas TEBD de ALPS está dada por la parametrización

$$
g(t)=g(t_i)+((t-t_i)/\tau)^p (g(t_f)-g(t_i))
$$

donde $g$ es algún parámetro del hamiltoniano. En el presente caso tomaremos $g$ como el parámetro de interacción $V$. Comenzaremos nuestro sistema en el régimen CDW con $V/t=10$, haremos un quench al régimen SF donde $V/t=0$, y luego un quench de vuelta al régimen CDW con $V/t=10$. En las tres partes de este tutorial investigaremos a) los efectos de la escala temporal $\tau$ sobre el eco de Loschmidt durante un quench lineal, b) los efectos de "mantener" el sistema en la fase SF durante un tiempo $\tau_{\mathrm{hold}}$ antes de regresar a la fase CDW, y c) los efectos de cambiar la potencia $p$ de la función de quench.

### Quench lineal

Primero, investigaremos los efectos de la tasa de quench $\tau$ sobre la adiabaticidad de un quench lineal de la fase CDW a la fase SF y de vuelta.

#### Preparación y ejecución de la simulación usando Python

Para configurar y ejecutar la simulación en Python usamos el script <a href="../codes/tebd-01-bhquench/tutorial1a.py" download>`tutorial1a.py`</a>. Las primeras partes de este script importan los módulos requeridos y luego preparan los archivos de entrada como una lista de diccionarios de Python:

```python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

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
                 'POWS' : [1.0, 1.0],
                 'GS' : ['V',  'V'],
                 'GIS' : [10.0,  0.0],
                 'GFS' : [0.0,  10.0],
                 'NUMSTEPS' : [500,  500],
                 'STEPSFORSTORE' : [5, 3],
                 'SIMID' : count
            })
```

Repasemos con más detalle los parámetros específicos de TEBD (vea [1] para una lista de todos estos parámetros). El parámetro INITIAL_STATE se fija en ground, lo que significa que comenzamos desde el estado fundamental de nuestro hamiltoniano con los parámetros especificados por el usuario. Los parámetros $t$ y $V$ especifican que los parámetros iniciales del hamiltoniano $t=1$ y $V=10$ se usan para encontrar el estado fundamental. Para encontrar el estado fundamental, TEBD realiza una evolución en tiempo imaginario. Nos referimos a este paso como ITP, por lo que todos los parámetros que contienen ITP tratan con las propiedades del estado fundamental. Los vectores ITP_CHIS, ITP_DTS, e ITP_CONVS son los parámetros de corte de entrelazamiento, los pasos de tiempo, y los criterios de convergencia para aplicaciones sucesivas de propagación en tiempo imaginario. Estos constituyen los principales parámetros de convergencia para TEBD, y la convergencia siempre debe verificarse cuidadosamente en cada parámetro. Por ahora, no se preocupe demasiado por sus valores reales; veremos cómo se controlan los errores en el siguiente conjunto de tutoriales.

Ahora pasamos a los parámetros de propagación en tiempo real. Deseamos realizar una serie de dos quenches. Primero queremos hacer un quench del parámetro $V$ linealmente en el tiempo desde su valor inicial 10 hasta 0. Comparando con la forma general de un quench $g(t)=g(t_i)+((t-t_i)/\tau)^p (g(t_f)-g(t_i))$ vemos que esto corresponde a $g=V$, $g(t_i)=10$, $g(t_f)=0$, $p=1$, y $\tau$ es el parámetro libre cuyos efectos se van a investigar. Observando la lista de parámetros, vemos que los primeros elementos de los vectores GS, GIS, GFS, y POWS corresponden a $g$, $g(t_i)$, $g(t_f)$, y $p$, respectivamente. El primer elemento del vector TAUS se recorre en un bucle usando la variable A, lo que significa que realizaremos una serie de simulaciones con $\tau =5, 10, 15, 25,$ y $50$. El segundo quench es esencialmente el inverso del primero, con $g=V$, $g(t_i)=0$, $g(t_f)=10$, $p=1$, y $\tau$ igual al primero. Comparando con la lista de parámetros, vemos que esto corresponde a los segundos elementos de los vectores GS, GIS, etc. como arriba.

La evolución temporal se simula descomponiendo el propagador completo aproximadamente en una serie de operaciones que actúan solo sobre dos sitios vecinos a la vez. El error al usar este propagador aproximado es de segundo orden en el paso de tiempo "infinitesimal" dt. TEBD proporciona un protocolo para actualizar la forma canónica de nuestro estado después de que se ha aplicado dicha operación de dos sitios. El error en este procedimiento se controla mediante CHI_LIMIT, que está directamente relacionado con la cantidad de entrelazamiento espacial, y TRUNC_LIMIT, que es análogo al TRUNCATION_ERROR en las rutinas de DMRG. El vector de parámetros NUMSTEPS especifica cuántos pasos de tiempo se toman al realizar cada quench, lo que junto con $\tau$ define implícitamente el paso de tiempo dt. El error global es una función no trivial de CHI_LIMIT, TRUNC_LIMIT, y NUMSTEPS, que se investigará en el siguiente conjunto de tutoriales, así que no nos preocuparemos mucho por la elección de estos por ahora. Finalmente, STEPSFORSTORE determina cuántos pasos de tiempo se toman antes de que se calculen y almacenen los observables, y SIMID es un entero que diferencia las simulaciones con distintos $\tau$.

Ahora pasamos al cálculo real. Las líneas:

```python
baseName='tutorial_1a'
#write output files
nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
#run the application
res=pyalps.runTEBD(nmlnameList)
```

preparan los archivos de entrada para las rutinas TEBD y ejecutan las simulaciones para el rango de $\tau$ especificado en los parámetros. Ahora cargamos el eco de Loschmidt y el parámetro de interacción $V$ en función del tiempo mediante:

```python
#Load the loschmidt echo and V
LEdata=pyalps.load.loadTimeEvolution(pyalps.getResultFiles(prefix='tutorial_1a'), measurements=['Loschmidt Echo', 'V'])
```

Finalmente, graficamos los datos recopilados usando:

```python
LE=pyalps.collectXY(LEdata, x='Time', y='Loschmidt Echo',foreach=['SIMID'])
for q in LE:
    q.props['label']=r'$\tau=$'+str(q.props['TAUS'][0])
plt.figure()
pyalps.plot.plot(LE)
plt.xlabel('Time $t$')
plt.ylabel(r'Loschmidt Echo $|< \psi(0)|\psi(t) > |^2$')
plt.title('Loschmidt Echo vs. Time')
plt.legend(loc='lower right')

Ufig=pyalps.collectXY(LEdata, x='Time', y='V',foreach=['SIMID'])
for q in Ufig:
    q.props['label']=r'$\tau=$'+str(q.props['TAUS'][0])

plt.figure()
pyalps.plot.plot(Ufig)
plt.xlabel('Time $t$')
plt.ylabel('V')
plt.title('Interaction parameter $V$ vs. Time')
plt.legend(loc='lower right')
plt.show()
```

Las figuras resultantes se muestran a continuación:
![Linear Quench](../../../figs/tebd/linearquench.png)   
![Linear Quench V vs. t](../../../figs/tebd/linearquenchvt.png)  

#### Preguntas

- ¿Cómo cambia el comportamiento del solapamiento a medida que disminuye la tasa de quench?
- Aproximadamente, ¿qué tan lentamente hay que realizar el quench para que sea adiabático?
- ¿Es más fácil o más difícil para un sistema más grande ser adiabático? ¿Por qué?
- ¿Cambian estas propiedades dependiendo de si la fase intermedia tiene gap o no? Esto se puede probar cambiando del modelo de bosones de núcleo duro al modelo de Hubbard bosónico (de núcleo blando), y luego haciendo un quench desde la fase aislante de Mott (MI) en $U/t$ grande y llenado unitario a la fase CDW con $V$ grande. Al hacer el quench de la fase aislante de Mott a la fase CDW y de vuelta, ¿qué tan difícil es ser adiabático?

### Quench lineal con espera

En esta sección investigaremos los efectos de "mantener" el sistema en la fase SF durante un tiempo $\tau_{\mathrm{hold}}$ antes de hacer el quench de vuelta a la fase CDW.

#### Preparación y ejecución de la simulación usando Python

Para configurar y ejecutar la simulación en Python usamos el script <a href="../codes/tebd-01-bhquench/tutorial1b.py" download>`tutorial1b.py`</a>. Las primeras partes de este script importan los módulos requeridos y luego preparan los archivos de entrada como una lista de diccionarios de Python:

```python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

#prepare the input parameters
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

Nótese que en este caso tenemos tres quenches, ya que GS, GIS, etc. son todos vectores de longitud tres. El segundo quench mantiene los parámetros del hamiltoniano fijos en $t=1$, $V=0$ durante un tiempo $\tau_{\mathrm{hold}}$ antes de hacer el quench de vuelta. Escribimos los archivos de entrada, ejecutamos las simulaciones, obtenemos las salidas, y graficamos como arriba:

```python
baseName='tutorial_1b'
#write output files
nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
#run the application
res=pyalps.runTEBD(nmlnameList)
#Load the loschmidt echo and V
LEdata=pyalps.load.loadTimeEvolution(pyalps.getResultFiles(prefix='tutorial_1b'), measurements=['Loschmidt Echo', 'V'])
LE=pyalps.collectXY(LEdata, x='Time', y='Loschmidt Echo',foreach=['SIMID'])
for q in LE:
    q.props['label']=r'$\tau_{\mathrm{hold}}=$'+str(q.props['TAUS'][1])
plt.figure()
pyalps.plot.plot(LE)
plt.xlabel('Time $t$')
plt.ylabel(r'Loschmidt Echo $|< \psi(0)|\psi(t) > |^2$')
plt.title('Loschmidt Echo vs. Time')
plt.legend(loc='lower right')
Ufig=pyalps.collectXY(LEdata, x='Time', y='V',foreach=['SIMID'])
for q in Ufig:
    q.props['label']=r'$\tau_{\mathrm{hold}}=$'+str(q.props['TAUS'][1])
plt.figure()
pyalps.plot.plot(Ufig)
plt.xlabel('Time $t$')
plt.ylabel('V')
plt.title('Interaction parameter $V$ vs. Time')
plt.legend()
plt.show()
```

Las figuras resultantes se muestran a continuación:
![Linear Quench Hold](../../../figs/tebd/linearquenchhold.png)   
![Linear Quench Hold V vs. t](../../../figs/tebd/linearquenchholdvt.png) 

#### Preguntas

- ¿Cómo cambia el comportamiento del solapamiento a medida que aumenta el tiempo de espera?
- ¿Es este comportamiento monótono en el tiempo de espera? ¿Por qué sí o por qué no?

### Quenches no lineales

En esta sección investigaremos los efectos de variar la potencia del quench alejándose de ser lineal.

#### Preparación y ejecución de la simulación usando Python

Para configurar y ejecutar la simulación en Python usamos el script <a href="../codes/tebd-01-bhquench/tutorial1c.py" download>`tutorial1c.py`</a>. Las primeras partes de este script importan los módulos requeridos y luego preparan los archivos de entrada como una lista de diccionarios de Python:

```python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

#prepare the input parameters
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
  
Luego escribimos los archivos de entrada, ejecutamos las simulaciones, obtenemos las salidas, y graficamos como arriba:

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
    q.props['label']=r'$\tau=$'+str(q.props['POWS'][1])
plt.figure()
pyalps.plot.plot(LE)
plt.xlabel('Time $t$')
plt.ylabel(r'Loschmidt Echo $|< \psi(0)|\psi(t) > |^2$')
plt.title('Loschmidt Echo vs. Time ')
plt.legend(loc='lower left')

Ufig=pyalps.collectXY(LEdata, x='Time', y='V',foreach=['SIMID'])
for q in Ufig:
    q.props['label']=r'$\tau=$'+str(q.props['POWS'][1])
plt.figure()
pyalps.plot.plot(Ufig)
plt.xlabel('Time $t$')
plt.ylabel('V')
plt.title('Interaction parameter $V$ vs. Time')
plt.legend(loc='lower left')
plt.show()
```

Las figuras resultantes se muestran a continuación:
![Non-linear Quench](../../../figs/tebd/nonlinearquench.png)   
![Non-linear Quench V vs. t](../../../figs/tebd/nonlinearquenchvt.png) 


#### Preguntas

- ¿Cómo cambia el comportamiento del solapamiento a medida que cambia la potencia?
- Nuevamente cambie del modelo de bosones de núcleo duro al modelo de Hubbard bosónico e investigue la dinámica de la transición MI-CDW, esta vez con un quench no lineal. ¿Es el comportamiento diferente al de un quench lineal?
- El presente ejemplo usa un quench asimétrico que es lineal en un lado y no lineal en el otro. ¿Cómo cambia el comportamiento si hace ambos quenches no lineales?
