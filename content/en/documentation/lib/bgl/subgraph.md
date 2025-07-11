
---
title: Sub Graph Embedding
description: "BGL Extension Graph"
weight: 2
---

## Manual

### Introduction

The embedding algorithm provides functionality to

- find all embeddings of a subgraph into a graph.
- find all embeddings of a subgraph into a graph if a vertex of the subgraph and a vertex of the graph are matched.

### Concepts, Requirements and Limitations

The subgraph must model the following concepts: `VertexListGraph` and `AdjacencyGraph`. The graph must model the concepts `VertexListGraph`, `AdjacencyGraph` and `AdjacendyMatrix`.

Only undirected graphs are supported. Any coloring is ignored.

## Types and Functions

The used property map must model LvaluePropertyMap with the vertex descriptor of the subgraphs as key type and the vertex descriptor of the graph as value type. The property map ist passed by reference. Each embedding will overwrite the previous one. For each embedding, the property map contains a mapping for each vertex descriptor of the subgraph to a vertex descriptor of the graph.

The returned iterator `embedding_iterator` models the `ForwardIterator` concept with the associated types:

- Value type: Reference to the property map type.
- Distance type: `std::ptrdiff_t`

### Synopsis

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


## Examples

### Generating a square lattice

This example does not directly depend on the embedding algorihm, but the sub graph embedding algorithm requires a graph to embedd the subgraphs. In the following examples we need the function below to create a square lattice, to embed the subgraphs.


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

### Use the Sub Graph Embedder

The embedding has two functionalities:

- we can glue two vertices together and find all embeddings of a subgraph into the graph where the glued vertices are fixed
- we can find all embeddings of the subgrahs into the graph, filtered, so that every embedding that uses a specific set of vertex descriptor of the graph appears only once.

This example demonstrates both functionalities: We embed a four-vertex ring into a twelve by twelve square lattice.


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

This example produces the following output:

    Number of embeddings: 144
    Number of embeddings with 0 and 0 glued together: 8

A twelve by twelve lattice has 144 plaquettes, so there are 144 possibilitis to embed a four-vertex ring in this lattice.

A square lattice has four adjacent plaquettes. For each plaquette there are two posibilities to embed a four-vertex ring if the vertex 0 is fixed:

    0 - 1       0 - 2
    |   |  and  |   |
    2 - 3       1 - 3

### List all graphs with their Embeddings

We can ask how many graphs are embeddable in a square lattice and how many embeddings exist for all graphs of a fixed size. The following example answers this question by generating all graphs with a fixed number of edges and test if they are embeddable into a square lattice and count the number of embeddings (see the previous example).


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

The example produces the following table:

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
