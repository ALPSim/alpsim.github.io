
---
title: Incrustación de Subgrafos
description: "Grafo de la Extensión BGL"
weight: 2
---

## Manual

### Introducción

El algoritmo de incrustación (embedding) proporciona funcionalidad para

- encontrar todas las incrustaciones de un subgrafo en un grafo.
- encontrar todas las incrustaciones de un subgrafo en un grafo cuando un vértice del subgrafo y un vértice del grafo están emparejados.

### Conceptos, Requisitos y Limitaciones

El subgrafo debe modelar los siguientes conceptos: `VertexListGraph` y `AdjacencyGraph`. El grafo debe modelar los conceptos `VertexListGraph`, `AdjacencyGraph` y `AdjacendyMatrix`.

Solo se admiten grafos no dirigidos. Cualquier coloreado se ignora.

## Tipos y Funciones

El mapa de propiedades utilizado debe modelar LvaluePropertyMap con el descriptor de vértice del subgrafo como tipo clave y el descriptor de vértice del grafo como tipo valor. El mapa de propiedades se pasa por referencia. Cada incrustación sobrescribirá la anterior. Para cada incrustación, el mapa de propiedades contiene una correspondencia de cada descriptor de vértice del subgrafo a un descriptor de vértice del grafo.

El iterador devuelto `embedding_iterator` modela el concepto `ForwardIterator` con los tipos asociados:

- Tipo de valor: referencia al tipo del mapa de propiedades.
- Tipo de distancia: `std::ptrdiff_t`

### Sinopsis

    template<
        class property_map_type
        , class subgraph_type
        , class graph_type
        , class subgraph_prop0_type = boost::no_property
        , class graph_prop0_type = boost::no_property
        , class subgraph_prop1_type = boost::no_property
        , class graph_prop1_type = boost::no_property
        , class subgraph_prop2_type = boost::no_property
        , class graph_prop2_type = boost::no_property
    > class embedding_iterator; // ForwardIterator with property_map_type const & operator*() const;

    template<
        class property_map_type 
        , class subgraph_type
        , class graph_type 
        , class subgraph_prop0_type
        , class graph_prop0_type
        , class subgraph_prop1_type
        , class graph_prop1_type
        , class subgraph_prop2_type
        , class graph_prop2_type
    > typename std::pair<
        embedding_iterator</*...*/>
    , embedding_iterator</*...*/>
    > embedding (
        property_map_type & property_map
        , subgraph_type const & subgraph
        , graph_type const & graph
        , subgraph_prop0_type const & subgraph_prop0
        , graph_prop0_type const & graph_prop0
        , subgraph_prop1_type const & subgraph_prop1
        , graph_prop1_type const & graph_prop1
        , subgraph_prop2_type const & subgraph_prop2
        , graph_prop2_type const & graph_prop2
    );

    template<
        class property_map_type 
        , class subgraph_type
        , class graph_type 
        , class subgraph_prop0_type
        , class graph_prop0_type
        , class subgraph_prop1_type
        , class graph_prop1_type
    > std::pair<
        embedding_iterator</*...*/>
        , embedding_iterator</*...*/>
    > embedding (
        property_map_type & property_map
        , subgraph_type const & subgraph
        , graph_type const & graph
        , subgraph_prop0_type const & subgraph_prop0
        , graph_prop0_type const & graph_prop0
        , subgraph_prop1_type const & subgraph_prop1
        , graph_prop1_type const & graph_prop1
    );

    template<
        class property_map_type 
        , class subgraph_type
        , class graph_type 
        , class subgraph_prop0_type
        , class graph_prop0_type
    > std::pair<
        embedding_iterator</*...*/>
        , embedding_iterator</*...*/>
    > embedding (
        property_map_type & property_map
        , subgraph_type const & subgraph
        , graph_type const & graph
        , subgraph_prop0_type const & subgraph_prop0
        , graph_prop0_type const & graph_prop0
    );

    template<
        class property_map_type 
        , class subgraph_type
        , class graph_type 
    > std::pair<
        embedding_iterator</*...*/>
        , embedding_iterator</*...*/>
    > embedding (
        property_map_type & property_map
        , subgraph_type const & subgraph
        , graph_type const & graph
    );


## Ejemplos

### Generación de una red cuadrada

Este ejemplo no depende directamente del algoritmo de incrustación, pero el algoritmo de incrustación de subgrafos requiere un grafo en el que incrustar los subgrafos. En los siguientes ejemplos necesitamos la función de abajo para crear una red cuadrada, en la que incrustar los subgrafos.


    // file: embedding.lattice.hpp
    #ifndef EMBEDDING_LATTICE_HPP
    #define EMBEDDING_LATTICE_HPP

    #include <boost/graph/adjacency_list.hpp>

    // create a sqare lattice of size L x L
    template <class graph_type> graph_type create_lattice(std::size_t L) {
        graph_type lattice(L * L);
        for (std::size_t i = 0; i < L; ++i)
            for (std::size_t j = 0; j < L; ++j) {
                add_edge(i * L + j, (i * L + j + 1) % (L * L), lattice);
                add_edge(i * L + j, ((i + 1) * L + j) % (L * L), lattice);
            }
        return lattice;
    }

    #endif // EMBEDDING_LATTICE_HPP

### Uso del Incrustador de Subgrafos

La incrustación tiene dos funcionalidades:

- podemos fusionar (glue) dos vértices y encontrar todas las incrustaciones de un subgrafo en el grafo donde los vértices fusionados están fijos
- podemos encontrar todas las incrustaciones de los subgrafos en el grafo, filtradas, de modo que cada incrustación que use un conjunto específico de descriptores de vértice del grafo aparezca solo una vez.

Este ejemplo demuestra ambas funcionalidades: incrustamos un anillo de cuatro vértices en una red cuadrada de doce por doce.


    // file: embedding.counter.hpp
    #ifndef EMBEDDING_COUNTER_HPP
    #define EMBEDDING_COUNTER_HPP

    #include "../src/embedding.hpp"

    #include <utility>
    #include <vector>
    #include <map>

    #include <boost/property_map.hpp>

    template <class subgraph_type, class graph_type> class embedding_counter
    {
        private:
            typedef std::map<
            typename boost::graph_traits<subgraph_type>::vertex_descriptor
            , typename boost::graph_traits<graph_type>::vertex_descriptor
            > map_type;
            typedef boost::associative_property_map<map_type> property_map_type;
        public:
            embedding_counter(
                subgraph_type const & subgraph
                , graph_type const & graph
            )
            : subgraph_(subgraph) 
                , graph_(graph) 
            {}
            inline std::size_t count() {
                embedding_iterator<
                    property_map_type
                    , subgraph_type
                    , graph_type
                > emb_it, emb_end; 
            map_type map_store;
            property_map_type mapping(map_store);
            std::size_t count_emb = 0;
            boost::tie(emb_it, emb_end) = embedding(
                mapping
                , subgraph_
                , graph_
            );
            for (; emb_it != emb_end; ++emb_it)
                ++count_emb;
            return count_emb;
            }
            inline std::size_t count(
                typename boost::graph_traits<graph_type>::vertex_descriptor graph_vertex
                , typename boost::graph_traits<subgraph_type>::vertex_descriptor subgraph_vertex
            ) {
                embedding_iterator<
                    property_map_type
                    , subgraph_type
                    , graph_type
                    , typename boost::graph_traits<subgraph_type>::vertex_descriptor
                    , typename boost::graph_traits<graph_type>::vertex_descriptor
                > emb_it, emb_end; 
                map_type map_store;
                property_map_type mapping(map_store);
                std::size_t count_emb = 0;
                boost::tie(emb_it, emb_end) = embedding(
                    mapping
                    , subgraph_
                    , graph_
                    , subgraph_vertex
                    , graph_vertex
                );
                for (; emb_it != emb_end; ++emb_it)
                    ++count_emb;
                return count_emb;      
            }
        private:
            template<typename it_type> inline std::size_t count_impl(
                std::pair<it_type, it_type> it_pair
                , std::size_t count_emb = 0
            ) {
                for (; it_pair.first != it_pair.second; ++it_pair.first)
                    ++count_emb;        
                return count_emb;
            }

            subgraph_type const & subgraph_;
            graph_type const & graph_;
    };

    #endif // embedding_COUNTER_HPP

Este ejemplo produce la siguiente salida:

    Number of embeddings: 144
    Number of embeddings with 0 and 0 glued together: 8

Una red de doce por doce tiene 144 plaquetas, por lo que hay 144 posibilidades de incrustar un anillo de cuatro vértices en esta red.

Una red cuadrada tiene cuatro plaquetas adyacentes. Para cada plaqueta hay dos posibilidades de incrustar un anillo de cuatro vértices si el vértice 0 está fijo:

    0 - 1       0 - 2
    |   |  and  |   |
    2 - 3       1 - 3

### Listar todos los grafos con sus Incrustaciones

Podemos preguntar cuántos grafos son incrustables en una red cuadrada y cuántas incrustaciones existen para todos los grafos de un tamaño fijo. El siguiente ejemplo responde a esta pregunta generando todos los grafos con un número fijo de aristas, comprobando si son incrustables en una red cuadrada y contando el número de incrustaciones (véase el ejemplo anterior).


    // file: embedding.lsit.cpp
    #include "embedding.counter.hpp"
    #include "nisy.generator.hpp"
    #include "embedding.lattice.hpp"

    #include <iostream>
    #include <iomanip>

    #include <boost/timer.hpp>
    #include <boost/tuple/tuple.hpp>
    #include <boost/graph/adjacency_list.hpp>

    #define MAX_GRAPH_SIZE 12
    #define LATTICE_SIZE 12
    typedef boost::adjacency_list<
        boost::vecS, boost::vecS, boost::undirectedS
    > graph_type;

    int main() {
        // generate lattice
        graph_type lattice = create_lattice<graph_type>(LATTICE_SIZE);
        // construct generator
        graph_generator<graph_type> generator;
        graph_generator<graph_type>::iterator it, end;
        boost::timer timer;
        std::cout << "#edges #graphs #embeddings time[s]" << std::endl;
        for (std::size_t i = 0; i <= MAX_GRAPH_SIZE; ++i) {
            // generate the graphs
            boost::tie(it, end) = generator.generate(i);
            std::size_t gr_cnt = 0, emb_cnt = 0;
            for(; it != end; it++) {
                // create an embedding counter
                std::size_t cnt = embedding_counter<
                    graph_type, graph_type
                >(*it, lattice).count(0, 0);
                emb_cnt += cnt;
                if (cnt)
                    ++gr_cnt;
            }
            // write the result to cout
            std::cout << std::setw(6) << i << " "
                    << std::setw(7) << gr_cnt << " " 
                    << std::setw(11) << emb_cnt  << " "
                    << std::setw(7) 
                    << static_cast<std::size_t>(timer.elapsed() + .5) 
                    << std::endl;
        }
        return EXIT_SUCCESS;
    }

El ejemplo produce la siguiente tabla:

    #edges #graphs #embeddings time[s]
        0       0           0       0
        1       1           4       0
        2       1          12       0
        3       2          60       0
        4       4         204       0
        5       6         900       0
        6      14        3676       0
        7      28       16204       0
        8      68       69508       1
        9     156      328900       3
        10     399     1491884      14
        11    1012     7164740      66
        12    2732    34242396     311
