
---
title: Grafo Comparable
description: "Grafo de la Extensión BGL"
weight: 1
---

## Manual

### Introducción

La plantilla de clase `nisy` es un adaptador de grafos. Proporciona funcionalidades para

- comparar grafos por igualdad y define una relación de orden en un conjunto de grafos.
- encontrar isomorfismos entre grafos.
- encontrar el grupo de automorfismos de un grafo, incluyendo la órbita.
- generar una etiqueta canónica.
- ordenar un conjunto de grafos / realizar búsqueda binaria en un conjunto de grafos

### Etiqueta Canónica

Una etiqueta canónica C es un etiquetado / ordenamiento (especial) de los vértices. Las etiquetas canónicas C(G) y C(H) de dos grafos G y H son equivalentes si y solo si G y H son isomorfos. La plantilla de clase nisy implementa la etiqueta canónica como la matriz de adyacencia mínima que resulta de permutar todos los vértices. Para hacer estas matrices comparables, se interpretan como un número binario de n x n bits al concatenar todas las filas.

*Ejemplo*

Consideremos los dos grafos

    A - B       A   B
    | / |       | X |
    C - D       C - D

y calculemos la partición que contiene el ordenamiento de las respectivas etiquetas canónicas. Una partición es un conjunto de conjuntos que contiene cada descriptor de vértice exactamente una vez.

    {( A )( D )( B )( C )}
    {( A )( B )( C )( D )}

Si ordenamos los grafos según el orden de la partición canónica, es fácil ver que son isomorfos.

    A   D       A   B
    | X |       | X |
    B - C       C - D

Ahora también podemos encontrar el isomorfismo entre los dos grafos:

    (A->A) (B->C) (C->D) (D->B)

### Grupo de Automorfismos y Órbita

El grupo de automorfismos induce una partición especial en el grafo original: la partición de órbitas. Cada celda de la partición de órbitas contiene una órbita del grupo de automorfismos del grafo original.

*Ejemplo*

Consideremos el siguiente grafo:

    A - B
    | / |
    C - D
La partición de órbitas de este grafo es

    {(A, D), (B, C)}.
    
Esto significa que se puede intercambiar A y D, o B y C, y el grafo resultante es isomorfo al original (véase el ejemplo).

### Evaluación Perezosa y Almacenamiento en Caché

El cálculo de la etiqueta canónica es bastante costoso. Por lo tanto, solo se realiza cuando es necesario. La etiqueta canónica y la órbita se almacenan en caché. Si el grafo original se muta, la etiqueta canónica y la órbita cambian. Esto significa que, si el grafo original se muta, la caché del `nisy` debe limpiarse. Esto puede hacerse con la función `clear_cache`.

### Partición de Coloreado

Si los vértices del grafo original están coloreados, el coloreado debe traducirse a una partición de coloreado. La partición de coloreado debe satisfacer la siguiente condición: dos vértices tienen el mismo color si y solo si están en la misma celda de la partición de coloreado (véase el ejemplo a continuación).

### Conceptos, Requisitos y Limitaciones

`nisy` deriva públicamente del grafo original. Modela cualquier concepto modelado por el grafo original. El adaptador solo toma una referencia al grafo original, no una copia.

El grafo original debe modelar los conceptos `VertexListGraph` y `AdjacencyGraph`.

El adaptador de grafo `nisy` solo admite grafos no dirigidos sin ningún coloreado de aristas.

### El Algoritmo

`nisy` determina la etiqueta canónica basándose en el algoritmo Nauty descrito por Brendan McKay en B. D. McKay, Practical graph isomorphism, 10th. Manitoba Conference on Numerical Mathematics and Computing (Winnipeg, 1980); Congressus Numerantium, 30 (1981) 45-87.

## Tipos y Funciones

La funcionalidad soportada por `nisy` depende del tipo de Graph subyacente. La plantilla de clase `nisy` deriva públicamente de `Graph`, por lo que todos los tipos y funciones miembro se heredan.

### Sinopsis

    template <
        class graph_type 
        , class vertex_color_type = void
        , class edge_color_type = void
    > class nisy {
        public:
            typedef typename std::list<std::list<vertex_descriptor_type> > partition_type;
            typedef typename partition_type::iterator partition_iterator_type;
            typedef typename /*implementation-defined*/ canonical_label_type; // LessThanComparable
            typedef typename /*implementation-defined*/ canonical_ordering_iterator; // ForwardIterator
            nisy(
                graph_type const & graph
            ); // only use iif(vertex_color_type == void and edge_color_type == void)
            template <
                class color_property_map_type
            > nisy(
                graph_type const & graph
                , vertex_color_property_map_type vertex_property
            ); // only use iif(vertex_color_type != void and edge_color_type == void)
            template <
                class color_property_map_type
            > nisy(
                graph_type const & graph
                , edge_color_property_map_type edge_property
            ); // only use iif(vertex_color_type == void and edge_color_type != void)
            template <
                class vertex_color_property_map_type
                , class edge_color_property_map_type
            > nisy(
                graph_type const & graph
                , vertex_color_property_map_type vertex_property
                , edge_color_property_map_type edge_property
            ); // only use iif(vertex_color_type != void and edge_color_type != void)
            virtual ~nisy();
            inline void invalidate();
            inline std::pair<canonical_ordering_iterator, canonical_ordering_iterator> get_canonical_ordering() const;
            inline canonical_label_type const & get_canonical_label() const;
            inline partition_type const & get_orbit_partition() const;
            template<class graph_type1> inline bool operator==(nisy<graph_type1, vertex_color_type, edge_color_type> const & T) const;
            template<class graph_type1> inline bool operator!=(nisy<graph_type1, vertex_color_type, edge_color_type> const & T) const;
        };

        template<
            class graph_type1
            , class graph_type2
            , class vertex_coloring_type1
            , class vertex_coloring_type2
            , class edge_coloring_type1
            , class edge_coloring_type2
        > inline std::map<
            typename boost::graph_traits<graph_type1>::vertex_descriptor
            , typename boost::graph_traits<graph_type2>::vertex_descriptor
        > isomorphism(
            nisy<graph_type1, vertex_coloring_type1, edge_coloring_type1> const & T1
            , nisy<graph_type2, vertex_coloring_type2, edge_coloring_type2> const & T2
        );  


## Ejemplos

### Ejemplo Simple

Como primer ejemplo, tomamos dos grafos sin colorear con 4 vértices y 5 aristas. Comprobamos si los dos grafos son isomorfos y, si lo son, calculamos la etiqueta canónica y la partición de órbitas de los dos grafos. Una partición de órbitas contiene todos los vértices "estructuralmente idénticos". Esto significa que podemos permutar los vértices que se encuentran en la misma órbita sin cambiar la etiqueta canónica, y de esta manera generar grafos isomorfos. Al final generamos el isomorfismo explícito entre los dos grafos.

[cg_simple]

La salida muestra que los dos grafos son isomorfos. En este ejemplo simple, podemos construir el isomorfismo a mano. Los vértices con valencia dos y los vértices con valencia tres deben corresponderse entre sí.

    The two graphs are isomorphic.

    Canonical partiton and orbit partition of G
    0 3 1 2 
    {( 1 2 )( 0 3 )}

    Canonical partition and orbit partition of H
    0 1 2 3 
    {( 0 1 )( 2 3 )}

    Isomorphism G => H
    (0->0) (1->2) (2->3) (3->1) 

### Ejemplo de Partición de Coloreado

Veamos el mismo ejemplo anterior, pero esta vez con vértices coloreados:


    // file: coloring.cpp
    #include "../src/nisy.hpp"
    #include <boost/graph/adjacency_list.hpp>
    #include <boost/property_map.hpp>
    #include <iostream>

    typedef boost::adjacency_list<
        boost::vecS, boost::vecS, boost::undirectedS
    > graph_type;

    typedef std::map<
        boost::graph_traits<graph_type>::vertex_descriptor
        , int
    > map_type;
    typedef boost::associative_property_map<map_type> property_map_type;
    enum { A, B, C, D, N };

    typedef nisy<graph_type>::cell_type cell_type;
    typedef nisy<graph_type>::partition_type partition_type;

    // Write a ordering to cout
    template<class ordering_iterator> void dump_ordering(std::pair<ordering_iterator, ordering_iterator> const & P) {
        std::cout << "{";
        for (ordering_iterator it = P.first; it != P.second; ++it)
            std::cout << " " << *it;
        std::cout << " }" << std::endl;
    }

    // Write a partition to cout
    template<class partition_type> void dump_partition(partition_type const & P) {
        std::cout << "{";
        typename partition_type::const_iterator it1;
        typename partition_type::value_type::const_iterator it2;
        for (it1 = P.begin(); it1 != P.end(); ++it1) {
            std::cout << "(";
            for (it2 = it1->begin(); it2 != it1->end(); ++it2)
                std::cout << " " << *it2;
            std::cout << " )";
        }
        std::cout << "}" << std::endl;
    }

    int main() {

        // create the original graphs
        graph_type g(N), h(N);
    /*
        A - B       A   B
        | / |  vs.  | X |
        C - D       C - D
    */  
    add_edge(A, B, g);
    add_edge(A, C, g);
    add_edge(B, C, g);
    add_edge(B, D, g);
    add_edge(C, D, g);

    add_edge(A, C, h);
    add_edge(A, D, h);
    add_edge(B, C, h);
    add_edge(B, D, h);
    add_edge(C, D, h);

    // create coloring
    map_type map_g, map_h;
    property_map_type pmap_g(map_g), pmap_h(map_h);
  
    // create coloring of g
    boost::put(pmap_g, static_cast<int>(A), 0);
    boost::put(pmap_g, static_cast<int>(B), 0);
    boost::put(pmap_g, static_cast<int>(C), 1);
    boost::put(pmap_g, static_cast<int>(D), 1);

    // create coloring of h
    boost::put(pmap_h, static_cast<int>(A), 0);
    boost::put(pmap_h, static_cast<int>(B), 1);
    boost::put(pmap_h, static_cast<int>(C), 0);
    boost::put(pmap_h, static_cast<int>(D), 1);
  
    // create comparable adaptors
    nisy<graph_type, int> cg(g, pmap_g), ch(h, pmap_h);

    // check if the graphs g and h are isomorphic
    if (cg == ch)
        std::cout << "The two graphs are isomorphic." << std::endl;
    else
        std::cout << "The two graphs are not isomorphic." << std::endl;

    // dump canonical partiton and arbit of g
    std::cout << std::endl;
    std::cout << "Canonical partiton and orbit partition of G" << std::endl;
    dump_ordering(cg.get_canonical_ordering());
    dump_partition(cg.get_orbit_partition());
  
    // dump canonical partition and arbit of h
    std::cout << std::endl;
    std::cout << "Canonical partition and orbit partition of H" << std::endl;
    dump_ordering(ch.get_canonical_ordering());
    dump_partition(ch.get_orbit_partition());

    // compute the isomprphism between the two grphas
    typedef std::map<
        boost::graph_traits<graph_type>::vertex_descriptor, 
        boost::graph_traits<graph_type>::vertex_descriptor 
    > isomorphism_type;
    isomorphism_type iso(isomorphism(cg, ch));

    // write the isomprphism to cout
    std::cout << std::endl << "Isomorphism G => H" << std::endl;
    for (isomorphism_type::iterator it = iso.begin(); it != iso.end(); ++it)
        std::cout << "(" << it->first << "->" << it->second << ") ";
    std::cout << std::endl;

    return EXIT_SUCCESS;
    }

Los grafos ya no son isomorfos:

    The two graphs are not isomorphic.

    Canonical partiton and orbit partition of G
    { 0 1 3 2 }
    {( 0 )( 1 )( 2 )( 3 )}

    Canonical partition and orbit partition of H
    { 0 2 1 3 }
    {( 0 )( 1 )( 2 )( 3 )}

    Isomorphism G => H
    (0->0) (1->2) (2->3) (3->1)

### Generación de Grafos No Isomorfos

Un ejemplo más avanzado crea todos los grafos hasta un número dado de aristas y cuenta el número de grafos no isomorfos con un número específico de aristas.

Primero creamos una pequeña plantilla de clase para generar todos los grafos con un número dado de vértices.

Esta plantilla de clase toma todos los grafos con una arista menos que las solicitadas e intenta añadir vértices y aristas en todos los lugares posibles. Para cada nuevo grafo, se calcula la etiqueta canónica. Si la etiqueta no está disponible en la lista, el grafo se conserva; en caso contrario, se descarta. El `std::set` permite realizar una búsqueda binaria sobre todos los grafos verificados.


    // file: nisy.generator.hpp
    #ifndef NISY_GENERATOR_HPP
    #define NISY_GENERATOR_HPP

    #include "../src/nisy.hpp"

    template <class graph_type> class graph_generator {
        typedef typename boost::graph_traits<
            graph_type
        >::vertex_iterator vertex_iterator;  
        public:
            // Iterator over all graphs with given #edges
                typedef typename std::vector<graph_type>::const_iterator iterator;
            // Defaultconstructor
            graph_generator()
                : graphs_(1, std::vector<graph_type>(1, graph_type()))
            {
                add_vertex(graphs_[0][0]);
            }
            // generates all graphs with edge_size edges
            std::pair<iterator, iterator> generate(
                std::size_t edge_size
            ) {
                graph_type *graph, new_graph;
                typename std::vector<graph_type>::iterator it;
                vertex_iterator it1, end1, it2, end2;
                // construct all grophs with N edges from the Graphs with N-1 edges
                while (graphs_.size() <= edge_size) {
                    graphs_.push_back(std::vector<graph_type>());
                    it = (graphs_.end() - 2)->begin(); 
                    while ((graph=(it==(graphs_.end()-2)->end()?NULL:&(*it++)))!=NULL)
                        for (tie(it1, end1) = vertices(*graph); it1 != end1; ++it1) {
                            new_graph = graph_type(*graph);
                            add_edge(*it1, add_vertex(new_graph), new_graph);
                            check_graph(new_graph);
                            for (tie(it2, end2) = vertices(*graph); it2 != end2; ++it2)
                                if (*it1 < *it2 && !edge(*it1, *it2, *graph).second) {
                                    new_graph = graph_type(*graph);
                                    add_edge(*it1, *it2, new_graph);
                                        check_graph(new_graph);
                            }
                        }
                    }
                    return std::make_pair(
                        graphs_[edge_size].begin(), graphs_[edge_size].end()
                    );
                }
            private:
                void check_graph(graph_type const & graph) {
                    // create comparable adapter
                    nisy<graph_type> com_graph(graph);
                    // check if the label has alredy been found
                    if (labels_.find(make_tuple(com_graph.get_canonical_label().size(), com_graph.get_canonical_label())) == labels_.end()) {
                        labels_.insert(make_tuple(com_graph.get_canonical_label().size(), com_graph.get_canonical_label()));
                        graphs_.back().push_back(graph);
                    }
                }
                std::vector<std::vector<graph_type> > graphs_;
                // list of all lables already checked.
                std::set<boost::tuple<std::size_t, typename nisy<graph_type>::canonical_label_type> > labels_;
        };

        #endif // NISY_GENERATOR_HPP

Con la plantilla de clase anterior, solo necesitamos recorrer todos los números de aristas que necesitamos. Dado que los iteradores de std::vector son iteradores de acceso aleatorio (RandomAccess), podemos obtener el número de grafos restando el primero del que está justo después del último. Usamos `boost::timer` para medir el tiempo necesario en segundos.


    // file: nisy.generator.cpp
    #include "nisy.generator.hpp"

    #include <iostream>
    #include <iomanip>

    #include <boost/timer.hpp>
    #include <boost/tuple/tuple.hpp>
    #include <boost/graph/adjacency_list.hpp>

    #define MAX_GRAPH_SIZE 12
    typedef boost::adjacency_list<
        boost::vecS, boost::vecS, boost::undirectedS
    > graph_type;

    int main() {
        // construct generator
        graph_generator<graph_type> generator;
        graph_generator<graph_type>::iterator it, end;
        boost::timer timer;
        std::cout << "#edges #graphs time[s]" << std::endl;
        for (std::size_t i = 0; i <= MAX_GRAPH_SIZE; ++i) {
            // generate the graphs
            boost::tie(it, end) = generator.generate(i);
            // write the result to cout
            std::cout << std::setw(6) << i << " "
                << std::setw(7) << (end - it) << " " 
                << std::setw(7)
                << static_cast<std::size_t>(timer.elapsed()+.5) 
                << std::endl;
        }
        return EXIT_SUCCESS;    
    }

El ejemplo devuelve la siguiente tabla:

    #edges #graphs time[s]
        0       1       0
        1       1       0
        2       1       0
        3       3       0
        4       5       0
        5      12       0
        6      30       0
        7      79       0
        8     227       1
        9     710       3
        10    2323      12
        11    8073      51
        12   29511     232
