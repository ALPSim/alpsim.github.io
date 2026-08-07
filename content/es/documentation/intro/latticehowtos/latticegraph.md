
---
title: Redes y Grafos
toc: true
weight: 4
---

En la simulación de modelos de red, generalmente se considera un modelo definido sobre una red infinita o finita. Aquí explicamos cómo especificar ambas en formato XML.

## Un grafo simple

Los grafos en la mayoría de las simulaciones de física no son grafos irregulares, sino que se construyen de forma regular, como una red

![El primer grafo simple.](../figs/tutoriallatticehowtolatticegraph1.gif)

Podemos capturar la regularidad de este grafo colocándolo sobre una red:

![El grafo sobre una red.](../figs/tutoriallatticehowtolatticegraph2.gif)

Esta red puede describirse mediante una celda unitaria, y el grafo se construye a partir de un "grafo de celda unitaria" sobre la celda unitaria:

![Grafo de celda unitaria.](../figs/tutoriallatticehowtolatticegraph3.gif)

El "grafo de celda unitaria" consiste en un único vértice, y hay una arista hacia el mismo vértice en la celda vecina. Podemos describir un grafo de este tipo sobre una red en XML, combinando un LATTICE o FINITELATTICE con un elemento UNITCELL que describe el grafo sobre la celda unitaria a partir del cual se crea el grafo completo:

    <LATTICEGRAPH>
        <FINITELATTICE>
        <LATTICE dimension="1"/>
            <EXTENT size="6"/>
            <BOUNDARY type="open"/>
        </LATTICE>
        </FINITELATTICE>
        <UNITCELL dimension="1" vertices="1">
        <VERTEX/>
        <EDGE>
            <SOURCE vertex="1"/>
            <TARGET vertex="1" offset="1"/>
        </EDGE>
        </UNITCELL>
    </LATTICEGRAPH>
  
La arista en la celda unitaria va del vértice 1 en la celda al vértice 1 en la celda de la derecha (con un desplazamiento +1), como se describe en el elemento EDGE. El desplazamiento de 0 en el elemento SOURCE se omitió, ya que 0 es el valor predeterminado para el desplazamiento.

Para describir una cadena infinita usaríamos un elemento LATTICE en lugar del FINITELATTICE.

## Un ejemplo complejo

Podemos describir nuevamente grafos con aristas y vértices coloreados, o agregar otros atributos como coordenadas a los vértices. Además, para la descripción de la red está disponible toda la maquinaria descrita para la red. Mostraremos un ejemplo de un grafo periódico complejo en una red rectangular L x W:

![Un grafo periódico complejo en una red.](../figs/tutoriallatticehowtolatticegraph4.jpg)

Este grafo sobre una red puede construirse a partir de este grafo de celda unitaria complejo que decora la red rectangular:

![Un grafo complejo en una celda unitaria.](../figs/tutoriallatticehowtolatticegraph5.jpg)

La descripción en XML es:

    <LATTICE name="square" dimension="2">
        <BASIS>
        <VECTOR> 1 0 </VECTOR>
        <VECTOR> 0 1 </VECTOR>
        </BASIS>
    </LATTICE>
    <FINITELATTICE name="rectangular periodic" dimension="2">
        <LATTICE ref="square"/>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W,L"/>
        <BOUNDARY type="periodic"/>
    </FINITELATTICE>
    <UNITCELL name="complex example" dimension="2" vertices="2">
        <VERTEX id="1" type="0"><COORDINATE> 0.3 0.7 </COORDINATE></VERTEX>
        <VERTEX id="2" type="1"><COORDINATE> 0.6 0.3 </COORDINATE></VERTEX>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="1 0"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 1"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="2"/></EDGE>
    </UNITCELL>
    <LATTICEGRAPH>
        <FINITELATTICE ref="rectangular periodic"/>
        <UNITCELL ref="complex example"/>
    </LATTICEGRAPH>
    
Aquí hicimos uso de la predefinición de redes y celdas unitarias con nombre (por ejemplo, en una biblioteca), que luego podemos combinar referenciándolas en el elemento LATTICEGRAPH. Alternativamente, podríamos haber definido todo dentro del elemento LATTICEGRAPH:

    <LATTICEGRAPH>
        <FINITELATTICE dimension="2">
        <LATTICE dimension="2">
            <BASIS>
            <VECTOR> 1 0 </VECTOR>
            <VECTOR> 0 1 </VECTOR>
            </BASIS>
        <EXTENT dimension="1" size="L"/>
        <EXTENT dimension="2" size="W,L"/>
        <BOUNDARY type="periodic"/>
        </FINITELATTICE>
        <UNITCELL dimension="2" vertices="2">
        <VERTEX id="1" type="0"><COORDINATE> 0.3 0.7 </COORDINATE></VERTEX>
        <VERTEX id="2" type="1"><COORDINATE> 0.6 0.3 </COORDINATE></VERTEX>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="1 0"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="1" offset="0 1"/></EDGE>
        <EDGE><SOURCE vertex="1"/><TARGET vertex="2"/></EDGE>
        </UNITCELL>
    </LATTICEGRAPH>
  
Dado que se dan tanto las coordenadas de los vértices en la celda unitaria como los vectores de base de la red, se pueden calcular las coordenadas de todos los vértices.

  
