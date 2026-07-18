
---
title: Introduction
toc: true
weight: 1
---

## Overview

ALPS simulations are built on the scheduler library, which lets you specify the parameters for a simulation, including multiple parameter sets at once (for example, if you want to simulate a physical system at several different temperatures). The scheduler library then starts a job for each parameter set, on either a serial or a parallel machine, and writes periodic checkpoints — snapshots of the run's current state — so that no data is lost if a run is interrupted or exceeds the machine's walltime limit; a restarted run picks up from its most recent checkpoint instead of starting over. It reads its input from a job file, which lists one task file per parameter set for which a simulation is to be run. Job and task files are both given in XML format: the scheduler reads the task files for their input parameters and writes the measured observables back into them. An example job file could look like this:

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

The `<OUTPUT>` element on the `<JOB>` itself names the job-level summary file, which the scheduler keeps up to date at every checkpoint as tasks progress and finish. Each `<TASK>` is one parameter set: its `status` attribute tracks progress (`new` for a task that has not started yet, `running` once the scheduler has picked it up, and `finished` once it completes), its `<INPUT>` names the task file holding that task's parameters, and its `<OUTPUT>` names the file the results will be written to. An example task file — here, `parm.task1.in.xml` — could look like this:

    <SIMULATION>
    <PARAMETERS>
    <PARAMETER name="L">100</PARAMETER>
    <PARAMETER name="SWEEPS">10000</PARAMETER>
    <PARAMETER name="T">0.5</PARAMETER>
    <PARAMETER name="THERMALIZATION">100</PARAMETER>
    </PARAMETERS> 
    </SIMULATION>

Each `<PARAMETER>` entry is one `name`/value pair, identical to the parameters you would set in a plain-text parameter file or a Python parameter dictionary — only the syntax differs. In practice you will rarely write job and task XML by hand: both workflows below generate it for you, either with the `parameter2xml` command-line tool or with `pyalps.writeInputFiles`/`pyalps.writeParameterFile` in Python. The XML format is shown here mainly so that the structure is recognizable if you ever need to inspect or debug it directly.

This section discusses how to prepare, run, and evaluate ALPS simulations. ALPS supports two ways of doing so:

- [Using the command line \(with limited evaluation tools\)](../commandline)
- [Using Python](../usepython)

Both produce the same output files, and you can mix and match the two as needed. Either way, a simulation goes through the same three phases:

- Preparing the input files
- Running the simulation
- Evaluating the results 

## A note on random number generators

Whenever you run Monte Carlo simulations, remember that you are working with pseudo-random numbers. There is always a small chance that your particular application is the one that exposes a flaw in an otherwise well-tested pseudo-random number generator. Hence, as is standard practice for high-accuracy Monte Carlo work, you should rerun your simulation with a different generator — set via the [`RNG` parameter](../../parameters#additional-parameters-for-monte-carlo-simulations) — and check that your results do not change.

For the full set of parameters common to most ALPS applications, including `RNG`, see [Common Parameters](../../parameters). For an overview of the rest of the ALPS documentation, see the [General Introduction](../..).



