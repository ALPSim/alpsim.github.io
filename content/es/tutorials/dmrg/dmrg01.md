
---
title: DMRG-01 DMRG
math: true
toc: true
---

## Modelos: Cadenas de Espín de Heisenberg

Para las aplicaciones de DMRG, consideramos dos modelos, a saber, las cadenas de Heisenberg antiferromagnéticas de espín-1/2 y de espín-1 de longitud L, dadas por el siguiente hamiltoniano,

$$
H = J\sum_{i=1}^{L-1} \left[\frac{1}{2} (S^+_i S^-_{i+1} + S^-_i S^+_{i+1}) + S^z_i S^z_{i+1}\right] .
$$

La razón por la que elegimos estos dos modelos, que quizás ya conozca de otros tutoriales, es que a pesar de su similitud superficial exhiben un comportamiento físico completamente distinto y plantean retos muy diferentes para el algoritmo DMRG. Repasemos brevemente sus propiedades físicas.

### Cadena de Espín-1/2

El estado fundamental de la cadena de espín-1/2 puede construirse de forma exacta mediante el ansatz de Bethe; por lo tanto, conocemos exactamente su energía del estado fundamental. En el límite termodinámico $L\rightarrow\infty$ la energía por sitio viene dada por

$$
E_0/J = 1/4 - \ln 2 = -0.4431471805599... 
$$

Las energías del estado fundamental como tales tienen un interés limitado si no se comparan con otras energías. Pero esta puede servir como un hermoso punto de referencia (benchmark) para el método DMRG. De mayor interés es si el estado fundamental está separado de los estados excitados por una diferencia de energía que sobrevive también en el límite termodinámico, es decir, si el *gap* se anula o no. Para la cadena de espín-1/2, el gap es 0.

Al mismo tiempo, uno puede preguntarse cómo se ve la correlación entre espines en distintos sitios. Se sabe que para la cadena de espín-1/2 infinitamente larga, asintóticamente (es decir, para $|i-j| \rightarrow \infty$)

$$
 \langle S^z_i S^z_j \rangle \sim (-1)^{|i-j|} \frac{\sqrt{\ln|i-j|}}{|i-j|}  .
$$

Esto significa que la cadena de espín-1/2 es *crítica*, es decir, las correlaciones antiferromagnéticas entre espines decaen con su distancia siguiendo una *ley de potencia*; en este caso el exponente de la ley de potencia es obviamente $-1$. Hay además una corrección adicional de raíz cuadrada de un logaritmo que puede verificarse maravillosamente mediante cálculos DMRG en cadenas muy largas, pero dado el incremento muy lento del logaritmo con su argumento, podemos ignorarla en un primer intento.

### Cadena de Espín-1

Durante décadas se pensó que la cadena de espín-1 se comportaría de forma similar, por supuesto con algunas diferencias cuantitativas debidas a las distintas longitudes de espín. Fue una gran sorpresa en 1982 cuando Duncan Haldane señaló que debería existir una diferencia fundamental entre las cadenas de Heisenberg antiferromagnéticas isotrópicas dependiendo de la longitud del espín, a saber, entre espines semienteros ($S=1/2,3/2,...$) y espines enteros ($S=1$), siendo la diferencia más pronunciada para longitudes de espín pequeñas. Por ello, la cadena de espín-1 se convirtió en el foco de un intenso interés, y de hecho DMRG tuvo algunas de sus aplicaciones tempranas más importantes precisamente en este sistema.

A diferencia de la cadena de espín-1/2, la cadena de espín-1 no tiene propiedades que puedan calcularse de forma exacta por medios analíticos. Debemos confiar completamente en la numérica cuando se trata de afirmaciones cuantitativas.

La energía del estado fundamental por sitio viene dada por

$$
 E_0/J = -1.401484039 ... .
 $$

De nuevo, la cuestión de la existencia de un gap es más importante, y aquí se hace visible una de las grandes diferencias con la cadena de espín-1/2: en el límite termodinámico, el gap en la cadena de espín-1 es finito y viene dado por

$$
 \Delta/J = 0.41052 
 $$

con una precisión de cinco cifras.

La cuestión del comportamiento de las correlaciones espín-espín conduce a otra gran diferencia con el caso de espín-1/2. Las correlaciones se leen asintóticamente (es decir, para $|i-j| \rightarrow \infty$)

$$
 \langle S^z_i S^z_j \rangle \sim (-1)^{|i-j|} \frac{\exp (-|i-j|/\xi)}{\sqrt{|i-j|}}  .
 $$

La contribución dominante es ahora el decaimiento exponencial, que ocurre en una escala de longitud $\xi$, la *longitud de correlación*, que en este caso particular se encuentra numéricamente que es $\xi=6.02$. Existe una corrección analítica (ley de potencia) mediante una raíz cuadrada de la distancia en el denominador, pero esto a menudo se desprecia en los cálculos de la longitud de correlación, ya que es una contribución lenta comparada con el rápido decaimiento exponencial. Esto importaría, por supuesto, si la longitud de correlación fuera mucho mayor.

La cadena de espín-1 es por tanto un excelente ejemplo de un sistema cuántico *no crítico* con gap finito y correlaciones que decaen exponencialmente. Como se verá, para DMRG este tipo de sistema es mucho más fácil de simular.

### Plan Del Tutorial

Lo que queremos lograr en el siguiente tutorial es poder calcular todas las cantidades anteriores usando ALPS DMRG mientras aprendemos sobre las principales trampas de este proyecto numérico.

### Vive la difference ...

La diferencia más importante con otros métodos numéricos es que DMRG prefiere condiciones de frontera abiertas, de modo que hay dos extremos de la cadena en el sitio 1 y en $L$, no un lazo cerrado como preferirían por ejemplo la diagonalización exacta y la mayoría de los métodos analíticos. Esto ya estaba implícito en la notación del hamiltoniano anterior y dará lugar a algunos de los aspectos más sutiles de los cálculos DMRG.

## Ejecutando El Código

### Observaciones Generales

Antes de empezar, discutamos brevemente la lógica interna del algoritmo DMRG sin entrar en pleno detalle. Dado un sistema cuántico unidimensional con espacios de estados locales de dimensión $d$, donde $d=2S+1$ para espines de magnitud $S$, la dimensión del espacio de Hilbert crece exponencialmente como $d^L$ con el tamaño del sistema $L$. La diagonalización exacta logra resultados exactos en este espacio de Hilbert exponencialmente grande, al precio de tamaños de sistema pequeños. El Monte Carlo cuántico da resultados aproximados muestreando estocásticamente este gran espacio, alcanzando tamaños de sistema mucho mayores. El grupo de renormalización de la matriz de densidad (DMRG) intenta otro enfoque más, a saber, identificar subespacios muy pequeños de tamaño $D$ del espacio de Hilbert exponencialmente grande, de los que se espera que contengan buenas, muy buenas, incluso excelentes aproximaciones a los estados de interés, como el estado fundamental.

Un primer parámetro de control clave es, por tanto, $D$, llamado *dimensión de la matriz* o *número de estados de bloque*. El parámetro $D$ controla el número de estados en el subespacio. DMRG es monótono en este parámetro: cuanto mayor es, mayor es el subespacio y mejor puede ser la aproximación. También hay un límite exacto: si $D\rightarrow d^L$, no se descarta ningún estado y la solución sería exacta. Esto, sin embargo, no tiene relevancia práctica; si se pudiera lograr un número tan grande de estados en la computadora, la diagonalización exacta sería una alternativa superior. 

El segundo parámetro de control clave es, por supuesto, el tamaño del sistema $L$.

El (los) tercer(os) parámetro(s) de control solo puede(n) entenderse mirando aún más de cerca el algoritmo DMRG. Para encontrar la mejor aproximación a un estado, DMRG procede en dos pasos:

1. En un primer paso (el llamado DMRG de *sistema infinito*) el algoritmo intenta encontrar buenos subespacios analizando iterativamente cadenas de longitud 2, 4, 6, hasta alcanzar el tamaño de sistema deseado $L$. El procedimiento consiste en dividir la cadena en cada iteración e insertar dos nuevos sitios en el centro; el nombre proviene del hecho de que este procedimiento puede, por supuesto, continuarse indefinidamente, para llevar $L$ a infinito; ¡pero no espere resultados muy significativos al acercarse al infinito! Una segunda observación es que este procedimiento favorece las cadenas de longitud par para el tratamiento DMRG.
2. En un segundo paso (el llamado DMRG de *sistema finito*) DMRG aborda el hecho de que la selección de subespacios para cadenas más cortas aún no pudo tener en cuenta todas las fluctuaciones cuánticas y correlaciones que estarían presentes en la cadena de longitud final $L$. Lo que hace el método es pasar por una serie de iteraciones adicionales para mejorar la calidad de los subespacios. Una de estas iteraciones que visita todos los sitios de una cadena se denomina *barrido* (sweep) en DMRG. El número de barridos es el último parámetro de control importante: si es demasiado pequeño, no se alcanza la precisión de los resultados para un $D$ dado; si es demasiado grande, el esfuerzo de cálculo podría desperdiciarse, aunque por supuesto siempre es bueno pecar de cauteloso.

Como última observación, consideremos el *error de truncación*, que es un buen indicador de la precisión lograda en una ejecución de DMRG. Desde una perspectiva simplificada, en cada punto del algoritmo DMRG da un paso en la dirección del crecimiento exponencial del espacio de estados y luego pregunta cuánta precisión puede conservarse si no se permite ese paso, mediante un análisis de una matriz de densidad respecto a la distribución de pesos (autovalores) correspondientes a sus autoestados. Las aproximaciones de DMRG se reflejan entonces en el hecho de que hay que descartar cierto peso estadístico, que es el llamado error de truncación. En muchas aplicaciones de DMRG, puede ser tan pequeño como $10^{-12}$, mostrando que las aproximaciones hechas por DMRG son extremadamente ligeras, lo cual es la razón del enorme éxito del método. Para los fines de este tutorial es importante saber que el error en cantidades locales (energías, magnetizaciones, ...) es aproximadamente proporcional a (pero usualmente bastante mayor que) el error de truncación, siempre que el número de barridos sea suficientemente grande.

### El Código ALPS DMRG y Sus Parámetros de Control

Además de entradas como el hamiltoniano y la geometría de la red, la simulación DMRG requiere un conjunto de parámetros de control específicos. Algunos de ellos se enumeran a continuación. Remitimos a los usuarios a la página de referencia de DMRG para más detalles.

#### Parámetros específicos de DMRG

**NUMBER_EIGENVALUES**
Número de autoestados y energías a calcular. El valor por defecto es 1; debe fijarse en 2 para calcular gaps.

**SWEEPS**
Número de barridos DMRG para el algoritmo de tamaño finito. Cada barrido implica un medio barrido de izquierda a derecha, y un medio barrido de derecha a izquierda.

**NUM_WARMUP_STATES**
Número de estados iniciales para hacer crecer los bloques DMRG. Si no se especifica, el algoritmo usará un valor por defecto de 20 estados.

**STATES**
Número de estados DMRG conservados en cada medio barrido. El usuario debe especificar ya sea 2*SWEEPS valores distintos de STATES, o bien un valor de MAXSTATES o NUMSTATES.

**MAXSTATES**
Número máximo de estados DMRG conservados. El usuario puede optar por especificar valores de STATES para cada medio barrido, o un MAXSTATES o NUMSTATES que el programa usará para hacer crecer la base. El programa determinará automáticamente cuántos estados usar en cada barrido, aumentando el tamaño de la base en pasos de STATES/(2*SWEEPS) hasta alcanzar MAXSTATES.

**NUMSTATES**
Número constante de estados DMRG conservados para todos los barridos.

**TRUNCATION_ERROR** 
Los usuarios pueden optar por fijar la tolerancia de la simulación, en lugar del número de estados. El programa determinará automáticamente cuántos estados conservar para satisfacer esta tolerancia. Debe tenerse cuidado, ya que esto podría llevar a un crecimiento incontrolable del tamaño de la base, y a un fallo como consecuencia. Por ello, es recomendable especificar también el número máximo de estados como restricción, usando MAXSTATES o NUMSTATES, como se explicó arriba.

**LANCZOS_TOLERANCE** 
Tolerancia para la parte de diagonalización (Davidson/Lanczos) del código. El valor por defecto es 10^-7.

**CONSERVED_QUANTUMNUMBERS**
Números cuánticos conservados por el modelo de interés. Se usarán en el código para reducir las matrices a formas de bloque. Si no se especifica ningún valor para un número cuántico particular, el programa trabajará en el ensamble gran canónico. Por ejemplo, para cadenas de espín, si no especifica Sz_total, el programa usará un espacio de Hilbert con dim=2^N estados. Ejecutar en el modo "canónico" (fijando Sz_total=0, por ejemplo) mejorará considerablemente el rendimiento al trabajar en un subespacio de dimensión reducida. Para un ejemplo de cómo hacer esto, consulte el archivo de parámetros incluido con el código dmrg.

#### Cómo elegir los parámetros correctos

No se recomiendan los valores de entrada por defecto. La convergencia de DMRG se ve fuertemente afectada por el número de estados usados en el calentamiento (warmup), el número de barridos, y el número máximo de estados conservados en cada iteración. Es una buena práctica observar la convergencia de la energía del estado fundamental y del error de truncación en función del número de estados. Esto indicará un número óptimo de estados a conservar para mantener los errores por debajo de cierta tolerancia.

Para determinar si se han realizado suficientes barridos, se puede observar la distribución espacial de las correlaciones, o cantidades locales como la magnetización de espín, o la densidad de partículas. Por ejemplo, en un modelo simétrico bajo reflexiones, esperaríamos que estos observables también sean simétricos. Otra cantidad que debería ser simétrica es la entropía de entrelazamiento. Si este comportamiento no se refleja en los resultados, es probable que se deba a no tener suficientes barridos en el cálculo (otro escenario plausible es la separación de fases).

Si el hamiltoniano conserva números cuánticos, como Sz o N, entonces es posible fijar estos valores para ejecutar la simulación en un subespacio de dimensión reducida. Esto resulta en ejecuciones mucho más rápidas y en un menor uso de memoria.

## Energías del Estado Fundamental

La primera pregunta que solemos hacernos es sobre el estado fundamental $| \psi_0 \rangle$ y su energía $E_0$. Aquí debemos distinguir dos casos.

Primero, podríamos estar interesados en la energía del estado fundamental para un hamiltoniano dado en una cadena de longitud dada $L$. Segundo, podríamos estar interesados en la energía por sitio (o por enlace) en el límite termodinámico.

### Energías del Estado Fundamental a Longitud Fija

Considere cadenas de longitud $L=32,64,96,128$. Tanto para espín-1/2 como para espín-1, configure cálculos de energía del estado fundamental para números de estados $D=50,100,150,200,300$. Para cada longitud, tabule el error de truncación y las energías del estado fundamental en función de $D$. Experimente cuidadosamente con el número de barridos para asegurarse de que, para una longitud y número de estados dados, su resultado esté realmente convergido.

1. Para cada tamaño de sistema y magnitud de espín, intente establecer la relación entre la precisión de la energía total y el error de truncación graficando la energía total frente al error de truncación.

2. Observe cómo se deteriora la convergencia en $D$ con el tamaño del sistema para espín-1/2 y espín-1. Aparte de un factor global del orden de la longitud, ¿ve alguna diferencia entre el comportamiento de convergencia en los dos casos? *Pista:* Lo que debería ver es que, salvo por el factor global, la convergencia para tamaños de sistema grandes depende solo débilmente de la longitud para la cadena de espín-1, pero mucho más fuertemente para la cadena de espín-1/2. Esto se debe a que la física de la cadena de espín-1 está dominada por segmentos de longitud comparable a la longitud de correlación, mientras que para la cadena de espín-1/2 no hay una escala de longitud finita debido a la criticidad.

3. Intente extrapolar las energías del estado fundamental para cada longitud de cadena al límite $D\rightarrow\infty$.

#### La cadena de Heisenberg unidimensional S=1/2

##### Ejecución única

El primer ejemplo consiste en configurar una simulación para una cadena de Heisenberg de espín-1/2 con 32 sitios, y condiciones de frontera abiertas, conservando 100 estados.

###### Usando archivos de parámetros

El archivo de parámetros [`spin_one_half`](https://github.com/ALPSim/ALPS/blob/bd842d1899feacd3d50392217f5239183d11a817/tutorials/dmrg-01-dmrg/spin_one_half) fija los parámetros más importantes.

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

Usando la siguiente secuencia de comandos puede primero convertir los parámetros de entrada a XML y luego ejecutar la aplicación `dmrg`:

```python
parameter2xml spin_one_half
dmrg --write-xml spin_one_half.in.xml
```

El archivo de salida `spin_one_half.task1.out.xml` contiene todas las cantidades calculadas y puede visualizarse con un navegador de internet estándar.

DMRG realizará cuatro barridos (cuatro medios barridos de izquierda a derecha y cuatro medios barridos de derecha a izquierda), haciendo crecer la base en pasos de MAXSTATES/(2\*SWEEPS) hasta alcanzar el valor MAXSTATES=100 que hemos declarado. Esta es una opción por defecto conveniente, pero el número de estados puede personalizarse, como mostramos en el ejemplo de espín S=1 más abajo.

###### Usando Python

Para configurar y ejecutar la simulación en Python usamos el script [`spin_one_half.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half.py). La primera parte de este script importa los módulos requeridos, prepara los archivos de entrada como una lista de diccionarios de Python, escribe los archivos de entrada y ejecuta la aplicación.

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

Para ejecutarlo, en la terminal de su computadora escriba
```python 
python spin_one_half.py
```
Ahora tenemos los mismos archivos de salida que en la versión de línea de comandos.

A continuación, cargamos las propiedades del estado fundamental medidas por el código DMRG

```python
data = pyalps.loadEigenstateMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'))
```
y las imprimimos en la terminal.

```python
for s in data[0]:
    print(s.props['observable'], ':', s.y[0])
```

Adicionalmente, podemos cargar datos detallados para cada paso de iteración.

```python
iter = pyalps.loadMeasurements(pyalps.getResultFiles(prefix='parm_spin_one_half'),
                          what=['Iteration Energy','Iteration Truncation Error'])
```

Lo anterior nos permite observar cómo convergió el algoritmo DMRG a los resultados finales.

Finalmente graficamos la convergencia de varias cantidades en función de las iteraciones.
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

##### Ejecuciones múltiples

###### Usando archivos de parámetros

Ahora procedemos a ilustrar cómo configurar varias ejecuciones en un único archivo de parámetros [`spin_one_half_multiple`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half_multiple). Usaremos el ejemplo propuesto en el tutorial, y simularemos una cadena de longitud L=32, cambiando el número de estados DMRG (usaremos un número menor de estados con fines ilustrativos):

```python
LATTICE="open chain lattice"
SWEEPS=4
CONSERVED_QUANTUMNUMBERS="N,Sz"
MODEL="spin", Sz_total=0
J=1
NUMBER_EIGENVALUES=1
L=32
{ MAXSTATES=20 }
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

Como podemos ver, la principal diferencia con el ejemplo anterior está en los parámetros codificados entre llaves. Como antes, ejecutamos:

```python
parameter2xml spin_one_half_multiple
dmrg --write-xml spin_one_half_multiple.in.xml
```

En este caso, encontraremos tres archivos de salida `spin_one_half_multiple.task#.out.xml` que contienen los resultados.

###### Usando Python

El script [`spin_one_half_multiple.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_half_multiple.py) configura tres diccionarios de Python con parámetros con distintos MAXSTATES

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

Después de escribir los archivos de parámetros, ejecutar la aplicación dmrg, y cargar los resultados de la misma forma que para la ejecución única anterior, podemos imprimir las mediciones de todas las ejecuciones.

```python
for run in data:
    for s in run:
        print(s.props['observable'], ':', s.y[0])
```

#### La cadena de Heisenberg unidimensional S=1

La cadena de Heisenberg S=1 requiere un tratamiento especial debido a las condiciones de frontera abiertas. Como se explicó arriba, necesitamos incluir dos sitios en ambos extremos de la cadena con un espín S=1/2 en cada uno de ellos. Esto requiere definir un nuevo archivo de red para la simulación. Como resulta, no hay una forma directa de hacer esto, así que tendremos que hacerlo manualmente. Para simplificar el proceso, hemos incluido un sencillo script de Python [`build_lattice.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/build_lattice.py) que generará la red por nosotros. La única entrada es el número de sitios en la red. Por ejemplo, escribiendo

```python
python build_lattice.py 6
```

obtendremos la salida

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

Como podemos ver, la red se define como un grafo unidimensional que contiene seis vértices, y enlaces que conectan primeros vecinos. El primer y el último vértice son de tipo "0", mientras que los demás son de tipo "1". Usaremos esta definición para implementar el modelo sobre esta red, la cual debe contener información sobre los grados de libertad que viven en estos vértices.

La forma de hacerlo es especificando los parámetros:

```python
local_S0=0.5
local_S1=1
```

Para ejecutar una red con 32 sitios escribiremos entonces

```python
python build_lattice.py 32 > my_lattice.xml
```

##### Usando archivos de parámetros

Veamos cómo debería verse el archivo de parámetros final [`spin_one`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one):

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

Claramente, es engorroso repetir este proceso para cada tamaño de sistema. Una forma de simplificarlo aún más es escribir un script que lo haga automáticamente por nosotros. Una más sencilla es definir todas las redes que necesitamos en una biblioteca de redes. Hemos incluido un archivo [`my_lattices.xml`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/my_lattices.xml) con redes de tamaños $L=32,64,96,128,192$. Todo lo que tenemos que hacer es modificar el archivo de parámetros anterior reemplazando la definición de la red de la siguiente manera:

```python
LATTICE_LIBRARY="my_lattices.xml"
LATTICE="open chain lattice with special edges 32"
```
donde hemos incluido el tamaño de la red en el nombre.

##### Usando Python

El script [`spin_one.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one.py) define los parámetros en un diccionario de Python.

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

Aparte de los cambios de parámetros y de nombre de archivo, es igual al script `spin_one_half.py` explicado anteriormente.

##### Ejecuciones múltiples

###### Usando archivos de parámetros

Igual que para el caso de espín S=1/2, ahora podemos configurar varias ejecuciones en un único archivo de parámetros llamado [`spin_one_multiple`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_multiple) de la siguiente manera:

```python
LATTICE_LIBRARY="my_lattices.xml"
LATTICE="open chain lattice with special edges 32"
MODEL="spin"
local_S0=0.5
local_S1=1
CONSERVED_QUANTUMNUMBERS="N,Sz"
Sz_total=0
J=1 
NUMBER_EIGENVALUES=1 
SWEEPS=4
{ MAXSTATES=20 } 
{ MAXSTATES=40 }
{ MAXSTATES=60 }
```

###### Usando Python

Las mismas ejecuciones pueden configurarse con el script [`spin_one_multiple.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/dmrg-01-dmrg/spin_one_multiple.py), que puede obtenerse a partir del script correspondiente de espín-1/2 reemplazando los parámetros.

### Energías del Estado Fundamental Por Sitio (Enlace)

Si miramos de cerca el hamiltoniano, la energía de una cadena de longitud $L$ no reside en los $L$ sitios, sino en los $L-1$ enlaces. Un primer intento (ingenuo) consiste, por tanto, en tomar los resultados de las últimas simulaciones y calcular

$$
e_0/J = \frac{E_0(L)}{L-1}.
$$

¿Obtiene valores realmente cercanos a los listados en la introducción? ¿Qué está mal con la suposición subyacente?

La forma correcta es eliminar el efecto de las condiciones de frontera abiertas considerando la energía de un enlace en el centro de la cadena. Hay dos formas de hacerlo.

1. Calcule la energía del estado fundamental de dos cadenas de longitud $L$ y $L+2$, de nuevo para las longitudes ya mencionadas arriba, y calcule $e_0/J = (E_0(L+2) - E_0 (L))/2$ como la energía por enlace. ¿Cómo se ven los resultados ahora?

2. La forma menos costosa y usual sería usar correladores (como se discute más adelante, así que posponemos este ejercicio hasta entonces) entre sitios vecinos y usar
$$
e_0/J = \frac{1}{2} (\langle S^+_i S^-_{i+1}\rangle  + \langle S^-_i S^+_{i+1}\rangle ) + \langle S^z_i S^z_{i+1} \rangle 
$$

para sitios $i,i+1$ en el centro de la cadena.
