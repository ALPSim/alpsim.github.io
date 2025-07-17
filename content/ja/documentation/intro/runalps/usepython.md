
---
title: ALPS using Python
toc: true
weight: 3
---

## Running ALPS programs using Python

To demonstrate the use of ALPS from Python we will look at a simple classical Monte Carlo simulation, similar to the second MC tutorial second MC tutorial .

## Launching Python

Python restricts Python extensions to be used only with the **exact** version of Python used to compile the extension and no other. If you build ALPS from source, as it is required for example on Linux, you can specify the Python interpreter to use when configuring ALPS. ALPS will then create a script called

    alpspython
    
which sets the paths needed to find the ALPS extensions and then calls your Python interpreter.

## Detailed instructions

### Importing the ALPS modules

After launching Python import the modules we will need:

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot

The full Python script is in the tutorials directory at tutorials/intro-01-basics/tutorial-full.py

### Preparing the input

To prepare the input we create a Python lust of dicts containing the simulation parameters:

    parms = []
    for t in [1.5,2,2.5]:
    parms.append(
        { 
            'LATTICE'        : "square lattice", 
            'T'              : t,
            'J'              : 1 ,
            'THERMALIZATION' : 1000,
            'SWEEPS'         : 100000,
            'UPDATE'         : "cluster",
            'MODEL'          : "Ising",
            'L'              : 8
        }
    )

We next write the input files for the ALPS simulation:

    input_file = pyalps.writeInputFiles('parm1',parms)

The argument 'parm1' tells the function to use parm1 as prefix for all simulation files. The function returns the name of the main simulation file (here `parm1.in.xml`).

### Running the simulation

#### Running the simulation on a serial machine

To run the simulation we just call the runApplication function:

    pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True)
    
The parameter writexml=True tells ALPS to write all results also to the XML files. This slows down the I/O but is convenient since it allows you to look at the results simply by opening the output XML files in your web browser. However, if you measure many quantities the files will become huge and writing will take too long.

#### Running the simulation on a parallel machine

To run the simulation on a parallel machine using MPI, call the following command instead:

    pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True,MPI=4)

where the argument MPI tells MPI how many processes to start.

### Loading the simulation results

#### Getting the result files

Before loading the results we need to get the list of result files. Looking only at files theta we created just now (those starting with the prefix parm1) we get the file list:

    result_files = pyalps.getResultFiles(prefix='parm1')
    print result_files

#### Loading the results

Next we might want to know what has been measured. For that we can load the list of observables:

    print pyalps.loadObservableList(result_files)
    
We decide to load the absolute value and square of the magnetization, nd print what we loaded:

    data = pyalps.loadMeasurements(result_files,['|Magnetization|','Magnetization^2'])
    print data
    
The printed output contains the loaded values in y, and all the simulation parameters in the dict called props.

### Plotting the results 

To make a plot of, e.g. |Magnetization| versus temperature we now collect the values of |Magnetization| into y and the temperature T into x using a call to collectXY:

    plotdata = pyalps.collectXY(data,'T','|Magnetization|')

#### Plotting in Python using `matplotlib`

and then we plot it using `matplotlib` and the pyalps.plot module:

    plt.figure()
    pyalps.plot.plot(plotdata)
    plt.xlim(0,3)
    plt.ylim(0,1)
    plt.title('Ising model')
    plt.show()

#### Converting to other formats

We can also call functions to convert the dataset to other plot formats, such as text, grace, or gnuplot:

    print pyalps.plot.convertToText(plotdata)
    print pyalps.plot.makeGracePlot(plotdata)
    print pyalps.plot.makeGnuplotPlot(plotdata)

### Evaluating data

We can easily evaluate functions of the results, e.g. to caluclate the Binder cumulant ratio  $\langle m^2 \rangle / \langle |m|\rangle ^2$ . We create a new DataSet and fill it in:

    binder = pyalps.DataSet()
    binder.props = pyalps.dict_intersect([d[0].props for d in data])
    binder.x = [d[0].props['T'] for d in data]
    binder.y = [d[1].y[0]/(d[0].y[0]*d[0].y[0]) for d in data]
    print binder

The expression `d[1].y[0]/(d[0].y[0]*d[0].y[0])` uses jackknife-analysis to calculate correct Monte Carlo error bars for the correlated quantities.

Finally we make another plot:

    plt.figure()
    pyalps.plot.plot(binder)
    plt.xlabel('T')
    plt.ylabel('Binder cumulant')
    plt.show()

## Complete example scripts

The complete script is in the file tutorials/intro-01-basics/tutorial-full.py .

In the following we will present smaller scripts for various tasks:

### Running and plotting

- Preparing a plot of the magnetization in MatPlotLib: tutorials/intro-01-basics/tutorial-magnetization.py
- Preparing a plot of the magnetization in Grace: tutorials/intro-01-basics/tutorial-graceplot.py
- Preparing a plot of the magnetization in Gnuplot: tutorials/intro-01-basics/tutorial-gnuplot.py
- Preparing an output of the magnetization in plain text: tutorials/intro-01-basics/tutorial-text.py

### More complex evaluation

- Calculation of the Binder cumulants is in the file tutorials/intro-01-basics/tutorial-binder.py .

### Splitting into subtasks

The preparation, simulation, and evaluation tasks can also be split into subtasks:

- Preparing the input files: tutorials/intro-01-basics/tutorial-prepareinput.py
- Running the simulation: tutorials/intro-01-basics/tutorial-runsimulation.py 
- Evaluating the results: tutorials/intro-01-basics/tutorial-evaluate.py 

## More examples

More example usage of the various functions and more advanced applications can be found in the tutorials. Also, don't forget to look at the documentation of the various functions using the \_\_doc\_\_ member variable of the functions, as in:

    print pyalps.plot.plot.__doc__

