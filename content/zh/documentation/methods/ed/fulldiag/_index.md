
---
title: Full Diagonalization 
math: true
weight: 4
---

Full diagonalization of matrices is a powerful numerical method for understanding small quantum systems, especially when the excited states of a quantum system is required. The last step of the Lanczos algorithm also requires a full diagonalization of a small matrix formed at the end of the iterative process. 

We will focus on the dicussion of two numerical methods [Jacobi rotation](jacobi) and [QR factorization](qrfactor). However, [actual calculations in ALPS](implem) are carried out with the [LAPACK software package](https://www.netlib.org/lapack/), which is specialized for linear algebra.


