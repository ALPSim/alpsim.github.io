
---
title: Comparable Graph
description: "BGL Extension Graph"
weight: 1
---

## Manual

### Introduction

The `nisy` class template is a graph adaptor. It provides functionalities to

- compare graphs to equality and it defines a ordering relation of a set of graphs.
- find isomorphisms between graphs.
- find the automorphism group of a graph, including the orbit.
- generate a canonical label.
- sort a set of graphs / do binary search in a set of graphs

### Canonical Label

A canonical label C is a (special) labeling / ordering of the vertices. The canonical labels C(G) and C(H) of two graphs G and H are equivalent if and only if G and H are isomorphic. The nisy class template implements the canonical label as the minimal adjacency matrix, which results if all vertices are permuted. To make these matrices comparable, they are interpreted as n x n-bit binary number by concatenating all rows.

*Example*

We consider the two graphs

    A - B       A   B
    | / |       | X |
    C - D       C - D

and compute the partition containing the ordering of the respective canonical labels. A partiton is a set of sets which contains each vertex descriptor exactly once.

    {( A )( D )( B )( C )}
    {( A )( B )( C )( D )}

If we order the graphs in the order of the canonical partition, it is easy to see, that they are isomorphic.

    A   D       A   B
    | X |       | X |
    B - C       C - D

Now, we can also find the isomorphism between the two graphs:

    (A->A) (B->C) (C->D) (D->B)

### Automorphism Group and Orbit

The automorphism group induces a special partition on the original graph: the orbit partition. Every cell of the orbit partition contains one orbit of the automorphisms group of the original graph.

*Example*

Let us consider the following graph:

    A - B
    | / |
    C - D
The orbit partition of this graph is

    {(A, D), (B, C)}.
    
This means, that you can exchange A and D or B and C and the resulting graph is isomorphic to the original one (see example).

### Lazy Evaluation and Caching

The calculation of the canonical label is quite expensive. Therefore, it is only done if needed. The canonical label and the orbit are cached. If the original graph is mutated, the canonical label and the orbit change. This means, that if the original graph is mutated, the cache of the `nisy` needs to be cleared. It can be done with the function `clear_cache`.

### Coloring Partition

If the vertices of the original graph are colored, the coloring needs to be translated into a coloring partition. The coloring partition must satisfy the following condition: Two vertices have the same color if and only if they are in the same cell of the coloring partition (see example below).

### Concepts, Requirements and Limitations

The `nisy` is public derived from the original graph. It models any concept modelled by the original graph. The adaptor only takes a reference to the original graph, not a copy.

The original graph must model the concepts `VertexListGraph` and `AdjacencyGraph`.

Only undirected graphs without any edge coloring are supported by the `nisy` graph adaptor.

### The Algorithm

The `nisy` determines the canonical label based on the Nauty algorithm described by Brendan McKay in B. D. McKay, Practical graph isomorphism, 10th. Manitoba Conference on Numerical Mathematics and Computing (Winnipeg, 1980); Congressus Numerantium, 30 (1981) 45-87.

## Types and Functions

The functionality supported by `nisy` depends on the underlying Graph type. The `nisy` class template is public derived form `Graph`, so all types and member functions are inherited.

### Synopsis

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


## Examples

### Simple Example

As a first example, we take two uncolored graphs with 4 vertices and 5 edges. We check if the two graphs are isomorphic and if so, we compute the canonical label and the orbit partition of the two graphs. An orbit partiton contains all 'structural identical' vertices. This means, we can permute the vertices which lie in the same orbit without changing the canonical label and in this way generate isomorphic graphs. At the end we generate the explicit isomorphism between the two graphs.

[cg_simple]

The output shows that the two graphs are isomorphic. In this simple example, we can construct the isomorphism by hand. The vertices with valence two and the vertices with valence three must map onto each other.

    The two graphs are isomorphic.

    Canonical partiton and orbit partition of G
    0 3 1 2 
    {( 1 2 )( 0 3 )}

    Canonical partition and orbit partition of H
    0 1 2 3 
    {( 0 1 )( 2 3 )}

    Isomorphism G => H
    (0->0) (1->2) (2->3) (3->1) 

### Coloring Partition Example

We look at the same example as avove, but this time with colored vertices:


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

The graphs are not isomorphic anymore:

    The two graphs are not isomorphic.

    Canonical partiton and orbit partition of G
    { 0 1 3 2 }
    {( 0 )( 1 )( 2 )( 3 )}

    Canonical partition and orbit partition of H
    { 0 2 1 3 }
    {( 0 )( 1 )( 2 )( 3 )}

    Isomorphism G => H
    (0->0) (1->2) (2->3) (3->1)

### Generating Nonisomorphic Graphs

A more advanced example creates all graphs up to a given number of edges and counts the number of nonisomorphic graphs with a specific number of edges.

We first create a small class template to generate all graphs with a given number of vertices.

This class template takes all graphs with one endge less than the requested ones and tries to add vertices and edges at all possible places. For each new graph, the canonical label is computed. If the label is not available in the list, the graph is kept, else it is discarded. The `std::set` allows a binary search over all checked graphs.


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

With the class template above, we only need to loop over all numbers of edges we need. Since the iterators of the std::vector are RandomAccess iterators we can get the numbers of graphs by subtracting the first from the one past the last. We use the `boost::timer` to measure the time needed in seconds.


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

The example returns the following table:

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
