
---
title: ALPS Installation on Mac/Linux from Spack Packages
description: "ALPS Spack Installation"
weight: 3
toc: true
cascade:
    type: docs
---

### Spack Installation
If you plan to use a parallel version of ALPS or run ALPS in a supercomputer environment, besides the [source installation](../source) you can also install it through the [Spack package management tool](https://packages.spack.io). You are encouraged to check out the details about [ALPS package in Spack](https://packages.spack.io/package.html?name=alps) and the [Spack documentation](https://spack.readthedocs.io/en/latest/index.html).

Spack is able to determine the ALPS dependencies and will install the correct versions required by ALPS. The installation is also local to each user in their own home directory, so it does not affect other users in the same computer cluster. 

### Installation Steps

First, Spack needs to be cloned from the GitHub repository: 
```
git clone --depth=2 https://github.com/spack/spack.git
```
This creates a directory called ```spack```. You can source the appropriate script for your shell. 

For bash, zsh, and sh users:
```
. spack/share/spack/setup-env.sh
```
For csh and tcsh users:
```
source spack/share/spack/setup-env.csh
```

Next, Spack needs to find all available compilers in your computer:
```
spack compiler find
```
This command will enable Spack to detect all available compilers in the system and create a file `packages.yaml` under the hidden `.spack` directory in your home directory. It can be viewed/edited with the command:
```
spack config edit packages
```
Alternatively, you can view the available compilers through:
```
spack compilers
```
The minimum compiler versions required are `gcc@10.5.0` and `clang@13.0.1`.

We can take a look at ALPS information page in Spack:
```
spack info alps
```
It shows the package dependencies of ALPS. All the related packages will be automatically installed through Spack's package management system.

Finally, let us install ALPS!
```
spack install alps
```
To use ALPS, we need to load the package:
```
spack load alps
```

### Spack Installation on Supercomputer Clusters
If you need to install ALPS on a supercomputer cluster, we recommend submitting a batch job to install ALPS through a job node instead of running the above commands on a login node. Since the installation sometimes takes a long time, using login node to install ALPS could affect other users of the cluster. 

We have successfully installed ALPS on the following supercomputer clusters: [NCSA Delta (Illinois)](https://docs.ncsa.illinois.edu/systems/delta/en/latest/index.html), [PSC Bridges (Pittsburgh)](https://www.psc.edu/resources/bridges-2/user-guide/), [Purdue Anvil](https://www.rcac.purdue.edu/anvil#docs), [SDSC Expanse (San Diego)](https://www.sdsc.edu/systems/expanse/user_guide.html), [TACC Stampede3 (Texas)](https://docs.tacc.utexas.edu/hpc/stampede3/). Please read their documentation about how to submit a batch job. Below is one sample batch script we used to install ALPS on the NCSA Delta supercomputer cluster.
```
#!/bin/bash
#SBATCH --mem=16g
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1    # <- match to OMP_NUM_THREADS
#SBATCH --partition=cpu      # <- or one of: gpuA100x4 gpuA40x4 gpuA100x8 gpuMI100x8
#SBATCH --account=bdhb-delta-cpu    # <- match to a "Project" returned by the "accounts" command
#SBATCH --job-name=installALPS
#SBATCH --time=05:00:00      # hh:mm:ss for the job
#SBATCH --constraint="scratch"
#SBATCH -e slurm-%j.err
#SBATCH -o slurm-%j.out
### GPU options ###
##SBATCH --gpus-per-node=2
##SBATCH --gpu-bind=none     # <- or closest
##SBATCH --mail-user=you@yourinstitution.edu
##SBATCH --mail-type="BEGIN,END" See sbatch or srun man pages for more email options

. spack/share/spack/setup-env.sh

spack install alps
```

## Walkthrough Video

### Spack Installation of ALPS (v2.3.3) in WSL.
<br>

{{< youtube id="TD7PuiJKq5U" >}}

### Spack Installation of ALPS (v2.3.4) in WSL.
<br>

{{< youtube id="CJmRIpAi02g" >}}

### Spack Installation of ALPS (v2.3.4) on a Supercomputer Cluster.
<br>

{{< youtube id="yTn7ubU4bqE" >}}

