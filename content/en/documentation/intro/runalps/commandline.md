
---
title: ALPS using the command line
toc: true
weight: 2
---

## Preparing the input

Since the XML format of the job and task files is probably not what you want to deal with on a daily basis, the parameter2xml tool lets you specify the simulation parameters in a plain text file which is converted to the XML format for your conveniece.

The `parameter2xml` tool transforms a plain text parameter file into the above XML format,thereby creating the job and all necessary task files. The parameter file consists of a number of parameter assignments of the form:

    MODEL="Ising";
    SWEEPS=1000;
    THERMALIZATION=100; 
    WORK_FACTOR=L*SWEEPS;
    { L=10; T=0.1; }
    { L=20; T=0.05; }

where each group of assignments inside a block of curly braces {...} indicates a set of parameters for a single simulation. Assignments outside of a block of curly braces are valid globally for all simulation after the point of definition. Strings are given in double quotes, as in "Ising".

Two parameters have a special meaning:

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| SEED | 0 | The random number seed used in the next Monte Carlo run created. After using a seed in the creation of a Monte Carlo run, this value gets incremented by one. |
| WORK_FACTOR 1 | A factor by which the work that needs to be done for a simulation is multiplied in load balancing. |

 The syntax to invoke `parameter2xml` is:
 
    parameter2xml [-f] parameterfile [xmlfileprefix]

which converts a parameterfile into a set of XML files, starting with the prefix given as optional second argument. The default for the second argument is the name as the parameterfile.
The `parameter2xml` tool checks the existence of output XML files, and ask the user if he/she really wants to overwrite the input files. One can force `parameter2xml` to overwrite the input XMLs by "-f" option.

## Invoking the program

### Running the simulation on a serial machine

The simulation is started by first creating the job file, and then giving the name of the XML job file as argument to the program. In our example, the program is called my_program and the sequence for running it is:

    parameter2xml parm job 
    my_program  job.in.xml

The results will be stored in a file `job.out.xml`, which refers to the files j`ob.task1.out.xml`, `job.task2.out.xml` and `job.task3.out.xml` for the results of the three simulations.

#### Command line options

The program takes a number of command line options, to control the behavior of the scheduler. These options are most useful for Monte Carlo simulations.

| **Option** | **Default** | **Description** |
| :--------- | :---------- | :-------------- |
| --time-limit timelimit | infinity | gives the time (in seconds) which the program should run before writing a final checkpoint and exiting. |
| --checkpoint-time checkpointtime | 1800 | gives the time (in seconds) after which the program should write a checkpoint. |
| --Tmin checkingtime | 60 | gives the minimum time (in seconds) which the scheduler waits before checking (again) whether a simulation is finished. |
| --Tmax checkingtime | 900 | gives the maximum time (in seconds) which the scheduler waits before checking (again) whether a simulation is finished. |
| --write-xml | | with this option the result will be written to the .out.xml files, while otherwise it is only written to the hdf5-files. |

### Running the simulation on a parallel machine

is as easy as running it on a single machine. We will give the example using MPI. After starting the MPI environment (using e.g. lamboot for LAM MPI), you run the program in parallel using mpirun. In our example, e.g. to run it on four processes you do:

    parameter2xml parm job 
    mpirun -np 4 my_program --mpi job.in.xml
 
 #### Command line options
 
 In addition to the command line options for the sequential program there are two more for the parallel program:
 
 | **Option** | **Default** | **Description** |
| :--------- | :---------- | :-------------- |
| --mpi | | specifies that the program should be run in MPI mode |
| --Nmax numprocs | infinity | gives the maximum number of processes to assign to a simulation. |
| --Nmin numprocs | 1 | gives the minimum number of processes to assign to a simulation. |

If there are more processors available than simulations, more than one Monte Carlo run will be started for each simulation. 

## Analyzing the simulation results 

During the simulations expectation values of a couple of observables (specified and implemented in the simulation code) are measured and stored in the respective task files. To archive the task files produced from a simulation and to extract data from these files or the archive respectively a couple of tools are documented in the following.

### `convert2xml`

The simulation output files only contain the collected measurements from all runs. Details about the individual Monte Carlo runs for each simulation can be obtained by converting the checkpoint files to XML, using the `convert2xml` tool, e.g.:

    convert2xml run-file

This will produce an xml file of the task, containing information extracted from this Monte Carlo run.

### Evaluation of observables

There are the following binaries for evaluation using the command line: `dirloop_sse_evalute`, `spin_mc_evaluate`, `worm_evaluate`, `fulldiag_evaluate` and `qwl_evaluate`. Three of them (`dirloop_sse_evaluate`, `spinmc_evaluate` and `worm_evaluate`) take the same syntax:

    spinmc_evaluate [--write-xml] job.task1.out.xml [job.task2.out.xml ... ]

This will calculate additional observables (e.g. specific heat, compressibility, ...) which have not been computed while the simulation, using the stored mc-data files. Using the '--write-xml' will write everything back to the .out.xml files. Without this flag the result will be written to the hdf5-files only.
For the syntax of the other two binaries (`fulldiag_evaluate` and `qwl_evaluate`) please see the Tutorials on QWL and ED.
The structure of the evalute programs is relatively easy. It is straight forward to create or modify such evaluate-programs. The following example reads the expectation values of the particle number operators n and n2 of the simulation of a bosonic Hubbard model, calculates the expectation value of the compressibility and writes it back to the checkpoint.

    #include <alps/scheduler.h>
    #include <alps/alea.h>
 
    void evaluate(const boost::filesystem::path& p, std::ostream& out) {
        alps::ProcessList nowhere;
        alps::scheduler::MCSimulation sim(nowhere,p);
 
        // read in parameters
        alps::Parameters parms=sim.get_parameters();
        double beta=parms.defined("beta") ? static_cast<double>(parms["beta"]) : (1./static_cast<double>(parms["T"]));             
 
        // determine compressibility
        alps::RealObsevaluator n  = sim.get_measurements()["Particle number"];
        alps::RealObsevaluator n2 = sim.get_measurements()["Particle number^2"];
        alps::RealObsevaluator kappa= beta*(n2 - n*n);  
        kappa.rename("Compressibility");
 
        // write compressibility back to checkpoint  
        sim << kappa;
        sim.checkpoint(p);
    }
 
    int main(int argc, char** argv)
    {
        alps::scheduler::BasicFactory<alps::scheduler::MCSimulation,alps::scheduler::DummyMCRun> factory;
        alps::scheduler::init(factory);
        boost::filesystem::path p(argv[1],boost::filesystem::native);
        evaluate(p,std::cout);
    }

Note that ALPS 2 provides much easier analysis and evaluation of data in Python, and this C++ example should only be used by those who require analysis in their C++ programs.



