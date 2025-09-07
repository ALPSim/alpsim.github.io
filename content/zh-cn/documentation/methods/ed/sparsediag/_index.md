
---
title: Sparse Diagonalization
math: true
weight: 3
---

The Hamiltonian matrix in quantum mechanics for systems with local interactions are sparse, meaning most of their entries are zero. Storing and manipulating dense matrices of size $N \times N$ requires $O(N^2)$ memory and $O(N^3)$ computational time for diagonalization. For large $N$, this becomes infeasible. The Lanczos method is designed to take advantage of this sparsity, requiring only matrix-vector products rather than explicit matrix storage or manipulation.

The [Lanczos method](lanczos) is a powerful algorithm for finding a few extremal eigenvalues and their corresponding eigenvectors of large, sparse matrices. It is particularly useful for quantum lattices, where systems are often described by high-dimensional matrices that are too large to handle with dense matrix techniques. The Lanczos method exploits the sparsity of these matrices to efficiently compute the desired eigenvalues and eigenvectors.

The [implementation of the sparse diagonalization in ALPS](implem) is also discussed. 
