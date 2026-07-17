
---
title: ALPS using the command line
toc: true
weight: 2
---

## Preparing the input

Since the XML format of the job and task files is probably not what you want to deal with on a daily basis, the `parameter2xml` tool lets you specify the simulation parameters in a plain text file, which is then converted to XML for you.

The `parameter2xml` tool transforms a plain text parameter file into the job file and all necessary task files, in the XML format described in the [Introduction](../intro). The parameter file consists of a number of parameter assignments of the form:

    MODEL="Ising";
    SWEEPS=1000;
    THERMALIZATION=100; 
    WORK_FACTOR=L*SWEEPS;
    { L=10; T=0.1; }
    { L=20; T=0.05; }

where each group of assignments inside a block of curly braces {...} indicates a set of parameters for a single task. Assignments outside of a block of curly braces are valid globally for all tasks defined after that point. Strings are given in double quotes, as in "Ising".

Two parameters have a special meaning:

| **Parameter** | **Default** | **Meaning** |
| :------------ | :---------- | :---------- |
| SEED | 0 | The seed for the pseudo-random number generator used in the next Monte Carlo run to be created. After a seed has been used to create a run, this value is incremented by one. |
| WORK_FACTOR | 1 | A factor by which the work that needs to be done for a simulation is multiplied in load balancing. |

The syntax to invoke `parameter2xml` is:

    parameter2xml [-f] parameterfile [xmlfileprefix]

which converts a parameter file into a set of XML files, starting with the prefix given as an optional second argument. The default for that second argument is the name of the parameter file itself.
The `parameter2xml` tool checks whether output XML files with these names already exist, and asks whether you really want to overwrite them. You can force `parameter2xml` to overwrite them with the `-f` option.

## Invoking the program

### Running the simulation on a serial machine

The simulation is started by first creating the job file, and then giving the name of the XML job file as an argument to the program. In our example, the program is called `my_program`, and the sequence for running it is:

    parameter2xml parm job 
    my_program job.in.xml

The results will be stored in a file `job.out.xml`, which refers to the files `job.task1.out.xml`, `job.task2.out.xml`, and `job.task3.out.xml` for the results of the three simulations.

#### Command line options

The program takes a number of command line options to control the behavior of the scheduler. These options are most useful for Monte Carlo simulations.

| **Option** | **Default** | **Description** |
| :--------- | :---------- | :-------------- |
| --time-limit timelimit | infinity | gives the time (in seconds) for which the program should run before writing a final checkpoint and exiting. |
| --checkpoint-time checkpointtime | 1800 | gives the time (in seconds) after which the program should write a checkpoint. |
| --Tmin checkingtime | 60 | gives the minimum time (in seconds) that the scheduler waits before checking again whether a simulation is finished. |
| --Tmax checkingtime | 900 | gives the maximum time (in seconds) that the scheduler waits before checking again whether a simulation is finished. |
| --write-xml | | with this option, the result will be written to the `.out.xml` files as well; otherwise it is written only to the HDF5 files. |

### Running the simulation on a parallel machine

Running the simulation on a parallel machine is just as easy as running it on a serial one. We give an example using Open MPI: no separate step is needed to start the MPI environment, you launch the program directly with `mpirun` (for multi-node runs, pass a hostfile via `--hostfile`). For example, to run it on four processes:

    parameter2xml parm job 
    mpirun -np 4 my_program --mpi job.in.xml

#### Command line options

In addition to the command line options for the serial program, there are two more for the parallel program:

| **Option** | **Default** | **Description** |
| :--------- | :---------- | :-------------- |
| --mpi | | specifies that the program should be run in MPI mode |
| --Nmax numprocs | infinity | gives the maximum number of processes to assign to a simulation. |
| --Nmin numprocs | 1 | gives the minimum number of processes to assign to a simulation. |

If there are more processors available than simulations, more than one Monte Carlo run will be started for each simulation. 

## Analyzing the simulation results 

During the simulations, expectation values of several observables (specified and implemented in the simulation code) are measured and stored in the respective task files. To archive the task files produced by a simulation, and to extract data from either the files or the archive, a number of tools are documented below.

### `convert2xml`

The simulation output files only contain the collected measurements from all runs. Details about the individual Monte Carlo runs for each simulation can be obtained by converting the checkpoint files to XML, using the `convert2xml` tool, e.g.:

    convert2xml run-file

This will produce an XML file of the task, containing information extracted from this Monte Carlo run.

### Evaluation of observables

There are the following binaries for evaluation using the command line: `dirloop_sse_evaluate`, `spinmc_evaluate`, `worm_evaluate`, `fulldiag_evaluate`, and `qwl_evaluate`. Three of them (`dirloop_sse_evaluate`, `spinmc_evaluate`, and `worm_evaluate`) take the same syntax:

    spinmc_evaluate [--write-xml] job.task1.out.xml [job.task2.out.xml ... ]

This will calculate additional observables (e.g. specific heat, compressibility, ...) that were not computed during the simulation itself, using the stored MC data files. Using `--write-xml` will write everything back to the `.out.xml` files; without this flag, the result will be written to the HDF5 files only.
For the syntax of the other two binaries, see the [MC-06 QWL](../../../../tutorials/mcs/mc06) and [ED-06 Full Diagonalization](../../../../tutorials/ed/ed06) tutorials, which use `qwl_evaluate` and `fulldiag_evaluate` respectively.
The structure of the evaluate programs is relatively simple, and it is straightforward to create or modify such evaluate programs. The following example reads the expectation values of the particle number operators n and n2 of the simulation of a bosonic Hubbard model, calculates the expectation value of the compressibility, and writes it back to the checkpoint.

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
        boost::filesystem::path p(argv[1]);
        evaluate(p,std::cout);
    }

Note that ALPS provides much easier analysis and evaluation of data in Python (see [Using Python](../usepython)), and this C++ example should only be used by those who require analysis in their C++ programs.

For the input parameters common to most ALPS applications, see [Common Parameters](../../parameters); the scheduler options on this page (`--time-limit`, `--checkpoint-time`, `--Tmin`/`--Tmax`, `--mpi`, `--Nmin`/`--Nmax`, `--write-xml`) are command-line flags to the scheduler itself, not parameters set in the parameter file. For an overview of the rest of this section, see [Running Simulations](../..).



