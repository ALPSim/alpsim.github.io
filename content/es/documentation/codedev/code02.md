
---
title: Code-02 C++
math: true
toc: true
weight: 3
---

Este tutorial muestra cómo escribir una simulación Monte Carlo en C++ usando la biblioteca alea de ALPS para la evaluación de observables. En un segundo paso escribiremos las mediciones en un formato de archivo HDF5 estándar, lo que nos permite usar herramientas del conjunto ALPS para análisis y graficado adicionales de los datos.

Como ejemplo sencillo, escribiremos una simulación del modelo de Ising clásico en 2D con actualizaciones locales. El archivo `ising-skeleton.cpp` contiene un código esqueleto que ya tiene toda la infraestructura que necesitaremos: primero incluye todas las cabeceras necesarias, luego inicializa un generador de números aleatorios y tres objetos `alps::RealObservable`. Después configura una red cuadrada de espines de Ising. También proporciona una tabla de probabilidades que puede usarse para las actualizaciones de Metropolis. La interfaz es la misma que en el script de Python que implementaste en el [tutorial](../../codedev/code01) anterior.

Tu tarea es de nuevo completar los métodos `step()` y `measure()`: `step()` debería elegir un espín aleatorio de la red e invertirlo con la probabilidad de Metropolis $p_{accept} = min(1,e^{-\beta \Delta E})$, donde $\Delta E$ es el cambio de energía que causaría la inversión del espín. `measure()` determina la energía y la magnetización de una configuración de espines y añade esta muestra a los objetos observable.

Después de reemplazar todas las elipsis con código, puedes compilar la simulación con este `Makefile`: guarda el `Makefile` en el mismo directorio que el archivo `.cpp`, edita la segunda línea para que apunte a tu instalación de ALPS (si aún no has definido la variable de entorno ALPS_ROOT) y escribe `make`. Esto producirá un ejecutable `ising`. Ejecútalo y verás un barrido sobre distintos valores de $\beta = 1/k_B T$.

Puedes reutilizar tu script de Python del cumulante de Binder del tutorial anterior exactamente de la misma manera:

    data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='ising.L*'),['m^2', 'm^4'])
    m2=pyalps.collectXY(data,x='BETA',y='m^2',foreach=['L'])
    m4=pyalps.collectXY(data,x='BETA',y='m^4',foreach=['L'])

    u=[]
    for i in range(len(m2)):
        d = pyalps.DataSet()
        d.propsylabel='U4'
        d.props = m2[i].props
        d.x= m2[i].x
        d.y = m4[i].y/m2[i].y/m2[i].y
        u.append(d)

y graficar el cumulante de Binder usando los comandos:

    plt.figure()
    pyalps.pyplot.plot(u)
    plt.xlabel('Inverse Temperature $\beta$')
    plt.ylabel('Binder Cumulant U4 $g$')
    plt.title('2D Ising model')
    plt.show()
