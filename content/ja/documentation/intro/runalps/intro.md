
---
title: Introduction
toc: true
weight: 1
---

## Overview

In the ALPS library simulations are based on the scheduler library which allows you to specify parameters for your simulations, including multiple definitions of parameters (e.g. if you want to simulate a physical system at a couple of temperatures). The scheduler library will then start jobs for every single parameter set, either on a serial or parallel machine, and uses checkpoints to prevent data loss when exceeding machine walltimes. The scheduler library asks for a job file which specifies task files for every set of parameters for which a Monte Carlo simulation shall be run. The job and task files are given in XML format. The scheduler will read in these files and write observables into the task file. An example job file could look like this:

    <JOB>
    <OUTPUT file="parm.xml"/>
    <TASK status="new">
    <INPUT file="parm.task1.in.xml"/>
    <OUTPUT file="parm.task1.xml"/>
    </TASK>
    <TASK status="new">
    <INPUT file="parm.task2.in.xml"/>
    <OUTPUT file="parm.task2.xml"/>
    </TASK>
    <TASK status="new">
    <INPUT file="parm.task3.in.xml"/>
    <OUTPUT file="parm.task3.xml"/>
    </TASK> 
    </JOB>

and an example task file like:

    <SIMULATION>
    <PARAMETERS>
    <PARAMETER name="L">100</PARAMETER>
    <PARAMETER name="SWEEPS">10000</PARAMETER>
    <PARAMETER name="T">0.5</PARAMETER>
    <PARAMETER name="THERMALIZATION">100</PARAMETER>
    </PARAMETERS> 
    </SIMULATION>
    
Here we will discuss how to prepare, run, and evaluate ALPS simulations. ALPS 2 supports two ways of performing simulations:

- [Using the command line \(with limited evaluation tools\)](../commandline)
- [Using Python](../usepython)

Both ways produce the same output files. Command line and Python can be mixed and matched as you desire. The common features are the three phases of a simulation:

- Preparing the input files
- Running the simulation
- Evaluating the results 

## Comment on random number generators

Whenever you use Monte-Carlo simulations, you need to remember that you work with pseudo-random numbers. There is always a small chance that your application is just by chance the one that shows that a so-far good pseudo random number generator is not ideal. Hence, as is standard practice for all high-accuracy Monte Carlo simuations, you should run a simulation with more than one random number generator if you strive for high accuracy. The RNG parameter of the simulation allows you to change the random number generator in order to validate your results.



