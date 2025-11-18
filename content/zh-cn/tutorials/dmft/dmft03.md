
---
title: DMFT-03 Interaction
math: true
toc: true
---

## Interaction Expansion CT-INT

It is instructive to run the same calculations as in Tutorial 02 with a CT-INT code. This code performs an expansion in the interaction (instead of the hybridization in the case of CT-HYB). The corresponding python scripts are very similar, you can find them in the directory tutorials/dmft-03-interaction. As in the tutorial DMFT-02 you have the choice between a shorter version [`tutorial3.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3.py) producing data for 2 temperature points (running roughly 10 minutes) or a longer version doing all 6 curves `tutorial3_long.py` (30 minutes). The evaluation may be exactly as in the tutorial [`ALPS_2_Tutorials:DMFT-02_Hybridization`](../dmft02) done using the script [`tutorial3eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3eval.py). 
