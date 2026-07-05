
---
title: Grafos Simples
toc: true
weight: 2
---

Aquí describimos la representación de grafos simples en formato XML. Para estos grafos, todos los sitios y enlaces se especifican explícitamente en formato XML.

## Grafos simples

Nuestro primer grafo será el siguiente grafo simple con cinco vértices y cinco aristas:

![El primer grafo simple.](../figs/tutoriallatticehowtograph1.gif)

Este grafo se especifica en XML de la siguiente manera, donde el atributo edges del elemento `<GRAPH>` es opcional, ya que el número de aristas puede obtenerse contando el número de elementos `<EDGE>`:

    <GRAPH vertices="5" edges="5">
    <EDGE source="1" target="2"/>
    <EDGE source="2" target="3"/>
    <EDGE source="1" target="4"/>
    <EDGE source="2" target="5"/>
    <EDGE source="4" target="5"/>
    </GRAPH>

## Grafos coloreados

También se pueden representar grafos con aristas y vértices coloreados:

![Un grafo con aristas y vértices coloreados.](../figs/tutoriallatticehowtograph2.jpg)

Representamos este grafo en XML introduciendo elementos `<VERTEX>` adicionales para describir los vértices, y atributos type para vértices y aristas para especificar su tipo (color). Los tipos de vértice 0, 1 y 2 se refieren a los vértices rojo, verde y azul respectivamente, mientras que los tipos de arista 0 y 1 se refieren a las líneas sólidas y discontinuas en nuestro ejemplo:

    <GRAPH vertices="5" edges="5">
    <VERTEX id="1" type="0"/>
    <VERTEX id="2" type="1"/>
    <VERTEX id="3" type="0"/>
    <VERTEX id="4" type="2"/>
    <VERTEX id="5" type="2"/>
    <EDGE source="1" target="2" type="0"/>
    <EDGE source="2" target="3" type="0"/>
    <EDGE source="1" target="4" type="1"/>
    <EDGE source="2" target="5" type="1"/>
    <EDGE source="4" target="5" type="0"/>
    </GRAPH>
    
En este ejemplo, los atributos vertices y edges son opcionales, ya que ambos pueden obtenerse contando el número respectivo de elementos `<VERTEX>` y `<EDGE>`.
El atributo id opcional del elemento `<VERTEX>` especifica el número de vértice. Si se omite, se asume una numeración consecutiva. El valor predeterminado del atributo type es 0. Por lo tanto, una versión más corta pero equivalente es:

    <GRAPH>
    <VERTEX/>
    <VERTEX type="1"/>
    <VERTEX/>
    <VERTEX type="2"/>
    <VERTEX type="2"/>
    <EDGE source="1" target="2"/>
    <EDGE source="2" target="3"/>
    <EDGE source="1" target="4" type="1"/>
    <EDGE source="2" target="5" type="1"/>
    <EDGE source="4" target="5"/>
    </GRAPH>
    
## Coordenadas

Use el elemento `<COORDINATE>` para especificar coordenadas espaciales de un vértice. Tomando el primer grafo anterior como ejemplo, las coordenadas pueden especificarse como:

    <GRAPH vertices="5" edges="5">
    <VERTEX id="1"> <COORDINATE> 1 1 </COORDINATE> </VERTEX>
    <VERTEX id="2"> <COORDINATE> 2 1 </COORDINATE> </VERTEX>
    <VERTEX id="3"> <COORDINATE> 3 1 </COORDINATE> </VERTEX>
    <VERTEX id="4"> <COORDINATE> 1 2 </COORDINATE> </VERTEX>
    <VERTEX id="5"> <COORDINATE> 2 2 </COORDINATE> </VERTEX>
    <EDGE source="1" target="2"/>
    <EDGE source="2" target="3"/>
    <EDGE source="1" target="4"/>
    <EDGE source="2" target="5"/>
    <EDGE source="2" target="3"/>
    </GRAPH>

En muchas simulaciones de física, el sistema vive en un grafo que corresponde a una red regular con una celda unitaria. Dentro del framework de ALPS, es posible definir un grafo de este tipo especificándolo en términos de la red y la celda unitaria subyacentes. Describiremos cómo hacerlo en los siguientes instructivos (HOWTOs).
