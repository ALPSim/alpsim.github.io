
---
title: MC-01a Autocorrelations
math: true
toc: true
weight: 2
---

The first tutorial is an introduction to an important topic in Monte Carlo simulations: autocorrelation time. The input files for this tutorial are available in your ALPS distribution, in a directory called `mc-01-autocorrelations`.

## Local updates

We will start with local updates in an Ising model. We will simulate an Ising model on finite square lattices (L=2, 4, ..., 48) at the critical temperature $T_C=2.269186$ using **local** updates.
This tutorial can be run either on the command line or in Python. We recommend the Python version on your local machine, and the command line version for large simulations on clusters.

## Setting up and running the simulation on the command line 

To set up and run the simulation on the command line, we first create a parameter file that specifies the parameters of the simulation(s). The <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01-autocorrelations/parm1a" download>downloadable file</a> will be titled `parm1a` and its contents shall be:

```Python
LATTICE="square lattice"
T=2.269186
J=1
THERMALIZATION=10000
SWEEPS=50000  
UPDATE="local"
MODEL="Ising"
{L=2;}
{L=4;}
{L=8;}
{L=16;}
{L=32;}
{L=48;}
```

This actually specifies six simulation tasks in one simulation job, all tasks having identical parameters except for the lattice length `L`.

ALPS expects one *job file* to specify the job as a whole and a *task file* for each simulation task within it, all in XML format. So in order to run the simulation, we first need to convert this parameter file. ALPS provides a simple tool to do this: We can just run

```Python
parameter2xml parm1a
```

in the folder of the parameter file. This will generate six task files (one for each length L) named `parm1a.task1.in.xml` through `parm1a.task6.in.xml` and a job description file `parm1a.in.xml`. We can open the job file with an XML browser to check the status of our simulation once we have started it.

The simulation can be started on a single processor by running

```Python
spinmc --Tmin 10 --write-xml parm1a.in.xml
```

or on multiple processors (in our example 8) using MPI by

```Python
mpirun -np 8 spinmc --mpi  --Tmin 10 --write-xml parm1a.in.xml 
```

(In the following examples we will refer to the single processor commands only.) By setting the argument `--Tmin 10`, we tell the scheduler to check if the simulation is finished every 10 seconds initially. (The time is then dynamically adapted by the scheduler according to the needs of the simulation.)

The progress of a simulation is saved in the XML output file as the simulation is run. If a simulation is halted, such as due to pressing Ctrl-C or reaching the CPU time limit, it may be continued by starting the simulation with the XML output file instead of the input job file. Since our input job file was named `parm1a.in.xml`, the output file will be named `parm1a.out.xml` and we may restart the simulation by running

```Python
spinmc --Tmin 10 --write-xml parm1a.out.xml
```

The option "--write-xml" tells the simulation to store the results of each simulation also in an XML output file (`parm1a.task\[1-5\].out.xml`) which you can open from the job description file parm1a.out.xml using your XML browser or alternatively by converting the output to a text file using one of the following commands:

```Python
firefox ./parm1a.out.xml
convert2text parm1a.out.xml
```

The results of a single task stored, for example, in `parm1a.task1.out.xml`, can be displayed by using either of the following commands:

- Linux: `firefox ./parm1a.task1.out.xml`
- MacOS: `open -a safari parm1a.task1.out.xml`
- Windows: `"C:\Program Files\Internet Explorer\iexplore.exe" parm1a.task1.out.xml`
- Text output on Linux or MacOS: `convert2text parm1a.task1.out.xml`

Note that writing XML files can be very slow if you perform many measurements, and it is then better to work with the binary results in the HDF5 files.

To obtain more detailed information on the simulation runs, such as to check the convergence of errors, we can convert the run files of the tasks (`parm1a.task\[1-6\].out.run1`) into XML files by typing

```Python
convert2xml parm1a.task*.out.run1
```

which will generate the XML output files `parm1a.task\[1-6\].out.run1.xml` which we may open or convert to text just like the output XML files.

Look at all six tasks and, by studying the binning analysis in the files `parm1a.task\[1-6\].out.run1.xml`, observe that for large lattices the errors no longer converge. To create plots, we recommend using the Python tools described below.

## Setting up and running the simulation in Python

The `pyalps` package is a wrapper for ALPS: All it does is call the commands described in the previous section as if they were run in a terminal. It is superior for plotting because the output of the simulation can be read directly into a Python data structure and accessed by `matplotlib`, and it also comes with a wrapper `pyalps.plot` for certain matplotlib functions to neatly plot data generated by `pyalps`.

To set up and run the simulation in Python, we create a script named <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01-autocorrelations/tutorial1a.py" download>`tutorial1a.py`</a>. The first part of this script must import the required modules and prepare the input job and task files. Instead of writing a parameter file and using `convert2xml`, we store a list containing each task's parameters as a dictionary, like so:

```Python
import pyalps
import matplotlib.pyplot as plt
import pyalps.plot

parms = []
for l in [2,4,8,16,32,48]:
    parms.append(
        {
            'LATTICE'        : "square lattice",
            'T'              : 2.269186,
            'J'              : 1 ,
            'THERMALIZATION' : 10000,
            'SWEEPS'         : 50000,
            'UPDATE'         : "local",
            'MODEL'          : "Ising",
            'L'              : l
        }
    )
```

and convert this into an XML job file with the function

```Python
input_file = pyalps.writeInputFiles('parm1a',parms)
```

The input_file variable may be used as an input for `pyalps.runApplication` as shown below:

```Python
pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True)
```

`spinmc` is the name of the terminal command to be called. The option `writexml=True` tells ALPS to write XML files, `input_file` is the path to the XML job input file, and `Tmin=5` again tells ALPS to check every 5 seconds for completion of the simulation.

We next load the binning analysis for the absolute value of the magnetization from the output files using `pyalps.loadBinningAnalysis`, and flatten the list of lists we get with `pyalps.flatten`:

```Python
binning = pyalps.loadBinningAnalysis(pyalps.getResultFiles(prefix='parm1a'),'|Magnetization|')
binning = pyalps.flatten(binning)
```

We may give each data set a label which will be displayed in any graph specifying the lattice size:

```Python
for dataset in binning:
    dataset.props['label'] = 'L='+str(dataset.props['L'])
```

`pyalps.plot` functions will respect this. And finally we create a plot showing the binning analysis graphically:

```Python
plt.figure()
plt.xlabel('binning level')
plt.ylabel('Error of |Magnetization|')
pyalps.plot.plot(binning)
plt.legend()
plt.show()
```

To make separate plots for each system size we make a loop over all data sets:

```Python
for dataset in binning:
    plt.figure()
    plt.title('Binning analysis for L='+str(dataset.props['L']))
    plt.xlabel('binning level')
    plt.ylabel('Error of |Magnetization|')
    pyalps.plot.plot(dataset)
    
plt.show()
```

From the produced figure below, you can clearly see that the errors do not converge for large system sizes.

![](/figs/mcs01binlocal.png)

## Cluster updates

We next repeat the simulations, but using cluster updates. We want to change three parameters:

| **Name** |  |
| :------- | :------- |
| THERMALIZATION | 1000 |
| SWEEPS | 100000 |
| UPDATE | "cluster" |

To run the simulations we follow the same procedure as above, using either
- <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01-autocorrelations/parm1b" download>`parm1b`</a> for the command-line input file, or
- <a href="https://github.com/ALPSim/ALPS/blob/master/tutorials/mc-01-autocorrelations/tutorial1b.py" download>`tutorial1b.py`</a> for the Python script.

You will get curves looking like the ones below. Now the errors have converged and can be trusted.

![](/figs/mcs01bincluster.png)

## Questions

- Are the errors converged? (To check this convert the run files as described above.)
- Why do longer autocorrelation times lead to slower error convergence?
- On what system parameters do the autocorrelation times depend on? Check by changing parameters in the input file.
- Can you explain why cluster updates are more efficient than local updates?




