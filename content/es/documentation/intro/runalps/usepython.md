
---
title: ALPS usando Python
toc: true
weight: 3
---

## Ejecución de programas de ALPS usando Python

Para demostrar el uso de ALPS desde Python, veremos una simulación de Monte Carlo clásica simple, similar al segundo tutorial de MC segundo tutorial de MC.

## Iniciar Python

Python restringe las extensiones de Python para que se usen solo con la versión **exacta** de Python usada para compilar la extensión, y ninguna otra. Si compila ALPS desde el código fuente, como se requiere por ejemplo en Linux, puede especificar el intérprete de Python a usar al configurar ALPS. ALPS creará entonces un script llamado

    alpspython
    
que establece las rutas necesarias para encontrar las extensiones de ALPS y luego llama a su intérprete de Python.

## Instrucciones detalladas

### Importación de los módulos de ALPS

Después de iniciar Python, importamos los módulos que necesitaremos:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot

El script completo de Python está en el directorio de tutoriales en tutorials/intro-01-basics/tutorial-full.py

### Preparación de la entrada

Para preparar la entrada, creamos una lista de Python de diccionarios que contienen los parámetros de la simulación:

    parms = []
    for t in [1.5,2,2.5]:
    parms.append(
        { 
            'LATTICE'        : "square lattice", 
            'T'              : t,
            'J'              : 1 ,
            'THERMALIZATION' : 1000,
            'SWEEPS'         : 100000,
            'UPDATE'         : "cluster",
            'MODEL'          : "Ising",
            'L'              : 8
        }
    )

A continuación escribimos los archivos de entrada para la simulación de ALPS:

    input_file = pyalps.writeInputFiles('parm1',parms)

El argumento 'parm1' le indica a la función que use parm1 como prefijo para todos los archivos de simulación. La función devuelve el nombre del archivo de simulación principal (aquí `parm1.in.xml`).

### Ejecución de la simulación

#### Ejecución de la simulación en una máquina serial

Para ejecutar la simulación simplemente llamamos a la función runApplication:

    pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True)
    
El parámetro writexml=True le indica a ALPS que escriba todos los resultados también en los archivos XML. Esto ralentiza la E/S pero es conveniente ya que le permite ver los resultados simplemente abriendo los archivos XML de salida en su navegador web. Sin embargo, si mide muchas cantidades, los archivos se volverán enormes y la escritura tardará demasiado.

#### Ejecución de la simulación en una máquina paralela

Para ejecutar la simulación en una máquina paralela usando MPI, llame en su lugar al siguiente comando:

    pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True,MPI=4)

donde el argumento MPI le indica a MPI cuántos procesos iniciar.

### Carga de los resultados de la simulación

#### Obtención de los archivos de resultados

Antes de cargar los resultados necesitamos obtener la lista de archivos de resultados. Mirando solo los archivos que acabamos de crear (aquellos que comienzan con el prefijo parm1) obtenemos la lista de archivos:

    result_files = pyalps.getResultFiles(prefix='parm1')
    print result_files

#### Carga de los resultados

A continuación, podríamos querer saber qué se ha medido. Para eso podemos cargar la lista de observables:

    print pyalps.loadObservableList(result_files)
    
Decidimos cargar el valor absoluto y el cuadrado de la magnetización, e imprimir lo que cargamos:

    data = pyalps.loadMeasurements(result_files,['|Magnetization|','Magnetization^2'])
    print data
    
La salida impresa contiene los valores cargados en y, y todos los parámetros de la simulación en el diccionario llamado props.

### Graficar los resultados 

Para hacer un gráfico de, por ejemplo, |Magnetization| en función de la temperatura, ahora recopilamos los valores de |Magnetization| en y y la temperatura T en x mediante una llamada a collectXY:

    plotdata = pyalps.collectXY(data,'T','|Magnetization|')

#### Graficar en Python usando `matplotlib`

y luego lo graficamos usando `matplotlib` y el módulo pyalps.plot:

    plt.figure()
    pyalps.plot.plot(plotdata)
    plt.xlim(0,3)
    plt.ylim(0,1)
    plt.title('Ising model')
    plt.show()

#### Conversión a otros formatos

También podemos llamar a funciones para convertir el conjunto de datos a otros formatos de gráfico, como texto, grace o gnuplot:

    print pyalps.plot.convertToText(plotdata)
    print pyalps.plot.makeGracePlot(plotdata)
    print pyalps.plot.makeGnuplotPlot(plotdata)

### Evaluación de datos

Podemos evaluar fácilmente funciones de los resultados, por ejemplo, para calcular la razón del cumulante de Binder $\langle m^2 \rangle / \langle |m|\rangle ^2$. Creamos un nuevo DataSet y lo llenamos:

    binder = pyalps.DataSet()
    binder.props = pyalps.dict_intersect([d[0].props for d in data])
    binder.x = [d[0].props['T'] for d in data]
    binder.y = [d[1].y[0]/(d[0].y[0]*d[0].y[0]) for d in data]
    print binder

La expresión `d[1].y[0]/(d[0].y[0]*d[0].y[0])` usa el análisis jackknife para calcular las barras de error correctas de Monte Carlo para las cantidades correlacionadas.

Finalmente, hacemos otro gráfico:

    plt.figure()
    pyalps.plot.plot(binder)
    plt.xlabel('T')
    plt.ylabel('Binder cumulant')
    plt.show()

## Scripts de ejemplo completos

El script completo está en el archivo tutorials/intro-01-basics/tutorial-full.py .

A continuación presentaremos scripts más pequeños para varias tareas:

### Ejecutar y graficar

- Preparación de un gráfico de la magnetización en MatPlotLib: tutorials/intro-01-basics/tutorial-magnetization.py
- Preparación de un gráfico de la magnetización en Grace: tutorials/intro-01-basics/tutorial-graceplot.py
- Preparación de un gráfico de la magnetización en Gnuplot: tutorials/intro-01-basics/tutorial-gnuplot.py
- Preparación de una salida de la magnetización en texto plano: tutorials/intro-01-basics/tutorial-text.py

### Evaluación más compleja

- El cálculo de los cumulantes de Binder está en el archivo tutorials/intro-01-basics/tutorial-binder.py .

### División en subtareas

Las tareas de preparación, simulación y evaluación también pueden dividirse en subtareas:

- Preparación de los archivos de entrada: tutorials/intro-01-basics/tutorial-prepareinput.py
- Ejecución de la simulación: tutorials/intro-01-basics/tutorial-runsimulation.py 
- Evaluación de los resultados: tutorials/intro-01-basics/tutorial-evaluate.py 

## Más ejemplos

Se pueden encontrar más ejemplos de uso de las diversas funciones y aplicaciones más avanzadas en los tutoriales. Además, no olvide consultar la documentación de las diversas funciones usando la variable miembro __doc__ de las funciones, como en:

    print pyalps.plot.plot.__doc__

