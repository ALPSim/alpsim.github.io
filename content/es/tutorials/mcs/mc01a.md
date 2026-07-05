
---
title: MC-01a Autocorrelaciones
math: true
toc: true
weight: 2
---

En simulaciones Monte Carlo de este tipo, las muestras consecutivas no son estadísticamente independientes: cada configuración se genera a partir de la anterior, por lo que los datos están correlacionados en el tiempo.
El *tiempo de autocorrelación* $\tau$ mide cuántos barridos (sweeps) de MC deben separar a dos muestras antes de que puedan tratarse como independientes.
Si $\tau$ es grande en comparación con el número total de barridos, las estimaciones ingenuas del error — que suponen muestras independientes — serán demasiado pequeñas y los resultados no serán fiables.
Este problema es más grave cerca de una transición de fase, donde la longitud de correlación diverge y las actualizaciones locales se vuelven muy ineficientes.

Este tutorial ilustra el problema usando el modelo de Ising 2D en su temperatura crítica y muestra cómo el cambio de actualizaciones locales (Metropolis) a actualizaciones de cúmulo reduce drásticamente los tiempos de autocorrelación.
La herramienta de diagnóstico clave es un *análisis de binning*: los errores se recalculan tras agrupar las muestras en bins sucesivamente más grandes; si el error estimado no alcanza una meseta en el tamaño de bin más grande, el tiempo de autocorrelación es mayor que la duración de la ejecución y los errores no son fiables.

Los archivos de entrada de este tutorial están disponibles en su distribución de ALPS en el directorio `mc-01-autocorrelations`.

## Actualizaciones locales

Simularemos un modelo de Ising en redes cuadradas finitas (L=2, 4, ..., 48) a la temperatura crítica $T_C=2.269186$ usando actualizaciones **locales**.
Este tutorial puede ejecutarse desde la línea de comandos o en Python. Recomendamos la versión en Python en su máquina local, y la versión de línea de comandos para simulaciones grandes en clústeres.

### Configuración y ejecución de la simulación desde la línea de comandos

Para configurar y ejecutar la simulación desde la línea de comandos, primero creamos un archivo de parámetros que especifica los parámetros de la(s) simulación(es). El <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01-autocorrelations/parm1a" download>archivo descargable</a> se llamará `parm1a`, con el siguiente contenido:

```
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=10000
SWEEPS=50000  
UPDATE="local"
MODEL="Ising"
{L=2;}
{L=4;}
{L=8;}
{L=16;}
{L=32;}
{L=48;}
```

Esto especifica en realidad seis tareas de simulación en un solo trabajo de simulación, todas con parámetros idénticos excepto por la longitud de red `L`.

ALPS espera un *archivo de trabajo* (job file) que especifique el trabajo como un todo y un *archivo de tarea* (task file) para cada tarea de simulación dentro de él, todos en formato XML. Así que para ejecutar la simulación, primero necesitamos convertir este archivo de parámetros. ALPS proporciona una herramienta simple para hacerlo: basta con ejecutar

```
parameter2xml parm1a
```

en la carpeta del archivo de parámetros. Esto generará seis archivos de tarea (uno por cada longitud L) llamados `parm1a.task1.in.xml` hasta `parm1a.task6.in.xml` y un archivo de descripción de trabajo `parm1a.in.xml`. Podemos abrir el archivo de trabajo con un navegador XML para comprobar el estado de nuestra simulación una vez que la hayamos iniciado.

La simulación puede iniciarse en un solo procesador ejecutando

```
spinmc --Tmin 10 --write-xml parm1a.in.xml
```

o en varios procesadores (ocho en este ejemplo) usando MPI:

```
mpirun -np 8 spinmc --mpi  --Tmin 10 --write-xml parm1a.in.xml 
```

(En los siguientes ejemplos nos referiremos únicamente a los comandos de un solo procesador.) Al establecer el argumento `--Tmin 10`, le indicamos al planificador (scheduler) que compruebe si la simulación ha terminado cada 10 segundos inicialmente. (El planificador adapta luego este tiempo dinámicamente según las necesidades de la simulación.)

El progreso de una simulación se guarda en el archivo de salida XML a medida que se ejecuta la simulación. Si una simulación se detiene, por ejemplo al pulsar Ctrl-C o al alcanzar el límite de tiempo de CPU, puede continuarse iniciando la simulación con el archivo de salida XML en lugar del archivo de trabajo de entrada. Dado que nuestro archivo de trabajo de entrada se llamaba `parm1a.in.xml`, el archivo de salida se llamará `parm1a.out.xml` y podemos reiniciar la simulación ejecutando

```
spinmc --Tmin 10 --write-xml parm1a.out.xml
```

La opción "--write-xml" le indica a la simulación que también almacene los resultados de cada simulación en un archivo de salida XML (`parm1a.task\[1-6\].out.xml`) que puede abrir desde el archivo de descripción de trabajo parm1a.out.xml usando su navegador XML, o alternativamente convirtiendo la salida a un archivo de texto con uno de los siguientes comandos:

```
firefox ./parm1a.out.xml
convert2text parm1a.out.xml
```

Los resultados de una sola tarea, almacenados por ejemplo en `parm1a.task1.out.xml`, pueden mostrarse usando cualquiera de los siguientes comandos:

- Linux: `firefox ./parm1a.task1.out.xml`
- MacOS: `open -a safari parm1a.task1.out.xml`
- Salida de texto: `convert2text parm1a.task1.out.xml`

Nótese que escribir archivos XML puede ser muy lento si se realizan muchas mediciones, y en ese caso es mejor trabajar con los resultados binarios en los archivos HDF5.

Para obtener información más detallada sobre las ejecuciones de la simulación, como comprobar la convergencia de los errores, podemos convertir los archivos de ejecución de las tareas (`parm1a.task\[1-6\].out.run1`) a archivos XML escribiendo

```
convert2xml parm1a.task*.out.run1
```

lo cual generará los archivos de salida XML `parm1a.task\[1-6\].out.run1.xml`, que pueden abrirse o convertirse a texto igual que los archivos de salida XML.

Observe las seis tareas y, al estudiar el análisis de binning en los archivos `parm1a.task\[1-6\].out.run1.xml`, note que para redes grandes los errores ya no convergen. Para crear gráficos, recomendamos usar las herramientas de Python descritas a continuación.

### Configuración y ejecución de la simulación en Python

El paquete `pyalps` es un envoltorio (wrapper) para ALPS: todo lo que hace es llamar a los comandos descritos en la sección anterior como si se ejecutaran en una terminal. Es superior para graficar porque la salida de la simulación puede leerse directamente en una estructura de datos de Python y accederse mediante `matplotlib`, y además incluye un envoltorio `pyalps.plot` para ciertas funciones de matplotlib, para graficar de forma clara los datos generados por `pyalps`.

Para configurar y ejecutar la simulación en Python, creamos un script llamado <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01-autocorrelations/tutorial1a.py" download>`tutorial1a.py`</a>. La primera parte de este script debe importar los módulos requeridos y preparar los archivos de trabajo y de tarea de entrada. En lugar de escribir un archivo de parámetros y usar `convert2xml`, almacenamos una lista que contiene los parámetros de cada tarea como un diccionario, así:

```Python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

parms = []
for l in [2,4,8,16,32,48]:
    parms.append(
        {
            'LATTICE'        : "square lattice",
            'T'              : 2.269186,
            'J'              : 1 ,
            'THERMALIZATION' : 10000,
            'SWEEPS'         : 50000,
            'UPDATE'         : "local",
            'MODEL'          : "Ising",
            'L'              : l
        }
    )
```

y lo convertimos en un archivo de trabajo XML con la función

```Python
input_file = pyalps.writeInputFiles('parm1a',parms)
```

La variable `input_file` puede usarse como entrada para `pyalps.runApplication` como se muestra a continuación:

```Python
pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True)
```

`spinmc` es el nombre del comando de terminal que se debe invocar. La opción `writexml=True` le indica a ALPS que escriba archivos XML, `input_file` es la ruta al archivo de entrada de trabajo XML, y `Tmin=5` de nuevo le indica a ALPS que compruebe cada 5 segundos si la simulación ha finalizado.

A continuación cargamos el análisis de binning para el valor absoluto de la magnetización desde los archivos de salida usando `pyalps.loadBinningAnalysis`, y aplanamos la lista de listas obtenida con `pyalps.flatten`:

```Python
binning = pyalps.loadBinningAnalysis(pyalps.getResultFiles(prefix='parm1a'),'|Magnetization|')
binning = pyalps.flatten(binning)
```

Le damos a cada conjunto de datos una etiqueta que aparecerá en la leyenda del gráfico para identificar el tamaño de la red:

```Python
for dataset in binning:
    dataset.props['label'] = 'L='+str(dataset.props['L'])
```

Las funciones de `pyalps.plot` usarán estas etiquetas automáticamente. Finalmente, creamos un gráfico que muestra el análisis de binning:

```Python
plt.figure()
plt.xlabel('binning level')
plt.ylabel('Error of |Magnetization|')
pyalps.plot.plot(binning)
plt.legend()
plt.show()
```

Para hacer gráficos separados para cada tamaño de sistema, iteramos sobre todos los conjuntos de datos:

```Python
for dataset in binning:
    plt.figure()
    plt.title('Binning analysis for L='+str(dataset.props['L']))
    plt.xlabel('binning level')
    plt.ylabel('Error of |Magnetization|')
    pyalps.plot.plot(dataset)
    
plt.show()
```

En la figura siguiente puede verse claramente que los errores no convergen para tamaños de sistema grandes.

![](/figs/mcs01binlocal.png)

## Actualizaciones de cúmulo

Cerca de la temperatura crítica, la longitud de correlación $\xi$ crece mucho y las actualizaciones locales se vuelven muy ineficientes: cada movimiento aceptado voltea un solo espín, por lo que se necesitan $O(\xi^2)$ barridos simplemente para descorrelacionar dos espines vecinos.
Esta *ralentización crítica* (critical slowing down) implica que el tiempo de autocorrelación diverge como
$$\tau \sim L^z,$$
donde $z \approx 2$ para actualizaciones locales pero $z \approx 0.25$ para algoritmos de cúmulo como Wolff o Swendsen–Wang.
Las actualizaciones de cúmulo voltean regiones enteras correlacionadas de una sola vez, eliminando esencialmente la ralentización crítica para las cantidades medidas aquí.

Por lo tanto, repetimos las simulaciones con actualizaciones de cúmulo, usando menos barridos de termalización (el sistema se descorrelaciona mucho más rápido) pero más barridos de medición para acumular buena estadística:

| **Parámetro** | **Valor** |
| :------- | :------- |
| THERMALIZATION | 1000 |
| SWEEPS | 100000 |
| UPDATE | "cluster" |

### Línea de comandos

El archivo de parámetros descargable <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01-autocorrelations/parm1b" download>`parm1b`</a> tiene el siguiente contenido:

```
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=1000
SWEEPS=100000
UPDATE="cluster"
MODEL="Ising"
{L=2;}
{L=4;}
{L=8;}
{L=16;}
{L=32;}
{L=48;}
```

Convierta y ejecute exactamente como antes:

```
parameter2xml parm1b
spinmc --Tmin 10 --write-xml parm1b.in.xml
```

### Python

El script <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01-autocorrelations/tutorial1b.py" download>`tutorial1b.py`</a> sigue la misma estructura que `tutorial1a.py`, con los parámetros actualizados y `parm1b` como prefijo de archivo:

```Python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

parms = []
for l in [2,4,8,16,32,48]:
    parms.append(
        {
            'LATTICE'        : "square lattice",
            'T'              : 2.269186,
            'J'              : 1,
            'THERMALIZATION' : 1000,
            'SWEEPS'         : 100000,
            'UPDATE'         : "cluster",
            'MODEL'          : "Ising",
            'L'              : l
        }
    )

input_file = pyalps.writeInputFiles('parm1b', parms)
pyalps.runApplication('spinmc', input_file, Tmin=5, writexml=True)

binning = pyalps.loadBinningAnalysis(pyalps.getResultFiles(prefix='parm1b'), '|Magnetization|')
binning = pyalps.flatten(binning)

for dataset in binning:
    dataset.props['label'] = 'L=' + str(dataset.props['L'])

plt.figure()
plt.xlabel('binning level')
plt.ylabel('Error of |Magnetization|')
pyalps.plot.plot(binning)
plt.legend()
plt.show()
```

Obtendrá curvas parecidas a las de abajo. Ahora los errores han convergido y pueden considerarse fiables.

![](/figs/mcs01bincluster.png)

## Preguntas

- ¿Han convergido los errores? (Para comprobarlo, convierta los archivos de ejecución como se describió anteriormente.)
- ¿Por qué los tiempos de autocorrelación más largos conducen a una convergencia más lenta de los errores?
- ¿De qué parámetros del sistema dependen los tiempos de autocorrelación? Compruébelo cambiando los parámetros en el archivo de entrada.
- ¿Puede explicar por qué las actualizaciones de cúmulo son más eficientes que las actualizaciones locales?




