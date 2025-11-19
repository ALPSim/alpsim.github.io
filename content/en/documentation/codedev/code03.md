
---
title: Code-03 MonteCarloHOWTO
math: true
toc: true
weight: 4
---

## Introduction

While several Monte Carlo (MC) programs are already available in the ALPS applications, the main purpose of ALPS is to help developers to program their own MC program in the easiest and quickest possible way. There are several common tasks performed by all MC algorithms which do not need to be re-programmed each time. The goal of this article is to convince that the ALPS libraries propose a simple framework to do so, and to demonstrate with examples how to use them. This includes both classical Monte Carlo as well as Quantum Monte Carlo algorithms.
The directory `example/scheduler` in the ALPS sources contains an example simulation code for the Ising model that can be adapted to your needs. In the following we will discuss these examples.

### What are the advantages of the ALPS libraries over one's own tools for developing a new MC application ?

- Automatic calculation of error bars and autocorrelation times
- Automatic parallelization
- Automatic output of results (in XML) with the corresponding extraction tools
- Automatic management of the sign (for Quantum Monte Carlo simulations with a sign problem)
- Easy checkpointing & Easy restarting of simulations
- Easy management of input parameters
- Easy way to add new measurements
- Easy management of random numbers
- (Optional) Easy management of lattices
- (Optional) Easy management of quantum Hamiltonians (for Quantum Monte Carlo)
- ...

All this comes with only a small amount of programming/modification that we describe now.

## Starting your own ALPS MC program

**Work in progress ... The tutorial is neither finished nor corrected ...Please send me any comments / suggestions on this page**

First of all, using the ALPS libraries implies that you use C++ as the programming language. From now on, let us assume that you want to program a new MC application and that you already know what are going to be your internal data structure and the algorithm you will use for a single Monte Carlo step.
To use the ALPS libraries, you will need to create your own C++ class, that will be derived from an internal ALPS class. Let's call this class `MyMonteCarlo` and create a `MyMonteCarlo.hpp` header file.

    #ifndef MYMC_HPP
    #define MYMC_HPP
    #include <alps/scheduler.h>
    #include <alps/alea.h>
    #include <alps/scheduler/montecarlo.h>
    #include <alps/osiris.h>
    #include <alps/osiris/dump.h>
    #include <alps/expression.h>
    using namespace std;
    class MyMonteCarlo : public alps::scheduler::MCRun{
    public :
        MyMonteCarlo(const alps::ProcessList &,const alps::Parameters &,int);
        static void print_copyright(std::ostream &);
        void save(alps::ODump &) const;
        void load(alps::IDump &);
        void dostep();
        bool is_thermalized() const;
        double work_done() const;
    private :
        // your own internal data here ...
    };
    #endif

We now see what all these lines mean.
- First of all you need to include a few ALPS headers (some more will go here for other ALPS functionalities).
- Then we will define our `MyMonteCarlo` class out by deriving it from a ALPS class. The above header file implies that you will use the `MCRun` ALPS class, which is the simplest one. If you want to enjoy the lattice functionalities of ALPS, replace the class definition line by:

    class MyMonteCarlo : public alps::scheduler::LatticeMCRun<>{

and add in the headers

    #include <alps/lattice.h>
    
If you moreover want to use the Model library (useful for lattice quantum models), use instead:

    class MyMonteCarlo : public alps::scheduler::LatticeModelMCRun<>{

- In the public part, `MyMonteCarlo(const alps::ProcessList&,const alps::Parameters&,int)` is the constructor of your class, and will be needed to initialize all parameters.
- `print_copyright(std::ostream&)` is a simple function to output any useful information that you want to be output at the beginning of each simulation.
- The save and load functions are very useful functions where you will describe what is needed to save (load) on disk to restart the simulations after each checkpoint
- The dostep function is your main MC function: this is the function that is going to be executed every MC step.
- The `is_thermalized` function will tell the ALPS libraries when the thermalization part of your simulation is finished (that is, when can the measurement series start)
- The `work_done` function will tell the ALPS libraries what is the percentage of the simulations that is already done.

The rest of the job is now to correctly interface these functions with your program. This will be done in a file called, say, `MyMonteCarlo.cpp`

## Building your own ALPS MC program

### The copyright function

We start with the easiest function `print_copyright()` in the file `MyMonteCarlo.cpp`

    #include "MyMonteCarlo.hpp";
    /************************************ ALPS functions **********************************************/
    // Copyright statement
    void MyMonteCarlo::print_copyright(std::ostream & out)
    {
        out << "My own ALPS Monte Carlo program v. 0.1\n"
            << "  copyright (c) 2006 by Myself,\n"
            << "  available from the author on request\n\n";
    }

### Management of Monte Carlo steps

Let us now concentrate on the management of MC steps. A typical situation is the following: one would like to perform a fixed number of steps for thermalization, then a fixed number of steps for the measurement part. Very often, one would like also to perform a certain amount of Monte Carlo steps between each measurement. Therefore it could be useful to define in your internal data structure the following variables (in `MyMonteCarlo.hpp`):

    private :
        // your own internal data here ...
        int Nb_Steps; 
        int Nb_Thermalisation_Steps; 
        int Each_Measurement;
        int Steps_Done_Total; 
        int Measurements_Done;
        void do_update();
        void do_measurements();
        // the rest of your own internal data here ...
    };
    
Here `Nb_Thermalisation_Steps` will be the number of thermalization steps that you ask for and `Nb_Steps` the number of steps after thermalization that you ask for. `Each_Measurement` will be the number of steps between each measurement. These three numbers will be initialized later in the constructor. `Steps_Done_Total` will store the current number of MC finished steps (including those of thermalization). Finally `Measurements_Done` will store the intermediate number of steps done between each measurement. The `do_update()` and `do_measurements()` function (that you will have to define yourself) will perform respectively one single MC step and one series of measurement.
All these definitions lead to the following simple definitions of your class member functions in `MyMonteCarlo.cpp`

    bool MyMonteCarlo::is_thermalized() const
    {  return (Steps_Done_Total >= Nb_Thermalisation_Steps); }

This function will indeed return 1 if the current number of MC steps is superior to the total number of thermalization steps asked for, 0 otherwise. The second function

    double MyMonteCarlo::work_done() const
    { return (is_thermalized() ? (Steps_Done_Total-Nb_Thermalisation_Steps)/double(Nb_Steps) :0.); }

will return 0 if the simulation is not thermalized, and a number between 0 and 1 corresponding to the percentage of asked measurement steps already performed. Finally the `dostep()` function will look like this

    void MyMonteCarlo::dostep()
    { do_update(); // you'll have to define what this function does later
      ++Steps_Done_Total; // increment the number of steps done
      if (is_thermalized()) // do measurements only if simulation thermalized
        { if (++Measurements_Done==Each_Measurement) // do a measurement every Each_Measurement
            { Measurements_Done=0;
            do_measurements(); // you'll have to define what this function does later
            }
        }
    }
    
At some point you have of course to define what your program really does during one MC step, and this will be done in the `do_update()` function. I can't help you with that one! The measurements have been grouped in our example in the `do_measurements()` function that will be described below.

### The save and load functions

ALPS allows an easy treatment of the internal data to be checkpointed to disk. Let us imagine that in your internal data structure you need to checkpoint a few integers and an array of double to be able to restart your simulations

    private :
        // the rest of your own internal data here ...
        int Number_of_Spins; 
        int MyOwnVariable;
        std::vector<double> SpinArray;
        ...
    };
    
This can be accomplished very easily by writing

    void MyMonteCarlo::save(alps::ODump& dump) const
        { dump <<  Number_of_Spins << MyOwnVariable << SpinArray;}

and the load function is easily guessed to be

    void MyMonteCarlo::load(alps::IDump& dump) const
        { dump >>  Number_of_Spins >> MyOwnVariable >> SpinArray;}
        
Note that you can dump this way most of the usual types (int,double,bool etc) and most standard containers are also available (such as vector or set).
Now imagine that you have made your own little internal structure,

    struct Vertex
        { int vertex_type;
        std::vector<double> coordinates;
        int SomeOtherVariable; }
        
and you want to save an instantiation thereof in your Monte Carlo class.

    private :
        // the rest of your own internal data here ...
        Vertex MyVertex; 
        ...
    };
    
Well, you just have to teach ALPS what to save and load in your structure

    alps::ODump& operator<<(alps::ODump& dump, const Vertex& v)
    { return dump << v.vertex_type << v.coordinates; }

    alps::IDump& operator>>(alps::IDump& dump, Vertex& v)
    { return dump >> v.vertex_type >> v.coordinates;}
    
and then you'll easily be able to add MyVertex in the main ALPS save and load functions:

    void MyMonteCarlo::save(alps::ODump& dump) const
    { dump <<  Number_of_Spins << MyOwnVariable << SpinArray << MyVertex;}

If you have used the management of Monte Carlo steps described above, you also want to add this in your save/load functions:

    void MyMonteCarlo::save(alps::ODump& dump) const
    { dump <<  Number_of_Spins << MyOwnVariable << SpinArray << MyVertex;
        dump <<  Nb_Steps << Measurements_Done; }

### The `do_measurements()` function

In this function you will perform your measurements, and give them to ALPS to be treated. This is pretty simple.

    void MyMonteCarlo::do_measurements()
    { double Energy; std::valarray<double> Correl(L);
     // do the measurements in your code (update the Energy and Correl variable) ...
     ...
     // give them to ALPS
     measurements["Energy"] << Energy;
     measurements["Spin Correlations"] << Correl;
   }
   
and that's it? Now you might wonder: how does ALPS know what "Energy" or "Spin Correlations" is ? How does it distinguish between scalar measurements (such as Energy here) and vector ones (such as Correl) ? These two questions will be addressed below, in the Constructor of your class.
Another question might be: why did you use a `std::valarray` and not a `std::vector` for the vector observable ? This is for internal ALPS reasons, but just remember that for vector observables, ALPS need the vectors to **always** be of the same size for each different measurements (in this example, measurements["Spin Correlations"] will fail if the Correl object has not always the same size -L here-).

### The Constructor

There are basically three things which you have to do in your constructor:
- Initialize the parameters for your simulation by reading them from the given parameters
- Initialize other internal variables, e.g. spin configuration
- Define observables that are used in the do_measurements() function above

The constructor looks like

    MyMonteCarlo::MyMonteCarlo(const alps::ProcessList& where,const alps::Parameters& params,int node) : alps::scheduler::MCRun(where,params,node),
    Nb_Steps(params.value_or_default("SWEEPS",1000)),
    Nb_Thermalisation_Steps(static_cast<alps::uint32_t>(params["THERMALIZATION"])),
    Number_of_Spins(alps::evaluate<alps::uint32_t>(params["L"],params)),
    T(params.defined("T") ? static_cast<double>(params["T"]) : 1./static_cast<double>(params["beta"])),
    Steps_Done_Total(0),
    SpinArray(Number_of_Spins,0),    //Initialize the std::vector with size Number_of_Spins and set all values to 0
    //...
    {
    for (std::vector<int>::iterator iter=SpinArray.begin(); iter!=SpinArray.end(); ++iter)
        *iter=random_int(-1,1);
    //...    
   
    measurements << alps::RealObservable("Energy");               //With binning
    measurements << alps::SimpleRealObservable("Magnetization");  //Without binning
   
    alps::RealVectorObservable::label_type correlationlabels;
    // set correlationlabels using push_back() ...
    measurements << alps::RealVectorObservable("Spin Correlations",correlationlabels);
    }

As you see, there are several ways to read the parameters from the `params` object. Defining the observables is done by simply providing its type and its label.
Note, that by including `alps/scheduler/montecarlo.h` you can also use the random number functions

    random_int(int a, int b);         //from [a,b]
    random_int(int n);                //from [0,n)
    random_real(double a, double b);  //from (a,b)
    random_real();                    //from (0,1)

provided by ALPS.

## Running your ALPS code

In order to run your code it is useful to add the following typedef in your `MyMonteCarlo.h`:

    typedef alps::scheduler::SimpleMCFactory<MyMonteCarlo> MyMonteCarloFactory;

In a simple `main.C` as for example `.../alps/example/scheduler/main.C` you can now call

    int main(int argc, char** argv)
    {
        // ...
        return alps::scheduler::start(argc,argv,MyMonteCarloFactory());
        // ...
    }
    
After compiling and linking you start your simulation using `./MyMonteCarlo parm.in.xml` and that's it.

## Using the lattice functionalities of ALPS

If you want ALPS not only to do the scheduling and the measurement handling for you but also to take care of the lattice operations, you can use the `LatticeMCRun` class. Define your Monte Carlo Code as follows:

    typedef alps::scheduler::LatticeMCRun<>::graph_type graph_type;
    class MyLatticeMonteCarlo : public alps::scheduler::LatticeMCRun<graph_type> { ... }
    
At the execution of your simulation you will have to tell your class via your parameter file, what kind of lattice you want to use, e.g.

    LATTICE = "square lattice"
    
or

    LATTICE = "honeycomb lattice"
    
There are a lot of predefined lattices, which you can find in your `/alps/2.x.x/lib/xml/lattices.xml`. How to define your own lattice is explained [here](../../intro/latticehowtos/intro).

### Introduction

Basically, ALPS creates an object of a `boost::graph` which represents the lattice. This powerful data structure allows easy and efficient movement through the vertices and edges of a graph. Note, that in the ALPS language we talk of sites, bonds, neighbors instead of the Boost's vertices, edges, adjacent_vertices. To access a particular site, the data structure works with the data type site_descriptor. Unless you define anything else, the site_descriptor of your lattice will be of an int type (more precisely, the `alps::uint32_t` type). This enables you to use the site_descriptor as the index of your (private) storage array (or vector,...) of your system's configuration. In other words, you have to take care of the content of the data in your lattice (spin values, occupation number, etc.) yourself! The lattice functionalities of ALPS do the work of easily providing the site_descriptor of neighbors or bond_descriptor of outgoing bonds of a site.
Moreover, they allow to iterate over sites, bonds and neighbors with the so_called site_iterator. A site_iterator is simply a list element which has a pointer to a site_descriptor and a pointer to the next site_iterator. A bond_iterator works the same way. Thus, the totality of all sites can be represented as a `std::pair<site_iterator, site_iterator>` constituing of the pointer to the first and the last element in a list of all sites. This is precisely what `sites()` returns.

### An all-in-one example

This section gives a code example which should include most of the important features. It will be a double implementation of the energy measurement of an Ising spin system, respectively as
iteration over all bonds
iteration over all sites followed by an iteration over the neighbors of the site
iteration over all sites followed by an iteration over the outgoing edges of the site
In your constructor an initialization of your spins vector could look like
 `std::vector<int> spins(num_sites())`;
 
    site_iterator s_iter;
    for (s_iter = sites().first; s_iter!=sites().second; ++s_iter)
        spins[*s_iter]=random_int(0,1);

So you can see the two functions of the `LatticeMCRun` class `num_sites()` (returns the number of sites) and `sites()` (returns a `std::pair` of site_iterators). We can use the site_descriptor where iter points as the index for our spin-vector.
The measurement of the energy as a part of the `do_step()` function could look like

    double E = 0.0;
    int index1, index2;
    for (bond_iterator b_iter=bonds().first; b_iter!=bonds().second; ++b_iter) {
        index1 = source(*b_iter);
        index2 = target(*b_iter);
        E += (spins[index1]==spins[index2])? J : -J ;            // where J is the coupling constant
    }
    //...
    measurements["Energy"] << E/num_sites();
    
In this version, we iterate over all bonds, analogous to the iteration over sites and can access the two sites at the ends of the bond via source(bond_descriptor b) and target(bond_descriptor b) which return a site_descriptor.

The alternative, including neighbor handling, is:

    double E = 0.0;
    for (site_iterator s_iter=sites().first; s_iter!=sites().second; ++s_iter) {
        neighbor_iterator n_iter;
        for (n_iter=neighbors(*s_iter).first; n_iter!=neighbors(*s_iter).second; ++n_iter) {
            E += (spins[*s_iter]==spins[*n_iter])? 0.5*J : -0.5*J ;            // where J is the coupling constant, factor 1/2 because of double-counting
        }
    }

The third possibility runs through the outgoing bonds of a site:

    double E = 0.0;
    for (site_iterator s_iter=sites().first; s_iter!=sites().second; ++s_iter) {
        neighbor_bond_iterator nb_iter;
        for (nb_iter=neighbor_bonds(*s_iter).first; nb_iter!=neighbor_bonds(*s_iter).second; ++nb_iter) {
            E += (spins[source(*nb_iter)]==spins[target(*nb_iter)])? 0.5*J : -0.5*J ;
        }
    }
    
Finally, if you want to access a random site or a random bond you can take site(int site_no) and bond(int bond_no):

    site_descriptor randomsite = site(random_int(num_sites() ) );
    bond_descriptor randombond = bond(random_int(num_bonds() ) );
