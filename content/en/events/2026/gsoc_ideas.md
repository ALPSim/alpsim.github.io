---
title: GSoC Ideas List
description: "GSoC Ideas List"
toc: false
sidebar:
  exclude: true
type: event
weight: 5
---

**ALPS (Algorithms and Libraries for Physics Simulations)** is an open-source ecosystem for simulations of correlated quantum systems and related many-body models.
If you enjoy scientific software, numerical computing, and building tools that researchers rely on, GSoC with ALPS is a chance to make impactful contributions with active mentorship and real users.

Below is a list of projects available in ALPS for GSoC application.

- Implementating a Python API to allow for user-defined operators, quantum numbers, models and geometries.
- Creating Matlab and/or Julia wrappers for the same methods already implemented in PyALPS.
- (C++) Implementing a hash table for quantum numbers for DMRG simulations.
- (C++) Implementing a driver for simulations with randomness.
- (C++) Updating the MPI framework and scheduler for the Monte Carlo applications.
- (C++) Adding MPI parallelization to efficiently handle disorder sampling workloads.
- (C++) Modifying the BlockMatrix class by taking the quantum numbers out of the SubMatrix to make better use of the cache in DMRG
- Creating an ALPS AI agent that guides end users on our website to gather information efficiently. Here prompts will help steer users to the correct place and the correct code. The agent will effectively become an instructional resource for the code, algorithms, and physics ideas.
- Creating an ALPS AI agent to help write scripts to select models and algorithms inside ALPS. The agent will also be trained to assist in plotting data.
- Modernize build/packaging and CI: improve the CMake toolchain, add/extend CI builds + tests, and streamline installation across platforms to lower the barrier for new contributors.



