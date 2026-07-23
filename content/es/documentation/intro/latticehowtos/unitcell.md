
---
title: Redes y Celdas Unitarias
toc: true
weight: 3
---

En la simulación de modelos de red, generalmente se considera un modelo definido sobre una red infinita o finita. Aquí explicamos cómo especificar ambas en formato XML.

## Redes Infinitas

Las redes se crean replicando una celda unitaria mediante traslación por múltiplos enteros de los vectores básicos de la red, como se muestra aquí en dos dimensiones:

![Red infinita con celda unitaria.](../figs/tutoriallatticehowtolattice1.gif)

Dicha red se describe mediante un nombre (opcional) y la dimensionalidad. Además, podemos especificar las coordenadas cartesianas de los vectores de base de la red. Para la red anterior esto sería:

    <LATTICE name="2D" dimension="2">
    <BASIS>
        <VECTOR>   1 0 </VECTOR>
        <VECTOR> 0.5 1 </VECTOR>
    </BASIS>
    </LATTICE>

Los vectores de base también pueden especificarse de forma simbólica y parametrizada, tal como:

    <LATTICE name="2D" dimension="2">
    <PARAMETER name="a" default="1"/>
    <PARAMETER name="b" default="1"/>
    <PARAMETER name="phi" default="Pi/2"/>
    <BASIS>
        <VECTOR>   a 0 </VECTOR>
        <VECTOR> b*sin(phi) b*cos(phi) </VECTOR>
    </BASIS>
    </LATTICE>

## Redes finitas

### Extensión finita

La mayoría (pero no todas) las simulaciones por computadora no trabajan sobre la red infinita presentada anteriormente, sino sobre una parte finita de la red. Hay muchas formas en que se puede definir una red finita de este tipo. Cualquier subconjunto finito de una red es una red finita, las posibilidades son infinitas. Para empezar, definimos la red de extensión finita más extendida, donde una celda se traslada como máximo un número finito de veces en cualquier dirección, por ejemplo, una red cuadrada, rectangular, cúbica o hipercúbica, donde especificamos la extensión en cualquiera de las dimensiones.

![Una red finita](../figs/tutoriallatticehowtolattice2.gif)

Para crear una red finita se define

    <FINITELATTICE name="5x3">
    <LATTICE name="2D" dimension="2"/>
    <EXTENT dimension="1" size="5"/>
    <EXTENT dimension="2" size="3"/>
    </FINITELATTICE>

Si se omite el atributo dimension, se asume que la extensión se aplica a todas las dimensiones, por ejemplo, una red cúbica de tamaño lineal 4 sería:

    <FINITELATTICE>
    <LATTICE dimension="3"/>
    <EXTENT size="4"/>
    </FINITELATTICE>

No todas las dimensiones necesitan ser finitas, y una franja infinita de ancho dos puede especificarse como

![Una red mixta con dimensiones finitas e infinitas](../figs/tutoriallatticehowtolattice3.gif)

    <FINITELATTICE name="strip">
    <LATTICE name="2D" dimension="2"/>
    <EXTENT dimension="2" size="2"/>
    </FINITELATTICE>

En muchas aplicaciones la extensión exacta no es constante, sino un parámetro de entrada especificado por el usuario. Nuevamente podemos usar un elemento `<PARAMETER>` para especificar la extensión. Para una franja L x 2 esto es:

    <FINITELATTICE>
    <LATTICE name="2D" dimension="2"/>
    <PARAMETER name="L"/>
    <EXTENT dimension="1" size="L"/>
    <EXTENT dimension="2" size="2"/>
    </FINITELATTICE>

Si queremos tener una franja de tamaño L x W, con un valor predeterminado de 2 para el ancho en caso de que W no se especifique, proporcionamos tanto un atributo size como un atributo parameter:

    <FINITELATTICE>
    <LATTICE name="2D" dimension="2"/>
    <PARAMETER name="L" />
    <PARAMETER name="W" default="2" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    </FINITELATTICE>

Finalmente, es común considerar una red cuadrada (o cúbica) con la misma extensión L en todas las dimensiones, a menos que específicamente proporcionemos otras dimensiones (por ejemplo, W para el ancho o H para la altura). Esto puede describirse como:

    <FINITELATTICE>
    <LATTICE name="3D" dimension="3"/>
    <PARAMETER name="L" />
    <PARAMETER name="W" default="L" />    
    <PARAMETER name="H" default="W" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <EXTENT dimension="3" size="H" />
    </FINITELATTICE>

El primer parámetro definido especifica la dimensión. Así, si el usuario solo especifica L, obtenemos un cubo LxLxL; si se especifican L y W, un bloque LxWxW. Si se especifican L y H obtenemos un bloque LxLxH, y si se definen todos L, W y H obtenemos un bloque LxWxH.

## Condiciones de frontera

Para redes finitas, además de la extensión, es necesario especificar las condiciones de frontera. Las condiciones de frontera más utilizadas son:

- open (abierta): la red tiene bordes abiertos, y las celdas de frontera no tienen ningún vecino en uno o más lados
- periodic (periódica): se asume que la red es periódica, es decir, al salir de la red por un lado, se vuelve a entrar en la red por el lado opuesto. El vecino derecho de la celda más a la derecha es la celda más a la izquierda, y el vecino superior de la celda más alta es la celda más baja. Para una red bidimensional esto se ve como un toro.

Para estos dos tipos de condiciones de frontera hemos definido un elemento `<BOUNDARY>`, con un atributo type que puede tomar cualquiera de estos valores. Por ejemplo, para una red cuadrada periódica LxL:

    <FINITELATTICE>
    <LATTICE name="2D" dimension="2"/>
    <EXTENT size="L" />
    <BOUNDARY type="periodic" />
    </FINITELATTICE>

O para una franja que es periódica en la dirección larga y abierta en la dirección corta:

    <FINITELATTICE name="strip">
    <LATTICE name="strip" dimension="2"/>
    <PARAMETER name="W" default="2" />
    <EXTENT dimension=1 size="L" />
    <EXTENT dimension=2 size="W" />
    <BOUNDARY dimension="1" type="periodic" />
    <BOUNDARY dimension="2" type="open" />
    </FINITELATTICE>

Alternativamente, si la condición de frontera debe definirse en tiempo de ejecución, nuevamente se puede especificar un elemento `<PARAMETER>` para indicar el nombre del parámetro que determinará la condición de frontera y opcionalmente proporcionar un valor predeterminado:

    <FINITELATTICE>
    <LATTICE name="cube" dimension="3"/>
    <PARAMETER name="BC" default="periodic" />
    <EXTENT size="L" />
    <BOUNDARY type="BC" />
    </FINITELATTICE>

Esto especificará una red cúbica con condiciones de frontera dadas por el parámetro "BC", y condiciones de frontera periódicas como valor predeterminado. [edit] Referenciar redes
En lugar de definir una red cada vez, también podemos referenciar una red definida previamente. Por ejemplo, en lugar de definir

    <FINITELATTICE name = "finite tilted 2D">
    <LATTICE name="tilted 2D" dimension="2">
        <BASIS>
        <VECTOR>   1 0 </VECTOR>
        <VECTOR> 0.5 1 </VECTOR>
        </BASIS>
    </LATTICE>
    <PARAMETER name="BC" default="periodic" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <BOUNDARY type="BC" />
    </FINITELATTICE>

Podemos primero definir la red infinita:

    <LATTICE name="tilted 2D" dimension="2"
    <BASIS>
        <VECTOR>   1  0 </VECTOR>
        <VECTOR> 0.5, 1 </VECTOR>
    </BASIS>
    </LATTICE>

Y luego, cada vez que definamos una subred finita, referenciar esta red usando un atributo ref en el elemento lattice en lugar de repetir la definición:

    <FINITELATTICE name = "finite tilted 2D">
    <LATTICE ref="tilted 2D">
    <PARAMETER name="BC" default="periodic" />
    <EXTENT dimension="1" size="L" />
    <EXTENT dimension="2" size="W" />
    <BOUNDARY type="BC" />
    </FINITELATTICE>


