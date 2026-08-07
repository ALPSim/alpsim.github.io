
---
title: TEBD-02 kink
math: true
toc: true
---

## Evolución de una pared de dominio

En este tutorial estudiaremos la evolución temporal de una cadena de espín S=1/2 preparada en un estado fuera de equilibrio. El estado particular que elegimos es aquel con todos los espines a la izquierda del centro de la cadena "abajo" y todos los de la derecha del centro "arriba", $| \downarrow \downarrow \dots \downarrow \uparrow \dots \uparrow \uparrow\rangle$. Este estado se puede elegir como estado inicial fijando INITIAL_STATE en 'kink'. Se conocen algunos resultados exactos respecto a la evolución de este estado bajo el modelo XX 1D, lo que permite un estudio detallado de los errores presentes en TEBD.

### Solución exacta para el caso del modelo XX

La evolución temporal del estado inicial kink bajo el modelo XX se resolvió exactamente en Phys. Rev. E 59, 4912 (1999) mediante una transformación de Jordan-Wigner a fermiones libres. Se encontró que el valor esperado de la magnetización en cualquier sitio en función del tiempo puede representarse como una suma de funciones de Bessel, y que la magnetización en el límite de tiempos largos y grandes distancias desde la pared de dominio inicial se aproxima a una forma de escala en la variable $n/t$, donde $n$ es la distancia desde el centro y $t$ el tiempo. Explícitamente, tenemos

$$
 M(n,t)=-\frac{1}{2}\sum_{i=1-n}^{n-1}j_i^2\left(t\right)
 $$

$$
\lim_{n\to \infty} \lim_{t\to \infty} M(n,t)\to \phi\left(n/t\right)=-\frac{1}{\pi}\arcsin\left(n/t\right)
$$

donde $M(n,t)$ es la magnetización a una distancia $n$ del centro y $j_i(t)$ es la función de Bessel de orden $i$. En la primera parte de este tutorial demostramos estos dos resultados.

#### Preparación y ejecución de la simulación usando Python

Para configurar y ejecutar la simulación en Python usamos el script `tutorial2a.py`. Las primeras partes de este script importan los módulos requeridos y preparan los archivos de entrada como una lista de diccionarios de Python:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot
    import numpy as np
    import copy
    import math
    import scipy.special
    #prepare the input parameters
    parms = [{ 
            'L'                         : 50,
            'MODEL'                     : 'spin',
            'local_S'                   : 0.5,
            'CONSERVED_QUANTUMNUMBERS'  : 'Sz_total',
            'Jxy'                         : 1,
            'INITIAL_STATE' : 'kink',
            'CHI_LIMIT' : 40,
            'TRUNC_LIMIT' : 1E-12,
            'NUM_THREADS' : 1,
            'TAUS' : [20.0],
            'POWS' : [0.0],
            'GS' : ['H'],
            'GIS' : [0.0],
            'GFS' : [0.0],
            'NUMSTEPS' : [500],
            'STEPSFORSTORE' : [2]
        }]

Los módulos math y scipy.special son necesarios para generar las funciones especiales necesarias para comparar con la solución exacta. Nótese que hemos elegido POWS igual a cero, lo que corresponde a que no hay quench en absoluto. Por lo tanto, los valores de GS, GIS, y GFS son arbitrarios, y TAUS y NUMSTEPS nos dan el tiempo total de simulación y el número de pasos de tiempo, respectivamente. Escribimos los archivos de entrada, ejecutamos la simulación, y obtenemos la salida como de costumbre:

    baseName='tutorial_2a'
    nmlname=pyalps.writeTEBDfiles(parms, baseName)
    res=pyalps.runTEBD(nmlname)
    #Get the results of the simulation
    Data=pyalps.load.loadTimeEvolution(pyalps.getResultFiles(prefix='tutorial_2a'), measurements=['Local Magnetization'])

Ahora debemos posprocesar la salida bruta para compararla con la solución exacta. Para hacer esto primero definimos arreglos vacíos para contener los datos posprocesados

    #define a dataset numericalSolution to contain the numerical result
    numericalResult=[]
    #define a dataset exactSolution to contain the exact solution
    exactResult=[]
    #define a dataset scalingForm to contain the scaling form
    scalingForm=[]

luego calculamos el resultado exacto a partir de los datos temporales, y usamos los valores calculados de la magnetización en cada sitio para compararlos con la solución exacta.

    #Compute the exact result M(n,t)=<S_n^z>=-(1/2)*sum_{i=1-n}^{n-1} j_i(t)^2, where
    # j_i(t) is the Bessel function of order i and compare to the numerically obtained result
    for q in Data:
        syssize=q[0].props['L']
        #Assign a label 'Distance' denoting the distance from the center n (only do the first two sites
        #to avoid cluttering the plot)
        for n in range(1,3):
                #Create copies of the data for postprocessing
                numericalCopy=copy.deepcopy(q)
                exactCopy=copy.deepcopy(q)
                
                numericalCopy[0].props['Distance']=n
                numericalCopy[0].props['SIMID']='Numerical at n='+str(n)
                exactCopy[0].props['Distance']=n
                exactCopy[0].props['SIMID']='Exact at n='+str(n)

                #compute the exact result of the magnetization n sites from the center
                loc=0.0
                for i in range(1-n,n):
                        loc-=0.5*scipy.special.jn(i,q[0].props['Time'])*scipy.special.jn(i,q[0].props['Time'])                        
                exactCopy[0].y=[loc]
                #add to the exact dataset
                exactResult.extend(exactCopy)

                #get the numerical result of the magnetization n sites from the center
                numericalCopy[0].y=[q[0].y[syssize/2+n-1]]
                #add to the numerical dataset
                numericalResult.extend(numericalCopy)

A continuación, calculamos la función de escala exacta, y luego calculamos la magnetización en función de la variable de escala $n/t$ para comparar con la solución exacta

    #compute the scaling form
    # \phi(n/t)=-(1/pi)*arcsin(n/t) that M(n,t) approaches as n->infinity and t->infinity
    # and compare it with the numerically computed values of M(n/t)
    for q in Data:
        syssize=q[0].props['L']
        #Assign a label 'Distance' denoting the distance from the center n (only do the first few sites
        #to avoid cluttering the plot)
        for n in range(0,5):
                #Create a copy of the data for postprocessing
                scalingCopy=copy.deepcopy(q)
                scalingCopy[0].props['Distance']=n

                #The first distance contains the exact scaling form \phi(n/t)=-(1/pi)*arcsin(n/t)
                if n==0:
                        scalingCopy[0].props['Time']=1.0/scalingCopy[0].props['Time']
                        scalingCopy[0].y=[-(1.0/3.1415926)*math.asin(min(scalingCopy[0].props['Time'],1.0))]
                    scalingCopy[0].props['SIMID']='Exact'

                #The other distances contain the numerical data as a function of the scaling variable M(n/t)
                else:
                        scalingCopy[0].props['Time']=n/scalingCopy[0].props['Time']
                        scalingCopy[0].y=[scalingCopy[0].y[syssize/2+n-1] ]
                    scalingCopy[0].props['SIMID']='Numerical at n='+str(n)
                #add to the scaling dataset
                scalingForm.extend(scalingCopy)

Finalmente, graficamos los resultados exactos y numéricos para compararlos.

    #Plot the numerical and exact magnetization for comparison
    exactMag=pyalps.collectXY(exactResult, x='Time', y='Local Magnetization',foreach=['SIMID'])
    for q in exactMag:
        q.props['label']=q.props['SIMID']
    numericalMag=pyalps.collectXY(numericalResult, x='Time', y='Local Magnetization',foreach=['SIMID'])
    for q in numericalMag:
        q.props['label']=q.props['SIMID']

    plt.figure()
    pyalps.plot.plot([exactMag, numericalMag])
    plt.xlabel('Time $t$')
    plt.ylabel('Magnetization')
    plt.legend(loc='lower right')
    plt.title('Magnetization vs. time')
    #Plot the scaling form with the numerical data for comparison
    Scal=pyalps.collectXY(scalingForm, x='Time', y='Local Magnetization', foreach=['SIMID'])
    for q in Scal:
        q.props['label']=q.props['SIMID']
    plt.figure()
    pyalps.plot.plot(Scal)
    plt.xlabel('Scaling variable $n/t$')
    plt.ylabel('Magnetization$(n,t)$')
    plt.legend()
    plt.xlim(0,1.5)
    plt.title('Magnetization scaling function; numerical and exact results')
    plt.show()

Vemos que la magnetización concuerda muy bien a precisión visual, y se aproxima a la forma de escala exacta en el límite relevante.

### Análisis de error de TEBD 1: error del paso de tiempo

Ahora usamos la solución exacta para calcular el error en una simulación TEBD en función del tiempo. Primero investigamos los efectos de cambiar el paso de tiempo "infinitesimal" dt.

#### Preparación y ejecución de la simulación usando Python

Para configurar y ejecutar la simulación en Python usamos el script `tutorial2b.py`. Las primeras partes de este script importan los módulos requeridos y preparan los archivos de entrada como una lista de diccionarios de Python:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot
    import numpy as np
    import math
    import scipy.special
    #prepare the input parameters
    parms=[]
    count=0
    for nsteps in [100, 250, 500, 750, 1000]:
       count+=1
       parms.append({ 
                 'L'                         : 50,
                 'MODEL'                     : 'spin',
                 'local_S'                   : 0.5,
                 'CONSERVED_QUANTUMNUMBERS'  : 'Sz_total',
                 'Jxy'                         : 1,
                 'INITIAL_STATE' : 'kink',
                 'CHI_LIMIT' : 20,
                 'TRUNC_LIMIT' : 1E-12,
                 'NUM_THREADS' : 1,
                 'TAUS' : [20.0],
                 'POWS' : [0.0],
                 'GS' : ['H'],
                 'GIS' : [0.0],
                 'GFS' : [0.0],
                 'NUMSTEPS' : [nsteps],
                 'STEPSFORSTORE' : [int(math.floor(nsteps/100))],
                 'SIMID': count
               })

Al cambiar el parámetro NUMSTEPS cambiamos implícitamente el paso de tiempo, ya que el tiempo total de evolución TAU es fijo. Ahora escribimos los archivos de entrada, ejecutamos las simulaciones, y recopilamos los datos:

    baseName='tutorial_2b_'
    nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
    res=pyalps.runTEBD(nmlnameList)
    #Get magnetization data
    Magdata=pyalps.load.loadTimeEvolution( pyalps.getResultFiles(prefix='tutorial_2b'), measurements=['Local Magnetization'])

Ahora calculamos el resultado exacto a partir de los datos temporales, y luego calculamos la diferencia entre el resultado numérico y el exacto para la magnetización

    #Postprocessing-get the exact result for comparison
    for q in Magdata:
        syssize=q[0].props['L']
        #Get the exact result of M(1,t)=-(1/2)*(j_0(t)^2), where j_0(t) is the 0^{th} order
        # bessel function and M(1,t) is the magnetization one site to the right of the chain center
        loc=-0.5*scipy.special.jn(0,q[0].props['Time'])*scipy.special.jn(0,q[0].props['Time'])
        #Get the difference between the computed and exact results
        q[0].y=[abs(q[0].y[syssize/2+1-1]-loc)]

Finalmente, graficamos este error de magnetización:

    #Plot the Error in the magnetization one site to the right of the chain center
    Mag=pyalps.collectXY(Magdata, x='Time', y='Local Magnetization', foreach=['SIMID'])
    for q in Mag:
        dt=round(q.props['TAUS']/q.props['NUMSTEPS'],3)
        q.props['label']='dt='+str(dt)
    plt.figure()
    pyalps.plot.plot(Mag)
    plt.xlabel('Time $t$')
    plt.yscale('log')
    plt.ylabel('Magnetization Error')
    plt.title('Error in the magnetization vs. time')
    plt.legend(loc='lower left')
    plt.show()

Vemos que, para tiempos cortos, los errores son aproximadamente proporcionales a dt^2, reflejando la contribución al error de la descomposición de Trotter de nuestra exponencial. Sin embargo, a tiempos largos, las simulaciones con el dt más pequeño tienen errores que se vuelven mayores que los de dt más grande, ¡y eventualmente los errores explotan! Diremos más sobre este comportamiento en la siguiente sección.

### Análisis de error de TEBD 2: error de corte de entrelazamiento

Ahora investigamos los efectos de cambiar el parámetro de corte de entrelazamiento $\chi$ sobre los errores en la magnetización.

#### Preparación y ejecución de la simulación usando Python

Para configurar y ejecutar la simulación en Python usamos el script tutorial2c.py. Las primeras partes de este script importan los módulos requeridos y preparan los archivos de entrada como una lista de diccionarios de Python:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot
    import math
    import scipy.special
    #prepare the input parameters
    parms=[]
    count=0
    for chi in [10, 20, 30, 40]:
        count+=1
        parms.append({ 
                 'L'                         : 50,
                 'MODEL'                     : 'spin',
                 'local_S'                   : 0.5,
                 'CONSERVED_QUANTUMNUMBERS'  : 'Sz_total',
                 'Jxy'                         : 1,
                 'INITIAL_STATE' : 'kink',
                 'CHI_LIMIT' : chi,
                 'TRUNC_LIMIT' : 1E-12,
                 'NUM_THREADS' : 1,
                 'TAUS' : [20.0],
                 'POWS' : [0.0],
                 'GS' : ['H'],
                 'GIS' : [0.0],
                 'GFS' : [0.0],
                 'NUMSTEPS' : [500],
                 'STEPSFORSTORE' : [5],
                 'SIMID': count
               })

Ahora escribimos los archivos de entrada, ejecutamos las simulaciones, recopilamos los datos, y calculamos los errores como arriba

    baseName='tutorial_2c_'
    nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
    res=pyalps.runTEBD(nmlnameList)

    #Get magnetization data
    Magdata=pyalps.load.loadTimeEvolution( pyalps.getResultFiles(prefix='tutorial_2c'), measurements=['Local Magnetization'])

    #Postprocessing-get the exact result for comparison
    for q in Magdata:
        syssize=q[0].props['L']
        #Get the exact result of M(1,t)=-(1/2)*(j_0(t)^2), where j_0(t) is the 0^{th} order
        # bessel function and M(1,t) is the magnetization one site to the right of the chain center
        loc=-0.5*scipy.special.jn(0,q[0].props['Time'])*scipy.special.jn(0,q[0].props['Time'])
        #Get the difference between the computed and exact results
        q[0].y=[abs(q[0].y[syssize/2+1-1]-loc)]

Finalmente, graficamos el error de magnetización

    #Plot the Error in the magnetization one site to the right of the chain center
    Mag=pyalps.collectXY(Magdata, x='Time', y='Local Magnetization', foreach=['SIMID'])
    for q in Mag:
        q.props['label']='$\chi$='+str(q.props['CHI_LIMIT'])
    plt.figure()
    pyalps.plot.plot(Mag)
    plt.xlabel('Time $t$')
    plt.yscale('log')
    plt.ylabel('Magnetization Error')
    plt.title('Error in the magnetization vs. time')
    plt.legend(loc='lower left')
    plt.show()

Vemos que, para tiempos cortos, los errores son aproximadamente proporcionales a dt^2, reflejando nuevamente la contribución al error de la descomposición de Trotter de nuestra exponencial. Sin embargo, a medida que aumenta el tiempo, se produce una cascada de errores divergentes. Primero la simulación con $\chi=10$ diverge alrededor de $t=5$, luego la simulación con $\chi=20$ diverge alrededor de $t=9$ y así sucesivamente. Este colapso se debe al hecho de que el protocolo para encontrar el estado de producto matricial que mejor aproxima al estado evolucionado en el tiempo es aproximado cuando el estado se vuelve altamente entrelazado. Esta aproximación implica una renormalización de la función de onda, por lo que los errores se acumulan aproximadamente de forma exponencial en el tiempo.

Este crecimiento exponencial de los errores también explica el fallo de las simulaciones con dt más pequeño. A medida que dt se vuelve más pequeño debemos aplicar el esquema de propagación aproximado más veces para alcanzar el mismo tiempo final fijo, y esto significa más acumulación del error de truncamiento que crece exponencialmente. Por lo tanto, debemos encontrar un equilibrio delicado entre el error incurrido al aumentar el paso de tiempo y el error incurrido al tomar más pasos de tiempo. Todos los resultados deben verificarse cuidadosamente en cuanto a convergencia tanto en dt como en $\chi$.


### Solución para el caso del modelo XXZ

Vimos a partir de la solución exacta que el perfil de magnetización tenía un frente bien definido que se expandía balísticamente con velocidad $v=1$. El modelo XX tiene muchas propiedades especiales, por lo que es natural preguntarse si este mismo comportamiento de magnetización se mantiene bajo condiciones más generales. En esta parte del tutorial investigamos los efectos de agregar un término $J_z S_i^z S_{i+1}^z$ al hamiltoniano, correspondiente al modelo XXZ. En el límite en que este término domina, los espines quedan congelados en una configuración paralela, por lo que el estado inicial se convierte en un autoestado exacto del hamiltoniano. Los términos XX en el hamiltoniano intentan voltear los espines, y son responsables del frente de onda de magnetización propagante que vimos en el modelo XX puro. Como medida cuantitativa de la capacidad del sistema para transportar espín, consideramos el flujo integrado de magnetización a través del centro, definido en Phys. Rev. E 71 036102(2005) como

$$
 \Delta M(t)=\sum_{n>L/2}^{L} (\langle S_n^z(t)\rangle+1/2) 
$$

#### Preparación y ejecución de la simulación usando Python

Para configurar y ejecutar la simulación en Python usamos el script `tutorial2d.py`. Las primeras partes de este script importan los módulos requeridos y preparan los archivos de entrada como una lista de diccionarios de Python:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot
    import math
    import scipy.special
    
    #prepare the input parameters
    parms=[]
    count=0
    for z in [0.0, 0.3, 0.9, 1.0, 1.1, 1.5]:
        count+=1
        parms.append({ 
              'L'                         : 50,
              'MODEL'                     : 'spin',
              'local_S'                   : 0.5,
              'CONSERVED_QUANTUMNUMBERS'  : 'Sz_total',
              'Jxy'                         : 1,
              'Jz'                         : z,
          'INITIAL_STATE' : 'kink',
          'CHI_LIMIT' : 40,
          'TRUNC_LIMIT' : 1E-12,
          'NUM_THREADS' : 1,
          'TAUS' : [20.0],
          'POWS' : [0.0],
          'GS' : ['H'],
          'GIS' : [0.0],
          'GFS' : [0.0],
          'NUMSTEPS' : [500],
          'STEPSFORSTORE' : [5],
          'SIMID': count
            })

Nótese que estamos simulando un rango de acoplamientos Jz. Luego escribimos los archivos de entrada, ejecutamos la simulación, y obtenemos la salida como de costumbre:

    baseName='tutorial_2d'
    nmlnameList=pyalps.writeTEBDfiles(parms, baseName)
    res=pyalps.runTEBD(nmlnameList)
    #Get magnetization data
    Magdata=pyalps.load.loadTimeEvolution( pyalps.getResultFiles(prefix='tutorial_2d'), measurements=['Local Magnetization'])

A partir de los datos de magnetización calculados, calculamos la magnetización integrada tal como se definió arriba:

    #Compute the integrated magnetization across the center
    for q in Magdata:
        syssize=q[0].props['L']
        #Compute the integrated flow of magnetization through the center \Delta M=\sum_{n>L/2}^{L} (<S_n^z(t)>+1/2)
        #\Delta M= L/4
        loc=0.5*(syssize/2)
        #\Delta M-=<S_n^z(t)> from n=L/2 to L
        q[0].y=[0.5*(syssize/2)+sum(q[0].y[syssize/2:syssize])]

Finalmente, graficamos la magnetización integrada para el rango de acoplamientos Jz simulados.

    #Plot the integrated magnetization
    Mag=pyalps.collectXY(Magdata, x='Time', y='Local Magnetization', foreach=['Jz'])
    plt.figure()
    pyalps.plot.plot(Mag)
    plt.xlabel('Time $t$')
    plt.ylabel('Integrated Magnetization $\Delta M(t)$')
    plt.title('Integrated Magnetization vs. Time')
    plt.legend(loc='upper left')
    plt.show()

Vemos que para Jz$\lt 1$ la magnetización integrada aumenta aproximadamente de forma lineal en el tiempo, por lo que el transporte de magnetización es balístico como en el caso XX. Para Jz alrededor de 1, vemos un cambio en el comportamiento cualitativo hacia uno en el que la magnetización integrada eventualmente se satura.

#### Preguntas

- El punto Jz=1, donde el comportamiento de la magnetización integrada experimenta un cambio cualitativo distintivo, es el punto en el que el modelo XXZ transiciona de una fase crítica a la fase antiferromagnética. Sin embargo, esta transición de fase es a priori un fenómeno de baja energía, que afecta al estado fundamental. ¿Puede deducir cómo este cambio de baja energía afecta a las propiedades dinámicas de nuestro estado inicial de alta energía?
