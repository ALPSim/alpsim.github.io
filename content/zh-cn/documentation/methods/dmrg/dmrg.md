
---
title: 密度矩阵重整化群 
math: true
weight: 11
---

## 简介

密度矩阵重整化群（DMRG）方法是一种被广泛使用的精巧算法，用于求解超大矩阵（例如量子多体问题中出现的矩阵）的低能本征值和本征矢。DMRG 具有一些使其极为强大的特点：它可以处理包含数百个量子自旋或电子的体系，给出极其精确的基态能量，并能计算低维体系中的能隙。它与量子蒙特卡洛方法一起，主导了强关联电子体系领域的大部分数值研究。
DMRG 特别适用于一维体系；如果只关心基态性质和低能本征态，它无疑是首选方法。该算法在具有开放边界条件的体系，以及具有柱面边界条件的准二维体系（梯子）中效率要高得多，在这些情形下只需保留相对较少的态就能达到收敛。

## DMRG 专用参数

| **名称** | **说明** |
| :------- | :-------------- |
| NUMBER_EIGENVALUES | 要计算的本征态和能量的数目。默认为 1；若要计算能隙，应设为 2。 |
| SWEEPS | DMRG 扫描次数。每次扫描包括一次从左到右的半扫描和一次从右到左的半扫描。 |
| NUM_WARMUP_STATES | 用于增长 DMRG 块的初始态数目。若未指定，算法将使用默认值 20。 |
| STATES | 每次半扫描中保留的 DMRG 态数目。用户应当指定 2\*SWEEPS 个不同的 STATES 值，或者指定一个 MAXSTATES 或 NUMSTATES 值。 |
| MAXSTATES | 保留的 DMRG 态的最大数目。用户应选择为每次半扫描指定 STATES 值，或者指定一个 MAXSTATES 或 NUMSTATES，由程序据此增长基。程序会自动确定每次扫描使用多少个态，以 STATES/(2\*SWEEPS) 为步长增长，直到达到 MAXSTATES。 |
| NUMSTATES | 所有扫描中保留的固定 DMRG 态数目。 |
| TRUNCATION_ERROR | 用户可以选择设定模拟的容差，而不是态的数目。程序会自动确定需要保留多少个态以满足该容差。需要注意的是，这可能导致基的大小失控增长，进而导致程序崩溃。因此建议同时用 MAXSTATES 或 NUMSTATES 指定态的最大数目作为约束，如前所述。 |
| LANCZOS_TOLERANCE | 模拟中精确对角化（Davidson/Lanczos）部分的容差。默认值为 10^-7。 |
| CONSERVED_QUANTUMNUMBERS | 所研究模型中守恒的量子数。代码将利用它们把矩阵约化为块形式。如果某个量子数没有指定值，程序将在巨正则系综下运行。例如在自旋链中，如果不指定 Sz_total，程序将使用维数为 dim=2^N 的希尔伯特空间运行。在"正则"系综下运行（例如设置 Sz_total=0）将在维数较小的子空间中工作，从而显著提高性能。关于如何这样做的示例，请参阅 dmrg 代码附带的 parms 文件。 |
| VERBOSE | 若设为大于 0 的整数，将打印额外的输出信息，例如密度矩阵的本征值。为便于调试，共有不同的详细级别，最高为 3，不过用户通常不需要大于 1 的级别。 |
| START_SWEEP | （v1.3b6 之后可用）起始扫描，用于恢复被中断的模拟，或以一组新的态数延续模拟。 |
| START_DIR | 恢复模拟时的起始方向。可以取值 0 或 1，分别表示"从左到右"或"从右到左"。仅在设置了 START_SWEEP 时生效。默认值为 0。 |
| START_ITER | 恢复模拟时的起始迭代。仅在设置了 START_SWEEP 时生效。默认值为 1。 |
| TEMP_DIRECTORY | DMRG 程序会把信息存储在本地文件夹中的临时文件里。这些文件可能数量很多，可能使文件系统不堪重负，尤其是在使用 NFS 时。可以通过在参数文件中设置变量 TEMP_DIRECTORY 来更改这些文件的存储位置。另一种方法是设置系统环境变量 TMPDIR。 |

## 参考文献

- S. R. White, Density matrix formulation for quantum renormalization groups, Phys. Rev. Lett. 69, 2863 (1992).
- S. R. White, Density-matrix algorithms for quantum renormalization groups, Phys. Rev. B 48, 10345 (1993).
- U. Schollwöck, The density-matrix renormalization group, Rev. Mod. Phys. 77, 259 (2005).
- K. Hallberg, Density Matrix Renormalization: A Review of the Method and its Applications, arXiv:cond-mat/0303557.
- R. Noack and S. Manmana, Diagonalization- and Numerical Renormalization-Group-Based Methods for Interacting Quantum Systems, arXiv:cond-mat/0510321
